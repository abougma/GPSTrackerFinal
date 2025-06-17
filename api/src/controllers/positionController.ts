import { Request, Response } from "express";
import Position from "../models/position";
import * as cbor from "cbor"; 


export const receivePosition = async (req: Request, res: Response) => {
  try {
    // Décodage du buffer CBOR reçu
    const decodedData = cbor.decodeFirstSync(req.body); 
    const { id, latitude, longitude } = decodedData;

    if (id === undefined || latitude === undefined || longitude === undefined) {
      return res.status(400).json({ message: "deviceId, latitude et longitude requis." });
    }
    // Assurez-vous que id est un nombre si deviceId est de type Number
    if (typeof id !== 'number') {
      return res.status(400).json({ message: "deviceId doit être un nombre." });
    }

    const newPosition = new Position({ deviceId: id, latitude, longitude });
    await newPosition.save();

    return res.status(201).json({
      message: "Position enregistrée avec succès.",
      data: newPosition,
    });
  } catch (error) {
    console.error("Erreur lors de l'enregistrement des données IoT :", error);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};


export const createPosition = async (req: Request, res: Response) => {
  try{
    const { deviceId, latitude, longitude } = req.body;

    if (typeof deviceId !== 'number' || typeof latitude !== 'number' || typeof longitude !== 'number') {
      res.status(400).json({ message: 'deviceId, latitude et longitude doivent être des nombres.' });
      return 
    }
    const position = new Position({
      deviceId,
      latitude,
      longitude
    });
    const savedPosition = await position.save();

    res.status(201).json(savedPosition);
    return 
  
  }catch(err){
    console.error('Erreur lors de la création de la position:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
}
