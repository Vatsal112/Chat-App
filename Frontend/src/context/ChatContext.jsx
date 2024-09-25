import { createContext, useContext, useMemo, useState } from "react";

import io from "socket.io-client";
const ChatContext = createContext({
  username: "",
  setUName: () => {},
  isSettedUsername: false,
});

export const ChatContextProvider = ({ children }) => {
  const socket = useMemo(
    () => io("http://localhost:3000", { transports: ["websocket"] }),
    []
  );
  const [username, setUsername] = useState("");
  const [isSettedUsername, setIsSettedUsername] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const setUName = (name) => {
    setUsername(name);
  };
  const setContextOnlineUsers = (users)=>{
    setOnlineUsers(users)
  }
  return (
    <ChatContext.Provider
      value={{
        setUName,
        username,
        isSettedUsername,
        setIsSettedUsername,
        socket,
        setContextOnlineUsers,
        onlineUsers
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
