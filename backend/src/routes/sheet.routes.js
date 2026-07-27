import express from "express";
import { getAllSheets } from "../controllers/sheet.controller.js";

const router = express.Router();

router.route("/").get(getAllSheets);

export default router;