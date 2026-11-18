import * as db from "../db/queries.js";

export const get__index = async (req, res) => {
  const posts = await db.select_all_posts();
  res.locals.posts = posts;
  res.locals.page.name = "home";
  res.render("home");
  if (req.user?.is_new_member) delete req.user.is_new_member;
};
