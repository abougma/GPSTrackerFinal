import express, { Request, Response } from 'express';
import User from '../models/user'; 

const router = express.Router();

router.get('/usersCount', async (req: Request, res: Response) => {
  try {
    const dateFieldForAggregation = "$timestamp"; 
    const aggregatedData = await User.aggregate([
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",        
              date: dateFieldForAggregation 
            }
          },
          count: {
            $sum: 1                     
          }
        }
      }
    ]);

    res.status(200).json(aggregatedData);

  } catch (error) {
    console.error("Erreur lors de l'agrégation du nombre d'utilisateurs par jour:", error);
    res.status(500).json({ message: "Erreur serveur lors de la récupération des données agrégées." });
  }
});

export default router;
