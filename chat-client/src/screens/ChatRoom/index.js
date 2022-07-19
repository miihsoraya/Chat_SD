import React, { useEffect, useState } from "react";
import { Input } from "antd";
import { socket } from "../../config/web-sockets";
import { history } from "../../config/network";
import Header from "../../components/Header";
import List from "../../components/List";
import Messages from "../../components/Messages";
import {
  ChatContainer,
  StyledContainer,
  ChatBox,
  StyledButton,
  SendIcon,
} from "./styles";

function ChatRoom(props) {
  const { username, room, joinData } = props;
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (Object.keys(joinData).length > 0) {
      setMessages([joinData]);
      socket.on("message", (message, error) => {
        setMessages((msgs) => [...msgs, message]);
      });
      socket.on("roomInfo", (users) => {
        setUsers(users.users);
      });
    } else {
      history.push("/join");
    }
  }, [joinData]);

  const handleChange = (e) => {
    setMessage(e.target.value);
  };
  const handleClick = (e) => {
    sendMessage(message);
  };

  const sendMessage = (message) => {
    if (message) {
      socket.emit(
        "sendMessage",
        { userId: joinData.userData.id, message },
        (error) => {
          if (error) {
            alert(error);
            history.push("/join");
          }
        }
      );
      setMessage("");
    } else {
      alert("A mensagem nao pode ser vazia.");
    }
  };

  return (
    <ChatContainer>
      <Header room={room} />
      <StyledContainer>
        <List users={users.users} />
        <ChatBox>
          <Messages messages={messages} username={username} />
          <Input
            text="text"
            placeholder="Digite sua mensagem"
            value={message}
            onChange={handleChange}
          />
          <StyledButton onClick={handleClick}>
            <SendIcon>
              <i className="fa fa-paper-plane" />
            </SendIcon>
          </StyledButton>
        </ChatBox>
      </StyledContainer>
    </ChatContainer>
  );
}

export default ChatRoom;
