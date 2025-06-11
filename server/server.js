import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import http from "http";
import { WebSocketServer } from "ws";
import jwt from "jsonwebtoken";

import { connectDB } from "./config/db.js";
import petRoutes from "./routes/petRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import adoptionRoutes from "./routes/adoptionRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";

import Chat from "./models/Chat.js";

dotenv.config();
const app = express();

// Middleware Express
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.get('/', (req, res) => {
  res.send('Servidor funcionando');
});

// --- NUEVO middleware para autenticar token ---
const SECRET = process.env.JWT_SECRET || "tu_clave_secreta_aqui";

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Token faltante" });

  try {
    const user = jwt.verify(token, SECRET);
    req.user = user;
    next();
  } catch (err) {
    res.status(403).json({ error: "Token inválido" });
  }
};

// --- NUEVO endpoint para obtener chats del usuario ---
app.get("/api/chats", authenticateToken, async (req, res) => {
  const userId = req.user.id;
  try {
    const chats = await Chat.find({ participants: userId })
      .populate("participants", "username _id")
      .populate({
        path: "messages.sender",
        select: "username _id"
      });
    res.json(chats);
  } catch (error) {
    console.error("Error obteniendo chats:", error);
    res.status(500).json({ error: "Error obteniendo chats" });
  }
});

app.use("/api/pets", petRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/adoption", adoptionRoutes);
app.use("/api/chats", chatRoutes); // Tu chatRoutes con endpoints como get-or-create, etc.

// Crear servidor HTTP con Express
const server = http.createServer(app);

const wss = new WebSocketServer({ server, path: "/ws" });

const chats = new Map();

wss.on('connection', (ws, req) => {
  console.log('🔌 Nueva conexión WS:', req.url);

  const url = new URL(req.url, `http://${req.headers.host}`);
  const token = url.searchParams.get("token");
  const chatId = url.searchParams.get("chatId");

  console.log('🪪 Token recibido:', token);
  console.log('💬 chatId recibido:', chatId);

  if (!token || !chatId) {
    console.log('❌ Token o chatId faltante, cerrando conexión');
    ws.close(1008, "Token o chatId faltante");
    return;
  }

  let userData;
  try {
    console.log("🔐 Verificando token...");
    userData = jwt.verify(token, SECRET);
    console.log("✅ Token válido. Datos del usuario:", userData);
  } catch (err) {
    console.log('❌ Token inválido. Error:', err.message);
    ws.close(1008, "Token inválido");
    return;
  }

  if (!chats.has(chatId)) {
    chats.set(chatId, new Set());
  }

  const clients = chats.get(chatId);
  clients.add(ws);

  console.log(`👤 Usuario ${userData.id} conectado al chat ${chatId}`);

  ws.on('message', async (message) => {
    console.log("📩 Mensaje recibido por WS:", message);

    let data;
    try {
      data = JSON.parse(message);
    } catch (err) {
      console.log("⚠️ Error al parsear mensaje:", err.message);
      ws.send(JSON.stringify({ error: "Formato JSON inválido" }));
      return;
    }

    if (data.type === "send_message") {
      console.log("✉️ Procesando mensaje para el chat:", chatId);

      try {
        const chat = await Chat.findById(chatId);
        if (!chat) {
          console.log(`❌ Chat no encontrado en la DB: ${chatId}`);
          ws.send(JSON.stringify({ error: "Chat no encontrado" }));
          return;
        }

        if (!chat.participants.some(p => p.toString() === userData.id)) {
          console.log(`⛔ Usuario ${userData.id} no es participante del chat ${chatId}`);
          ws.send(JSON.stringify({ error: "No autorizado en este chat" }));
          return;
        }

        const newMessage = {
          sender: userData.id,
          text: data.text,
          timestamp: new Date()
        };

        chat.messages.push(newMessage);
        await chat.save();

        console.log(`✅ Mensaje guardado. Enviando a ${clients.size} cliente(s)...`);

        clients.forEach(client => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({
              type: "new_message",
              message: newMessage,
            }));
          }
        });
      } catch (error) {
        console.error("❌ Error al manejar mensaje WS:", error);
        ws.send(JSON.stringify({ error: "Error interno del servidor" }));
      }
    }
  });

  ws.on('close', () => {
    console.log(`🔌 Usuario ${userData.id} desconectado del chat ${chatId}`);
    clients.delete(ws);
    if (clients.size === 0) {
      chats.delete(chatId);
    }
  });

  ws.on('error', (err) => {
    console.error(`❗ WebSocket error para usuario ${userData.id} en chat ${chatId}:`, err.message);
  });
});

const PORT = 4000;

connectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`🚀 WebSocket server running on ws://localhost:${PORT}/ws`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to DB:", err);
    process.exit(1);
  });
