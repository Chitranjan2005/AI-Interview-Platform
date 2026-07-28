import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Sheet } from "../models/sheet.model.js";
import { selectPracticeSet } from "../services/selectPracticeSet.js";
import { PracticeSession } from "../models/practiceSession.model.js";


const startPractice = asyncHandler(async (req, res) => {
    const { sheetId } = req.params;

    const sheet = await Sheet.findById(sheetId);
    if (!sheet) throw new ApiError(404, "Sheet not found");

    const questions = await selectPracticeSet(sheet);
    if (questions.length === 0) throw new ApiError(404, "No matching questions found");

    const practiceSession = await PracticeSession.create({
        user: req.user._id,
        sheet: sheet._id,
        questions: questions.map((q) => q._id),
        entries: [],
    });

    return res
        .status(200)
        .json(new ApiResponse(200, { sessionId: practiceSession._id, sheetName: sheet.name, questions }, "Practice set generated"));
});

export { startPractice };