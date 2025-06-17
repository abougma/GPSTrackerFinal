import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import User from '../models/user';
import bcrypt from 'bcrypt';

passport.use(new LocalStrategy(
    async (username, password, done) => {
      try {
        const user = await User.findOne({ username });
  
        if (!user) {
          return done(null, false, { message: 'Utilisateur non trouvé' });
        }
  
        const isMatch = await bcrypt.compare(password, user.password as string);
  
        if (!isMatch) {
          return done(null, false, { message: 'Mot de passe incorrect' });
        }
  
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  ));


// Sérialisation/désérialisation pour sessions
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});
