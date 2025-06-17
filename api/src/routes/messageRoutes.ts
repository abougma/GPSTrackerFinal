import express from "express";
import { sendMessage, getMessages } from "../controllers/messageController";

const router = express.Router();

router.post("/send-message", sendMessage);
router.get("/", getMessages);

export default router;
