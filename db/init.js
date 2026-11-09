import {
  FIRST_NAME_COLUMN_MAX_LENGTH,
  LAST_NAME_COLUMN_MAX_LENGTH,
  PASSWORD_COLUMN_MAX_LENGTH,
} from "../config.js";
import { pool } from "./pool.js";

const tableQueries = `
CREATE TABLE IF NOT EXISTS users (
  user_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  first_name VARCHAR(${FIRST_NAME_COLUMN_MAX_LENGTH}) NOT NULL,
  last_name VARCHAR(${LAST_NAME_COLUMN_MAX_LENGTH}) NOT NULL,
  username TEXT NOT NULL,
  password VARCHAR(${PASSWORD_COLUMN_MAX_LENGTH}) NOT NULL,
  is_member BOOLEAN NOT NULL,
  is_admin BOOLEAN NOT NULL
);

CREATE TABLE IF NOT EXISTS posts (
  post_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id INTEGER REFERENCES users ON UPDATE CASCADE ON DELETE RESTRICT,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
`;

(async () => {
  console.log("Initializing database...");
  const client = await pool.connect();
  await client.query(tableQueries);
  client.release();
  await pool.end();
  console.log("Done initializing database!");
})();
