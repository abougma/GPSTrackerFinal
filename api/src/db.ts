import mongoose from "mongoose";

// Utiliser une variable d'environnement pour l'URI MongoDB, avec un fallback pour le développement local
const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/dbProjet";

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connexion à MongoDB réussie !");
  } catch (error) {
    console.error("Erreur de connexion à MongoDB :", error);
    process.exit(1);
  }
};

export default connectDB;
