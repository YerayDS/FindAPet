import express from "express";
import { getAdoptionCount, incrementAdoptionCount } from "../controllers/adoptionController.js";

const router = express.Router();

router.get("/count", getAdoptionCount);
router.post("/increment", incrementAdoptionCount);

export default router;
