import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { PracticeSession } from "../models/practiceSession.model.js";

const getMyStats = asyncHandler(async (req, res) => {
    const sessions = await PracticeSession.find({ user: req.user._id })
        .populate("sheet", "name difficulty")
        .sort({ createdAt: 1 });

    let totalPoints = 0;
    let totalAnswered = 0;
    const pointsOverTime = [];
    const sheetStats = {};

    sessions.forEach((session) => {
        const sheetName = session.sheet?.name || "Unknown sheet";
        if (!sheetStats[sheetName]) {
            sheetStats[sheetName] = { correctSum: 0, count: 0 };
        }

        session.entries.forEach((entry) => {
            const points = entry.feedback.points || 0;
            totalPoints += points;
            totalAnswered += 1;

            pointsOverTime.push({
                date: session.createdAt.toISOString().split("T")[0],
                points,
            });

            sheetStats[sheetName].correctSum += entry.feedback.correctness?.score || 0;
            sheetStats[sheetName].count += 1;
        });
    });

    const accuracyPerSheet = Object.entries(sheetStats).map(([name, s]) => ({
        sheetName: name,
        accuracy: s.count > 0 ? Math.round((s.correctSum / (s.count * 10)) * 100) : 0,
        questionsAnswered: s.count,
    }));

    return res.status(200).json(
        new ApiResponse(
            200,
            { totalPoints, totalAnswered, pointsOverTime, accuracyPerSheet },
            "Stats fetched"
        )
    );
});


const getMyHistory = asyncHandler(async (req, res) => {
    const sessions = await PracticeSession.find({ user: req.user._id })
        .sort({ createdAt: -1 })
        .populate("sheet", "name category difficulty")
        .populate("entries.question", "title category difficulty approachTags");

    return res.status(200).json(new ApiResponse(200, sessions, "History fetched"));
});

export { getMyHistory, getMyStats };