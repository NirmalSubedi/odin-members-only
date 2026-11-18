import { matchedData } from "express-validator";
import * as db from "../db/queries.js";

export const get__new_post = (req, res) => {
  res.locals.page.name = "new_post";
  res.render("new_post");
};

export const post__new_post = async (req, res) => {
  const new_post = {
    username: req.user.username,
    ...matchedData(req),
  };
  await db.insert_post(new_post);
  res.redirect("/");
};

export const post__delete_post = async (req, res) => {
  try {
    await db.delete_post(matchedData(req));
  } catch {}
  res.redirect("/");
};
