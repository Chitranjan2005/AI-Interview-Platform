import express from "express";
import { registerUser, loginUser, logoutUser, changePassword, changeUsername, refreshAccessToken }
from "../controllers/auth.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/change-password").post(verifyJWT, changePassword);
router.route("/change-username").post(verifyJWT, changeUsername);
router.route("/refresh-token").post(refreshAccessToken);

export default router;