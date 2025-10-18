import express from "express";
import {
  getAllParticipants,
  addParticipant,
  updateParticipant,
  deleteParticipant,
} from "../controllers/participantController.js";

const router = express.Router();

// Route definitions
router.get("/", getAllParticipants);
router.post("/", addParticipant);
router.put("/:id", updateParticipant);
router.delete("/:id", deleteParticipant);

export default router;


