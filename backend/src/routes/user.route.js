import express from "express";
import { 
         registerUser,
         loginUser, 
         logoutUser, 
         changePassword, 
         changeUsername, 
         refreshAccessToken, 
         verifyOtp, 
         resendOtp,
         forgotPassword,
         resetPassword
 }
from "../controllers/auth.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/change-password").post(verifyJWT, changePassword);
router.route("/change-username").post(verifyJWT, changeUsername);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/verify-otp").post(verifyOtp);
router.route("/resend-otp").post(resendOtp);
router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password").post(resetPassword);

export default router;