async function findUser(username, room) {
  try {
    const userExists = await strapi.services.users.find({ username, room });
    return userExists;
  } catch (error) {
    console.log("Erro ao procurar usuário.", error);
  }
}

async function createUser({ username, room, status, socketId }) {
  try {
    const user = await strapi.services.users.create({
      username: username,
      room: room,
      status: status,
      socketId: socketId,
    });
    return user;
  } catch (error) {
    console.log("Erro ao criar usuário", error);
  }
}

async function userExists(id) {
  try {
    const user = await strapi.services.users.findOne({ id: id });
    return user;
  } catch (error) {
    console.log("Erro ao procurar usuário.", error);
  }
}

async function getUsersInRoom(room) {
  try {
    const usersInRoom = await strapi.services.users.find({ room });
    return usersInRoom;
  } catch (error) {
    console.log("Erro ao procurar usuário.", error);
  }
}

async function deleteUser(socketId) {
  try {
    const user = await strapi.services.users.delete({ socketId: socketId });
    return user;
  } catch (error) {
    console.log("Erro ao deletar usuário.", error);
  }
}

module.exports = {
  findUser,
  createUser,
  userExists,
  getUsersInRoom,
  deleteUser,
};
