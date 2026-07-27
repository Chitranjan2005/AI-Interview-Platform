import express from "express";
import { startPractice } from "../controllers/practice.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.route("/start/:sheetId").get(verifyJWT, startPractice);

export default router;