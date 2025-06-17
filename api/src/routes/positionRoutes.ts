import express from 'express';
import Position from '../models/position';
import { createPosition } from '../controllers/positionController';

const router = express.Router();

router.get('/positions', async (req, res) => {
  try {
    const positions = await Position.find().sort({ createdAt: -1 });
    res.json(positions);
  } catch (error) {
    console.error("Erreur lors de la récupération des positions :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

router.post('/positions', createPosition);

export default router;
