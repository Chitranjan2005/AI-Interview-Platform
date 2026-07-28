import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { PracticeSession } from "../models/practiceSession.model.js";

const getMyHistory = asyncHandler(async (req, res) => {
    const sessions = await PracticeSession.find({ user: req.user._id })
        .sort({ createdAt: -1 })
        .populate("sheet", "name category difficulty")
        .populate("entries.question", "title category difficulty approachTags");

    return res.status(200).json(new ApiResponse(200, sessions, "History fetched"));
});

export { getMyHistory };