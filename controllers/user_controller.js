import bcrypt from "bcrypt";
import { matchedData } from "express-validator";
import passport from "passport";
import * as db from "../db/queries.js";

export const get__signup = (req, res) => {
  res.locals.page.name = "signup";
  res.render("signup");
};

export const post__signup = async (req, res, next) => {
  try {
    const new_user = matchedData(req);
    new_user.password = await bcrypt.hash(new_user.password, SALT_LENGTH);
    new_user.is_admin = new_user.admin_secret === ADMIN_SECRET;
    new_user.is_member = new_user.is_admin;
    const [user] = await db.insert_user(new_user);
    req.login(user, (error) => {
      if (error) return next(error);
      res.redirect("/");
    });
  } catch (error) {
    next(error);
  }
};

export const get__login = (req, res) => {
  if (req.session?.locals_values) {
    res.locals.values = req.session.locals_values;
    delete req.session.locals_values;
  }
  res.locals.page.name = "login";
  res.render("login");
  if (req.session?.is_auth_fail) delete req.session.is_auth_fail;
  if (req.session?.messages) req.session.messages.length = 0;
};

export const post__login = (req, res, next) =>
  passport.authenticate("local", (error, user, info) => {
    if (error) return next(error);
    if (!user) {
      req.session.locals_values = matchedData(req, { onlyValidData: false });
      return res.redirect("/login");
    }
    req.login(user, (error) => {
      if (error) return next(error);
      res.redirect("/");
    });
  })(req, res, next);

export const get__logout = (req, res, next) => {
  req.logout((error) => {
    if (error) return next(error);
    res.redirect("/");
  });
};
