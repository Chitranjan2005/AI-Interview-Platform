import dotenv from "dotenv";
import mongoose from "mongoose";
import fs from "fs";
import { Question } from "../models/question.model.js";

dotenv.config({
    path: "./.env",
});

const questionData = JSON.parse(
    fs.readFileSync(new URL("../../question_seed.json", import.meta.url))
);

const seedQuestions = async () => {
    try {
        const connectionInstance = await mongoose.connect(
            `${process.env.MONGO_URL}/QuestionDB`
        );
        console.log(`Mongoose connected to ${connectionInstance.connection.host}`);

        await Question.deleteMany({});
        console.log("Existing questions cleared");

        const insertedQuestions = await Question.insertMany(questionData);
        console.log(`${insertedQuestions.length} questions seeded successfully`);

        process.exit(0);
    } catch (error) {
        console.error("Seeding failed: ", error);
        process.exit(1);
    }
};

seedQuestions();