// src/seeds/approachGroup.seed.js
import dotenv from "dotenv";
import mongoose from "mongoose";
import fs from "fs";
import { ApproachGroup } from "../models/approachGroup.model.js";

dotenv.config({ path: "./.env" });

const groups = JSON.parse(
    fs.readFileSync(new URL("../../approach_groups_seed.json", import.meta.url))
);

const seedApproachGroups = async () => {
    try {
        const connectionInstance = await mongoose.connect(
            `${process.env.MONGO_URL}/QuestionDB`
        );
        console.log(`Mongoose connected to ${connectionInstance.connection.host}`);

        await ApproachGroup.deleteMany({});
        console.log("Existing approach groups cleared");

        const inserted = await ApproachGroup.insertMany(groups);
        console.log(`${inserted.length} approach groups seeded successfully`);

        process.exit(0);
    } catch (error) {
        console.error("Seeding failed: ", error);
        process.exit(1);
    }
};

seedApproachGroups();