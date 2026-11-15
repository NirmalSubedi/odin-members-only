import bcrypt from "bcryptjs";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { UNAUTHORIZED } from "../config.js";
import * as db from "../db/queries.js";

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const [user] = await db.select_user({ username });
      if (!user) return done(null, false, { message: "Incorrect username." });

      const match = await bcrypt.compare(password, user.password);
      if (!match) return done(null, false, { message: "Incorrect password." });

      return done(null, user);
    } catch (error) {
      done(error);
    }
  }),
);

passport.serializeUser((user, done) => {
  done(null, user.username);
});

passport.deserializeUser(async (username, done) => {
  try {
    const [user] = await db.select_user({ username });

    done(null, user);
  } catch (error) {
    done(error);
  }
});

export const authenticate_user = passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureMessage: true,
});

export const isAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.sendStatus(UNAUTHORIZED);
  }
};

export const isMember = (req, res, next) => {
  if (req.isAuthenticated() && req.user.is_member) {
    next();
  } else {
    res.sendStatus(FORBIDDEN);
  }
};

export const isAdmin = (req, res, next) => {
  if (req.isAuthenticated() && req.user.is_admin) {
    next();
  } else {
    res.sendStatus(FORBIDDEN);
  }
};
