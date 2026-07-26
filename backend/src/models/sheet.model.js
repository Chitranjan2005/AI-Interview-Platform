import mongoose from "mongoose";

const sheetSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            default: "",
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
        slots: [
            {
                type: String,
                required: true,
            },
        ],
    },
    { timestamps: true }
);

export const Sheet = mongoose.model("Sheet", sheetSchema);