import express from "express";
import { submitAnswer } from "../controllers/interview.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.route("/submit-answer").post(verifyJWT, submitAnswer);

export default router;