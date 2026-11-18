import express from "express";
import { get__index } from "../controllers/index_controller.js";

export const index_router = express.Router();

index_router.get("/", get__index);
