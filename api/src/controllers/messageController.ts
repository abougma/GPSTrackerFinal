import { Request, Response } from "express";
import { messageSchema } from "../schemas/messageSchema";
import Message from "../models/messages";
import { sendToTCPServer } from "../utils/tcpClient"; // Chemin d'importation mis à jour si nécessaire

export const sendMessage = async (req: any, res: any) => {
  const validationResult = messageSchema.safeParse(req.body);
  if (!validationResult.success) {
    return res.status(400).json(validationResult.error.errors);
  }
  const { message } = req.body;
  if (!message) {
    return res.status(400).send("Message is required");
  }
  try {
    const response = await sendToTCPServer(message);
    const newMessage = new Message({ content: message });
    await newMessage.save();
    res.json({ message: "Message sent to TCP server", response });
  } catch (err) {
    res.status(500).send("Error communicating with TCP server");
  }
};

export const getMessages = async (req: Request, res: Response) => {
  try {
    const messages = await Message.find();
    res.json(messages);
  } catch (err) {
    console.error("Error retrieving messages from MongoDB:", err);
    res.status(500).send("Error retrieving messages");
  }
};
