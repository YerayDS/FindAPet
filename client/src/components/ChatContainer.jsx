import React, { useState, useEffect, useContext } from "react";
import ChatBox from "./ChatBox";
import { AuthContext } from "../context/AuthContext";

const ChatContainer = () => {
  const { token, user } = useContext(AuthContext);
  const [chatList, setChatList] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    if (!token) return;

    async function fetchChats() {
      try {
        const res = await fetch("http://localhost:4000/api/chats", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Error cargando chats");

        const data = await res.json();
        setChatList(data);
      } catch (error) {
        console.error(error);
      }
    }

    fetchChats();
  }, [token]);

  const handleToggleChatList = () => {
    setChatOpen(!chatOpen);
    setSelectedChat(null);
    console.log("handleToggleChatList called");
    console.log("chatOpen:", !chatOpen);
    console.log("selectedChat:", null);
  };

  const handleSelectChat = (chat) => {
    setSelectedChat(chat);
    console.log("handleSelectChat called");
    console.log("selectedChat:", chat._id);
  };

const handleBack = () => {
  setSelectedChat(null);
  setChatOpen(true); // 👈 Asegúrate de que se mantenga abierto
  console.log("handleBack called");
};

  console.log("Render ChatContainer");
  console.log("chatOpen:", chatOpen);
  console.log("selectedChat:", selectedChat ? selectedChat._id : null);

  return (
    <div>
      <button className="navchat-button" onClick={handleToggleChatList}>
        Chat
      </button>

      {chatOpen && !selectedChat && (
        <div className="chat-list">
          {chatList.length === 0 && <p>No tienes conversaciones aún.</p>}
          {chatList.map((chat) => {
            const otherUser = chat.participants.find((p) => p._id !== user.id);
            return (
              <div
                key={chat._id}
                className="chat-list-item"
                onClick={() => handleSelectChat(chat)}
                style={{
                  cursor: "pointer",
                  padding: "8px",
                  borderBottom: "1px solid #ccc",
                }}
              >
                {otherUser?.username || "Desconocido"}
              </div>
            );
          })}
        </div>
      )}

      {chatOpen && selectedChat && (
        <ChatBox
          chat={selectedChat}
          onClose={() => {
            setChatOpen(false);
            console.log("onClose called");
            console.log("chatOpen:", false);
          }}
          onBack={handleBack}
        />
      )}
    </div>
  );
};

export default ChatContainer;
