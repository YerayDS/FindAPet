import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import {
  getAllPets,
  createPet,
  updatePet,
  deletePet,
  getPetById,
} from "../controllers/petController.js";

import { authenticateToken } from "../middleware/authMiddleware.js";  // Importa el middleware

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + Date.now() + ext);
  },
});
const upload = multer({ storage });

router.get("/", getAllPets);

router.get("/:id", getPetById);


// Ejemplo de ruta protegida (ejemplo simple)
router.get("/protected", authenticateToken, (req, res) => {
  res.json({ message: "This route is protected", user: req.user });
});

router.post("/", authenticateToken, upload.single("photo"), createPet); // Protección en ruta POST para crear mascota

router.put("/:id", authenticateToken, updatePet); // Protegemos editar mascota

router.delete("/:id", authenticateToken, deletePet); // Protegemos borrar mascota

export default router;
