// src/tests/setup.js
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

beforeAll(async () => {
  await mongoose.connect(`${process.env.MONGO_URL}/QuestionDB_test`);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});