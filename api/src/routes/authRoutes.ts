import express from "express";
import { login, register, logout, profile } from "../controllers/authController";

const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.post("/logout", logout);
router.get("/profile", profile);

export default router;
