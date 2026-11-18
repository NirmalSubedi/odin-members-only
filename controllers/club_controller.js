import * as db from "../db/queries.js";

export const get__join_club = (req, res) => {
  res.locals.page.name = "join_club";
  res.render("join_club");
};

export const post__join_club = async (req, res) => {
  await db.update_user_to_member(req.user);
  req.user.is_member = true;
  req.user.is_new_member = true;
  res.redirect("/");
};
