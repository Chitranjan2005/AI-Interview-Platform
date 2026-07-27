import mongoose from "mongoose";

const sheetSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        category: {
            type: String,
            enum: ["DSA", "System Design"],
            required: true,
        },
        difficulty: {
            type: String,
            enum: ["Easy", "Medium", "Hard"],
            required: true,
        },
        slotCount: {
            type: Number,
            required: true,
            default: 2,
        },
    },
    { timestamps: true }
);

export const Sheet = mongoose.model("Sheet", sheetSchema);