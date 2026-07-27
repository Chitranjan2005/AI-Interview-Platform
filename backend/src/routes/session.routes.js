import express from "express";
import { getMyHistory } from "../controllers/session.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.route("/history").get(verifyJWT, getMyHistory);

export default router;