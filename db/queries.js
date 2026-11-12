import pool from "./pool.js";

export const insert_user = (user) => {
  const query_text = `
    INSERT INTO 
    users(first_name, last_name, username, password, is_member, is_admin) 
    VALUES($1, $2, $3, $4, $5, $6)`;
  const { first_name, last_name, username, password, is_member, is_admin } =
    user;
  const { rows } = pool.query(query_text, [
    first_name,
    last_name,
    username,
    password,
    is_member,
    is_admin,
  ]);
  return rows;
};

export const insert_post = (post) => {
  const query_text = `
  INSERT INTO 
  posts(username, title, body)
  VALUES($1, $2, $3)`;
  const { username, title, body } = post;
  const { rows } = pool.query(query_text, [username, title, body]);
  return rows;
};

export const update_user_to_member = (user) => {
  const query_text = `
  UPDATE users
  SET is_member = true
  WHERE username = $1`;
  const { username } = user;
  const { rows } = pool.query(query_text, [username]);
  return rows;
};

export const select_user = (user) => {
  const query_text = `
  SELECT *
  FROM users
  WHERE username = $1`;
  const { username } = user;
  const { rows } = pool.query(query_text, [username]);
  return rows;
};

export const select_all_posts = () => {
  const query_text = `
  SELECT *
  FROM posts`;
  const { username } = user;
  const { rows } = pool.query(query_text, [username]);
  return rows;
};

export const delete_post = (post) => {
  const query_text = `
  DELETE FROM posts
  WHERE post_id = $1`;
  const { post_id } = post;
  const { rows } = pool.query(query_text, [post_id]);
  return rows;
};
