import bcrypt from "bcrypt";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { FORBIDDEN, UNAUTHORIZED } from "../config.js";
import * as db from "../db/queries.js";

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const [user] = await db.select_user({ username });
      if (!user)
        return done(null, false, { message: "username: Incorrect email." });

      const match = await bcrypt.compare(password, user.password);
      if (!match)
        return done(null, false, { message: "password: Incorrect password." });

      return done(null, user);
    } catch (error) {
      done(error);
    }
  }),
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser(async (user, done) => {
  done(null, user);
});

export const check_auth = (config) => (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    if (config?.on_fail) config.on_fail(req, res);
    else res.sendStatus(UNAUTHORIZED);
  }
};

export const is_admin = (req, res, next) => {
  if (req.isAuthenticated() && req.user.is_admin) {
    next();
  } else {
    res.sendStatus(FORBIDDEN);
  }
};
