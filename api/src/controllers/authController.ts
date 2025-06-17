import { Request, Response, NextFunction } from "express";
import passport from "passport";
import bcrypt from "bcrypt";
import User from "../models/user";

/**
 * Middleware pour l'authentification d'un utilisateur avec Passport.js en stratégie 'local'.
 * 
 * @param req - objet requête Express contenant les données de la requête.
 * @param res - objet réponse Express utilisé pour envoyer la réponse au client.
 * @param next - fonction callback pour passer au middleware suivant ou gérer les erreurs.
 * 
 * @returns {void} Envoie d'une réponse JSON en cas de succès ou d'erreur.
 */
export const login = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({ message: 'Identifiants invalides' });
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.json({ message: 'Connecté avec succès', user });
    });
  })(req, res, next);
};

/**
 * 
 * @param req - objet requête Express contenant les données de la requête.
 * @param res - objet réponse Express utilisé pour envoyer la réponse au client.
 * @param next - fonction callback pour passer au middleware suivant ou gérer les erreurs. 
 * @returns {void} Envoie d'une réponse JSON en cas de succès ou d'erreur.
 */

export const register = async (req: any, res: any, next:  any) => {
  const { username, password } = req.body;
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return res.status(400).json({ message: 'Utilisateur déjà existant' });
  }
  const hash = bcrypt.hashSync(password, 10);
  const user = new User({ username, password: hash });
  await user.save();
  return res.status(201).json({ message: 'Inscription réussie' });
};


/**
 * 
 * @param req 
 * @param res 
 */

export const logout = (req: Request, res: Response) => {
  (req as any).session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Erreur lors de la déconnexion' });
    }
    res.json({ message: 'Déconnecté avec succès' });
  });
};

/**
 * 
 * @param req 
 * @param res 
 */

export const profile = (req: Request, res: Response) => {
  if (req.isAuthenticated()) {
    res.json({
      message: 'Utilisateur authentifié',
      user: req.user
    });
  } else {
    res.status(401).json({ message: 'Utilisateur non authentifié. Vous devez vous connecter.' });
  }
};
