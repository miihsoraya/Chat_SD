"use strict";

/**
 * An asynchronous bootstrap function that runs before
 * your application gets started.
 *
 * This gives you an opportunity to set up your data model,
 * run jobs, or perform some special logic.
 *
 * See more details here: https://strapi.io/documentation/developer-docs/latest/setup-deployment-guides/configurations.html#bootstrap
 */

const {
  findUser,
  createUser,
  userExists,
  getUsersInRoom,
  deleteUser,
} = require("./utils/database");

module.exports = () => {
  var io = require("socket.io")(strapi.server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
      allowedHeaders: ["my-custom-header"],
      credentials: true,
    },
  });

  io.on("connection", function (socket) {
    socket.on("join", async ({ username, room }, callback) => {
      try {
        const userExists = await findUser(username, room);

        if (userExists.length > 0) {
          callback(
            `O usuário ${username} já existe na sala ${room}. Escolha um nome diferente ou sala.`
          );
        } else {
          const user = await createUser({
            username: username,
            room: room,
            status: "ATIVO",
            socketId: socket.id,
          });

          if (user) {
            socket.join(user.room);
            socket.emit("welcome", {
              user: "Robô",
              text: `${user.username}, Bem-Vindo a sala ${user.room}.`,
              userData: user,
            });
            socket.broadcast.to(user.room).emit("message", {
              user: "Robô",
              text: `${user.username} entrou na sala.`,
            });
            io.to(user.room).emit("roomInfo", {
              room: user.room,
              users: getUsersInRoom(user.room),
            });
          } else {
            callback(`O usuáio ${username} não pode ser criado.`);
          }
        }
        callback();
      } catch (err) {
        console.log("Ocorreu um erro.", err);
      }
    });

    socket.on("sendMessage", async (data, callback) => {
      try {
        const user = await userExists(data.userId);
        if (user) {
          io.to(user.room).emit("message", {
            user: user.username,
            text: data.message,
          });
        } else {
          callback(`O usuário ${data.userId} não existe.`);
        }
        callback();
      } catch (error) {
        console.log("Erro ao enviar mensagem", error);
      }
    });

    socket.on("disconnect", async (data) => {
      try {
        console.table(data);
        console.log("Usuário desconectou.", data);
        const user = await deleteUser(socket.id);
        console.log("Usuário deletado.", user);
        if (user.length > 0) {
          io.to(user[0].room).emit("message", {
            user: user[0].username,
            text: `${user[0].username} saiu da sala.`,
          });
          io.to(user[0].room).emit("roomInfo", {
            room: user[0].room,
            users: await getUsersInRoom(user[0].room),
          });
        }
      } catch (error) {
        console.log("Erro ao desconectar usuário.", error);
      }
    });
  });
};
