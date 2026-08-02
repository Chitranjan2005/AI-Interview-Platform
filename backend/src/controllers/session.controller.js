import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { PracticeSession } from "../models/practiceSession.model.js";

const getMyStats = asyncHandler(async (req, res) => {
    const sessions = await PracticeSession.find({ user: req.user._id });

    let totalPoints = 0;
    let totalAnswered = 0;

    sessions.forEach((session) => {
        session.entries.forEach((entry) => {
            totalPoints += entry.feedback.points || 0;
            totalAnswered += 1;
        });
    });

    return res.status(200).json(new ApiResponse(200, { totalPoints, totalAnswered }, "Stats fetched"));
});

console.log(getMyStats);

const getMyHistory = asyncHandler(async (req, res) => {
    const sessions = await PracticeSession.find({ user: req.user._id })
        .sort({ createdAt: -1 })
        .populate("sheet", "name category difficulty")
        .populate("entries.question", "title category difficulty approachTags");

    return res.status(200).json(new ApiResponse(200, sessions, "History fetched"));
});

export { getMyHistory, getMyStats };