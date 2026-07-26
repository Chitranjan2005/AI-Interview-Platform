import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    title: {
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
    approachTags: [
      {
        type: String,
        required: true,
      },
    ],
    sourceUrl: {
      type: String,
      default: "",
    },
    idealAnswerNotes: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export const Question = mongoose.model("Question", questionSchema);