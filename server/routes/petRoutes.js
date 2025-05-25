import express from "express";
import {
  getAllPets,
  createPet,
  updatePet,
  deletePet
} from "../controllers/petController.js";

const router = express.Router();

router.get("/", getAllPets);
router.post("/", createPet);
router.put("/:id", updatePet);
router.delete("/:id", deletePet);

export default router;
