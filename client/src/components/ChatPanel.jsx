import React, { useState, useEffect, useRef, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import styles from "./ChatBox.module.css"; 

const ChatPanel = ({ isInPetDetail, targetUserId }) => {
  const { token, user } = useContext(AuthContext);
  const [chatList, setChatList] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const ws = useRef(null);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (!token) return;

    async function fetchChats() {
      try {
        const res = await fetch("${API_URL}/api/chats", {
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

  useEffect(() => {
    if (!selectedChat || !token) return;

    setMessages(selectedChat?.messages || []);

    if (ws.current && ws.current.readyState !== WebSocket.CLOSED) {
      ws.current.close();
    }

    const wsProtocol = API_URL.startsWith("https") ? "wss" : "ws";
    const wsHost = API_URL.replace(/^https?:\/\//, "");
    const socket = new WebSocket(`${wsProtocol}://${wsHost}/ws?token=${token}&chatId=${selectedChat._id}`);


    ws.current = socket;

    socket.onopen = () => {
      console.log("Conectado al WebSocket chat", selectedChat._id);
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "new_message") {
          setMessages((prev) => [...prev, data.message]);
        }
      } catch (err) {
        console.error("Error parseando mensaje WS:", err);
      }
    };

    socket.onerror = (error) => {
      console.error("Error WebSocket:", error);
    };

    socket.onclose = () => {
      console.log("WebSocket cerrado");
    };

    return () => {
      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        ws.current.close();
      }
    };
  }, [selectedChat, token]);

  const handleSendMessage = () => {
    if (!messageText.trim()) return;
    if (!ws.current || ws.current.readyState !== WebSocket.OPEN) {
      return;
    }

    const payload = {
      type: "send_message",
      chatId: selectedChat._id,
      sender: user.id,
      text: messageText.trim(),
    };

    ws.current.send(JSON.stringify(payload));
    setMessageText("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleToggleChatList = async () => {
    if (!chatOpen && isInPetDetail && targetUserId) {
      const existingChat = chatList.find(chat =>
        chat.participants.some(p => toStringId(p._id) === toStringId(targetUserId))
      );

      if (existingChat) {
        setSelectedChat(existingChat);
      } else {
        try {
          const resNewChat = await fetch("${API_URL}/api/chats", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ userId: targetUserId }),
          });

          if (resNewChat.ok) {
            const newChat = await resNewChat.json();
            setChatList(prev => [...prev, newChat]);
            setSelectedChat(newChat);
          } else {
            console.error("Error creando nuevo chat");
          }
        } catch (error) {
          console.error("Error creando nuevo chat", error);
        }
      }
    } else if (!chatOpen && !isInPetDetail) {
      setSelectedChat(null);
    }

    setChatOpen(!chatOpen);
  };

  const handleSelectChat = (chat) => {
    setSelectedChat(chat);
  };

  const handleBack = () => {
    setSelectedChat(null);
    setChatOpen(true);
  };

  const toStringId = (id) => (id?.toString ? id.toString() : id);
  const userId = toStringId(user.id);

  return (
    <div>
      <button className="navchat-button" onClick={handleToggleChatList}>
        Chat
      </button>

      {chatOpen && !selectedChat && (
        <div className={styles.chatBox}>
          <div className={styles.header}>
            <div className={styles["header-left"]}>
              <span className={styles.title}>Tus chats</span>
            </div>
            <button className={styles.closeButton} onClick={handleToggleChatList}>×</button>
          </div>

          <div className={styles.messages}>
            {chatList.length === 0 ? (
              <p className={styles.emptyMessage}>You don't have any conversations yet.</p>
            ) : (
              chatList.map((chat) => {
                const otherUser = chat.participants.find((p) => toStringId(p._id) !== userId);
                return (
                  <div
                    key={chat._id}
                    className={styles.userRow}
                    onClick={() => handleSelectChat(chat)}
                  >
                    {otherUser?.username || "Desconocido"}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {chatOpen && selectedChat && (
        <div className={styles.chatBox}>
          <div className={styles.header}>
            <div className={styles["header-left"]}>
              <button className={styles.backButton} onClick={handleBack}>←</button>
              <span className={styles.title}>
                Chat with{" "}
                {selectedChat.participants.find(p => toStringId(p._id) !== userId)?.username || "Usuario"}
              </span>
            </div>
            <button className={styles.closeButton} onClick={handleToggleChatList}>×</button>
          </div>

          <div className={styles.messages}>
            {messages.length === 0 ? (
              <p className={styles.emptyMessage}>No hay mensajes aún.</p>
            ) : (
              messages.map((msg, idx) => {
                let senderId = "";
                if (typeof msg.sender === "string" || typeof msg.sender === "number") {
                  senderId = String(msg.sender);
                } else if (msg.sender && typeof msg.sender === "object") {
                  senderId = String(msg.sender._id || msg.sender.id || "");
                }

                const isSentByUser = senderId === userId;

                return (
                  <div
                    key={idx}
                    className={`${styles.message} ${isSentByUser ? styles.sent : styles.received}`}
                  >
                    <div className={styles.messageText}>{msg.text}</div>
                  </div>
                );
              })
            )}
          </div>

          <textarea
            placeholder="Write a message..."
            className={styles.input}
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={3}
          />
          <button
            className={styles.sendButton}
            onClick={handleSendMessage}
            disabled={!messageText.trim()}
          >
            Send
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatPanel;
