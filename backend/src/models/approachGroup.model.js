import mongoose from "mongoose";

const approachGroupSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        tags: [
            {
                type: String,
                required: true,
            },
        ],
    },
    { timestamps: true }
);

export const ApproachGroup = mongoose.model("ApproachGroup", approachGroupSchema);