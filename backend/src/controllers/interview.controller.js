import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Question } from "../models/question.model.js";
import { InterviewSession } from "../models/session.model.js";
import { generateFeedback } from "../services/generateFeedback.js";

const MAX_HISTORY_PER_USER = 30;

const submitAnswer = asyncHandler(async (req, res) => {
    const { questionId, sheetId, answer } = req.body;

    if (!questionId || !answer?.trim()) {
        throw new ApiError(400, "Question ID and answer are required");
    }

    const question = await Question.findById(questionId);
    if (!question) {
        throw new ApiError(404, "Question not found");
    }

    const feedback = await generateFeedback(question.title, answer);

    const session = await InterviewSession.create({
        user: req.user._id,
        question: questionId,
        sheet: sheetId || undefined,
        userAnswer: answer,
        feedback,
    });

    // delete hitory if its 30 or more
    const userSessionCount = await InterviewSession.countDocuments({ user: req.user._id });
    if (userSessionCount > MAX_HISTORY_PER_USER) {
        const excess = userSessionCount - MAX_HISTORY_PER_USER;
        const oldestSessions = await InterviewSession.find({ user: req.user._id })
            .sort({ createdAt: 1 })
            .limit(excess);

        const idsToDelete = oldestSessions.map((s) => s._id);
        await InterviewSession.deleteMany({ _id: { $in: idsToDelete } });
    }

    return res
        .status(200)
        .json(new ApiResponse(200, { sessionId: session._id, feedback }, "Feedback generated and saved"));
});

export { submitAnswer };