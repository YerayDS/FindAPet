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

const allowedOrigins = [
  'http://localhost:5173',
  'https://find-a-pet-git-main-yeraydshs-projects.vercel.app',
  'https://find-a-pet-six.vercel.app'
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`Origin ${origin} no permitido por CORS`));
    }
  },
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

const SECRET = process.env.JWT_SECRET || "Clave";

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
app.use("/api/chats", chatRoutes); 

const server = http.createServer(app);

const wss = new WebSocketServer({ server, path: "/ws" });

const chats = new Map();

wss.on('connection', (ws, req) => {

  const url = new URL(req.url, `http://${req.headers.host}`);
  const token = url.searchParams.get("token");
  const chatId = url.searchParams.get("chatId");


  if (!token || !chatId) {
    ws.close(1008, "Token o chatId faltante");
    return;
  }

  let userData;
  try {
    userData = jwt.verify(token, SECRET);
  } catch (err) {
    ws.close(1008, "Token inválido");
    return;
  }

  if (!chats.has(chatId)) {
    chats.set(chatId, new Set());
  }

  const clients = chats.get(chatId);
  clients.add(ws);


  ws.on('message', async (message) => {

    let data;
    try {
      data = JSON.parse(message);
    } catch (err) {
      ws.send(JSON.stringify({ error: "Formato JSON inválido" }));
      return;
    }

    if (data.type === "send_message") {

      try {
        const chat = await Chat.findById(chatId);
        if (!chat) {
          ws.send(JSON.stringify({ error: "Chat no encontrado" }));
          return;
        }

        if (!chat.participants.some(p => p.toString() === userData.id)) {
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


        clients.forEach(client => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({
              type: "new_message",
              message: newMessage,
            }));
          }
        });
      } catch (error) {
        ws.send(JSON.stringify({ error: "Error interno del servidor" }));
      }
    }
  });

  ws.on('close', () => {
    clients.delete(ws);
    if (clients.size === 0) {
      chats.delete(chatId);
    }
  });

  ws.on('error', (err) => {
  });
});

const PORT = process.env.PORT || 4000;

connectDB()
  .then(() => {
    server.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on http://0.0.0.0:${PORT}`);
      console.log(`WebSocket server running on ws://0.0.0.0:${PORT}/ws`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to DB:", err);
    process.exit(1);
  });
