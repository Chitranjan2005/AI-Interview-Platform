import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from "dotenv";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(express.static('public'));
app.use(cookieParser());

//routers
import practiceRouter from "./routes/practice.routes.js";
import userRouter from "./routes/user.route.js";
import sheetRouter from "./routes/sheet.routes.js";
import interviewRouter from "./routes/interview.routes.js";
import sessionRouter from "./routes/session.routes.js";

app.use("/api/v1/users", userRouter);
app.use("/api/v1/practice", practiceRouter);
app.use("/api/v1/sheets", sheetRouter);
app.use("/api/v1/interview", interviewRouter);
app.use("/api/v1/sessions", sessionRouter);

export { app };
