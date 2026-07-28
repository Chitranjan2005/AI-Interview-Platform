import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Question } from "../models/question.model.js";
import { PracticeSession } from "../models/practiceSession.model.js";
import { generateFeedback } from "../services/generateFeedback.js";

const submitAnswer = asyncHandler(async (req, res) => {
    const { sessionId, questionId, answer } = req.body;

    if (!sessionId || !questionId || !answer?.trim()) {
        throw new ApiError(400, "Session ID, question ID, and answer are required");
    }

    const question = await Question.findById(questionId);
    if (!question) throw new ApiError(404, "Question not found");

    const feedback = await generateFeedback(question.title, answer);

    const session = await PracticeSession.findOneAndUpdate(
        { _id: sessionId, user: req.user._id },
        { $push: { entries: { question: questionId, userAnswer: answer, feedback } } },
        { new: true }
    );

    if (!session) throw new ApiError(404, "Practice session not found");

    return res
        .status(200)
        .json(new ApiResponse(200, { sessionId: session._id, feedback }, "Feedback generated and saved"));
});

export { submitAnswer };