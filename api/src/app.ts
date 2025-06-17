import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";
import cors from "cors";
import bodyParser from 'body-parser'; 
import authRoutes from "./routes/authRoutes";
import messageRoutes from "./routes/messageRoutes";
import positionRoutes from "./routes/positionRoutes";
import analyticsRoutes from './routes/analyticsRoutes'; 
import connectDB from "./db";
import "./config/passport";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware pour les données binaires comme CBOR (pour receivePosition)
app.use("/api/receivePosition", bodyParser.raw({ type: 'application/octet-stream', limit: '10mb' }));

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

/*
const allowedOrigins = ['http://localhost:5173', 'http://localhost:8081'];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed for this origin: ' + origin));
    }
  },
  credentials: true
})); */

// Utiliser une variable d'environnement pour l'URL MongoDB, avec un fallback pour le développement local
const mongoUrl = process.env.MONGODB_URI || "mongodb://localhost:27017/dbProjet";
// Envisagez d'utiliser une variable d'environnement pour le secret de session
const sessionSecret = process.env.SESSION_SECRET || 'TCP007IOT';

app.use(session({
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: mongoUrl,
    collectionName: "sessions",
  }),
  cookie: {
    maxAge: 1000 * 60 * 30, // 30 minutes
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Mettre à true en production si HTTPS est utilisé
  },
}));



app.use(passport.initialize());
app.use(passport.session());

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api", positionRoutes);
app.use("/api/analytics", analyticsRoutes); 

connectDB();

export default app;
