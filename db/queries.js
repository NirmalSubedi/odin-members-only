import pool from "./pool.js";

export const insertUser = (user) => {
  const queryText = `
    INSERT INTO 
    users(first_name, last_name, username, password, is_member, is_admin) 
    VALUES($1, $2, $3, $4, $5, $6)`;
  const { first_name, last_name, username, password, is_member, is_admin } =
    user;
  const { rows } = pool.queryText(queryText, [
    first_name,
    last_name,
    username,
    password,
    is_member,
    is_admin,
  ]);
  return rows;
};
