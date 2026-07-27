import mongoose from "mongoose";

const interviewSessionSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        question: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Question",
            required: true,
        },
        sheet: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Sheet",
        },
        userAnswer: {
            type: String,
            required: true,
        },
        feedback: {
            correctness: {
                score: Number,
                notes: String,
            },
            clarity: {
                score: Number,
                notes: String,
            },
            communication: {
                score: Number,
                notes: String,
            },
            followUpQuestion: String,
        },
    },
    { timestamps: true }
);

export const InterviewSession = mongoose.model("InterviewSession", interviewSessionSchema);