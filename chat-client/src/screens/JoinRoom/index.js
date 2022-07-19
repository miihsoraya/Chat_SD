import React, { useState } from "react";
import styled from "styled-components";
import { Input, Card, Button } from "antd";
import { socket } from "../../config/web-sockets";

function JoinRoom(props) {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [error, setError] = useState("");
  const onUsernameChange = (e) => {
    const inputValue = e.target.value;
    setUsername(inputValue);
  };
  const onRoomChange = (e) => {
    const roomNo = e.target.value;
    setRoom(roomNo);
  };
  const onClick = () => {
    if (username && room) {
      socket.emit("join", { username, room }, (error) => {
        if (error) {
          setError(error);
          alert(error);
        } else {
          socket.on("welcome", (data) => {
            props.onJoinSuccess(data);
          });
        }
      });
    }
  };
  socket.on("Bem-Vindo!", (data) => {
    console.log("Welcome event inside JoinRoom", data);
    props.onJoinSuccess(data);
  });

  return (
    <StyledCard>
      <label htmlFor="username">
        Usuário
        <Input
          name="username"
          placeholder="Entre com seu Usuário"
          maxLength={25}
          value={username}
          onChange={onUsernameChange}
        />
      </label>
      <label htmlFor="room">
        Número da Sala
        <Input
          name="room"
          placeholder="Entre Com o Número da Sala"
          maxLength={25}
          value={room}
          onChange={onRoomChange}
        />
      </label>
      <StyledButton type="primary" size={"large"} onClick={onClick}>
        Entrar
      </StyledButton>
    </StyledCard>
  );
}

export default JoinRoom;

const StyledCard = styled(Card)`
  width: 581px;
  height: 210px;
  margin: 30vh auto;
  box-shadow: 2px 3px 3px 2.8px #d7d7e4;
  text-align: center;
`;

const StyledButton = styled(Button)`
  margin-top: 10px;
`;
