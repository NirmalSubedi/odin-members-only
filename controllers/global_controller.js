import pg_simple from "connect-pg-simple";
import session from "express-session";
import { NODE_ENV, SESSION_COOKIE_MAX_AGE, SESSION_SECRET } from "../config.js";
import { pool } from "../db/pool.js";

const session_store = pg_simple(session);
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

export const view_value_assigner = (req, res, next) => {
  res.locals.user = req.user;
  res.locals.session = req.session;
  res.locals.page = {};
  next();
};

export const request_logger = (req, res, next) => {
  const requestStartTime = performance.now();
  const timeOfRequest = new Date().toISOString();

  res.once("close", () => {
    const responseDuration =
      (performance.now() - requestStartTime).toFixed(4) + "ms";

    console.log(
      `${timeOfRequest} - ${req.method} ${req.originalUrl} ${res.statusCode} - ${responseDuration}`,
    );
  });

  next();
};
