import mongoose from "mongoose";

const entrySchema = new mongoose.Schema(
    {
        question: { type: mongoose.Schema.Types.ObjectId, ref: "Question", required: true },
        userAnswer: { type: String, required: true },
        feedback: {
            correctness: { score: Number, notes: String },
            clarity: { score: Number, notes: String },
            communication: { score: Number, notes: String },
            points: Number,
            followUpQuestion: String,
        },
    },
    { _id: false, timestamps: true }
);

const practiceSessionSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        sheet: { type: mongoose.Schema.Types.ObjectId, ref: "Sheet", required: true },
        questions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }],
        entries: [entrySchema],
    },
    { timestamps: true }
);

export const PracticeSession = mongoose.model("PracticeSession", practiceSessionSchema);