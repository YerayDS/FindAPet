import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import {
  getAllPets,
  createPet,
  updatePet,
  deletePet,
} from "../controllers/petController.js";

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
router.post("/", upload.single("photo"), createPet);
router.put("/:id", updatePet);
router.delete("/:id", deletePet);

export default router;
