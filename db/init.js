import {
  FIRST_NAME_COLUMN_MAX_LENGTH,
  LAST_NAME_COLUMN_MAX_LENGTH,
  PASSWORD_COLUMN_MAX_LENGTH,
  USERNAME_COLUMN_MAX_LENGTH,
} from "../config.js";
import { pool } from "./pool.js";

const sql = `
CREATE TABLE IF NOT EXISTS users (
  first_name VARCHAR(${FIRST_NAME_COLUMN_MAX_LENGTH}) NOT NULL,
  last_name VARCHAR(${LAST_NAME_COLUMN_MAX_LENGTH}) NOT NULL,
  username VARCHAR(${USERNAME_COLUMN_MAX_LENGTH}) PRIMARY KEY,
  password VARCHAR(${PASSWORD_COLUMN_MAX_LENGTH}) NOT NULL,
  is_member BOOLEAN NOT NULL,
  is_admin BOOLEAN NOT NULL
);

CREATE TABLE IF NOT EXISTS posts (
  post_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  username TEXT REFERENCES users ON UPDATE CASCADE ON DELETE SET NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
`;

(async () => {
  console.log("Initializing database...");
  await pool.query(sql);
  await pool.end();
  console.log("Done initializing database!");
})();
