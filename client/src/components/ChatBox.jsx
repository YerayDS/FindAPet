import React, { useState, useEffect, useRef, useContext } from "react";
import styles from "./ChatBox.module.css";
import { AuthContext } from "../context/AuthContext";

const ChatBox = ({ chat, onClose, onBack }) => {
  const { user, token } = useContext(AuthContext);
  const [messages, setMessages] = useState(chat?.messages || []);
  const [messageText, setMessageText] = useState("");
  const ws = useRef(null);

  useEffect(() => {
    setMessages(chat?.messages || []);
  }, [chat]);

  useEffect(() => {
    if (!chat || !token) return;

    if (ws.current && ws.current.readyState !== WebSocket.CLOSED) {
      ws.current.close();
    }

    const socket = new WebSocket(`ws://localhost:4000/ws?token=${token}&chatId=${chat._id}`);
    ws.current = socket;

    socket.onopen = () => {
      console.log("✅ Conectado al WebSocket chat", chat._id);
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "new_message") {
          setMessages(prev => [...prev, data.message]);
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
  }, [chat, token]);

  const sendMessage = () => {
    if (!messageText.trim()) return;

    if (!ws.current || ws.current.readyState !== WebSocket.OPEN) {
      console.warn("⚠️ WebSocket no está abierto, no se puede enviar el mensaje");
      return;
    }

    const payload = {
      type: "send_message",
      chatId: chat._id,
      sender: user.id,
      text: messageText.trim(),
    };

    ws.current.send(JSON.stringify(payload));
    setMessageText("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!chat) return null;

  const toStringId = (id) => (id?.toString ? id.toString() : id);
  const userId = toStringId(user.id);

  return (
    <div className={styles.chatBox}>
      <div className={styles.header}>
        <div className={styles["header-left"]}>
          <button
            className={styles.backButton}
            onClick={onBack}
            aria-label="Volver a la lista de chats"
          >
            ←
          </button>
          <span className={styles.title}>
            Chat con{" "}
            {chat.participants.find(p => toStringId(p._id) !== userId)?.username || "Usuario"}
          </span>
        </div>

        <button
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Cerrar chat"
        >
          ×
        </button>
      </div>

      <div className={styles.messages}>
        {messages.length === 0 ? (
          <p className={styles.emptyMessage}>No hay mensajes aún.</p>
        ) : (
          messages.map((msg, idx) => {
            const senderId = toStringId(msg.sender);
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
        onClick={sendMessage}
        disabled={!messageText.trim()}
      >
        Send
      </button>
    </div>
  );
};

export default ChatBox;
