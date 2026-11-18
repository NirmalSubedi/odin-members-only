import pg_simple from "connect-pg-simple";
import session from "express-session";
import { NODE_ENV, SESSION_COOKIE_MAX_AGE, SESSION_SECRET } from "../config.js";
import { pool } from "../db/pool.js";

export const session_store = pg_simple(session);
export const app_session = session({
  store: new session_store({
    pool,
    tableName: "user_sessions",
    createTableIfMissing: true,
  }),
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: SESSION_COOKIE_MAX_AGE,
  },
});

if (NODE_ENV === "production") {
  app_session.cookie.secure = true;
}

export const view_value_assignments = (req, res, next) => {
  res.locals.user = req.user;
  res.locals.session = req.session;
  res.locals.page = {};
  next();
};
