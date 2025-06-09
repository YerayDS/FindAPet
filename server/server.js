import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { connectDB } from "./config/db.js";
import petRoutes from "./routes/petRoutes.js";
import authRoutes from "./routes/authRoutes.js";


dotenv.config();
const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',  // o true si quieres permitir todos, pero mejor poner el origen exacto
  credentials: true
}));

app.use(express.json());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Sirve los archivos estáticos de la carpeta uploads
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.get('/', (req, res) => {
  res.send('Servidor funcionando');
});

// Routes
app.use("/api/pets", petRoutes);
app.use("/api/auth", authRoutes);


// Start server
const PORT = 4000;


connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to DB:", err);
    process.exit(1); // Salir si no conecta a la BD
  });
