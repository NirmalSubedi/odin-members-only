import express from "express";
import path from "node:path";
import passport from "passport";
import { PORT } from "./config.js";
import {
  bad_request_handler,
  missing_resource_response,
  not_found_handler,
  server_error_handler,
} from "./controllers/error_controller.js";
import {
  app_session,
  request_logger,
  view_value_assigner,
} from "./controllers/global_controller.js";
import { club_router } from "./routes/club_router.js";
import { index_router } from "./routes/index_router.js";
import { post_router } from "./routes/post_router.js";
import { user_router } from "./routes/user_router.js";

const app = express();

app.set("view engine", "ejs");
app.set("trust proxy", 1);

app.use(request_logger);
app.use(express.static(path.join(import.meta.dirname, "public")));
app.use(app_session);
app.use(passport.session());
app.use(express.urlencoded({ extended: true }));
app.use(view_value_assigner);

app.use(index_router);
app.use(user_router);
app.use(post_router);
app.use(club_router);

app.use(missing_resource_response);
app.use(bad_request_handler);
app.use(not_found_handler);
app.use(server_error_handler);

app.listen(PORT, (error) => {
  if (error) throw error;
  console.log(`App running on port ${PORT}`);
});
