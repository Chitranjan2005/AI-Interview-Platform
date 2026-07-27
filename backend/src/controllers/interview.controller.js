// src/controllers/interview.controller.js
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Question } from "../models/question.model.js";
import { generateFeedback } from "../services/generateFeedback.js";

const submitAnswer = asyncHandler(async (req, res) => {
    const { questionId, answer } = req.body;

    if (!questionId || !answer?.trim()) {
        throw new ApiError(400, "Question ID and answer are required");
    }

    const question = await Question.findById(questionId);
    if (!question) {
        throw new ApiError(404, "Question not found");
    }

    const feedback = await generateFeedback(question.title, answer);

    if(!feedback){
        throw new ApiError(500, "Failed to generate feedback");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, { questionId, feedback }, "Feedback generated"));
});

export { submitAnswer };