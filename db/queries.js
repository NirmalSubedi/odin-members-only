import pool from "./pool.js";

export const insertUser = (user) => {
  const queryText = `
    INSERT INTO 
    users(first_name, last_name, username, password, is_member, is_admin) 
    VALUES($1, $2, $3, $4, $5, $6)`;
  const { first_name, last_name, username, password, is_member, is_admin } =
    user;
  const { rows } = pool.query(queryText, [
    first_name,
    last_name,
    username,
    password,
    is_member,
    is_admin,
  ]);
  return rows;
};

export const insertPost = (post) => {
  const queryText = `
  INSERT INTO 
  posts(username, title, body)
  VALUES($1, $2, $3)`;
  const { username, title, body } = post;
  const { rows } = pool.query(queryText, [username, title, body]);
  return rows;
};
