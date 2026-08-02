// src/routes/session.routes.js
import express from "express";
import { getMyHistory, getMyStats } from "../controllers/session.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.route("/history").get(verifyJWT, getMyHistory);
router.route("/stats").get(verifyJWT, getMyStats);

export default router;