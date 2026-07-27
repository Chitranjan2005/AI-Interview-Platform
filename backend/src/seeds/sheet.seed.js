import dotenv from "dotenv";
import mongoose from "mongoose";
import { Sheet } from "../models/sheet.model.js";

dotenv.config({ path: "./.env" });

const sheets = [
    {
        name: "DSA Easy",
        category: "DSA",
        difficulty: "Easy",
        slotCount: 2,
    },
    {
        name: "DSA Medium",
        category: "DSA",
        difficulty: "Medium",
        slotCount: 2,
    },
    {
        name: "DSA Hard",
        category: "DSA",
        difficulty: "Hard",
        slotCount: 2,
    },
];

const seedSheets = async () => {
    try {
        const connectionInstance = await mongoose.connect(
            `${process.env.MONGO_URL}/QuestionDB`
        );
        console.log(`Mongoose connected to ${connectionInstance.connection.host}`);

        await Sheet.deleteMany({});
        console.log("Existing sheets cleared");

        const inserted = await Sheet.insertMany(sheets);
        console.log(`${inserted.length} sheets seeded successfully`);

        process.exit(0);
    } catch (error) {
        console.error("Seeding failed: ", error);
        process.exit(1);
    }
};

seedSheets();