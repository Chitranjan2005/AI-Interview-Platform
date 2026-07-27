import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { InterviewSession } from "../models/session.model.js";

const getMyHistory = asyncHandler(async (req, res) => {
    const sessions = await InterviewSession.find({ user: req.user._id })
        .sort({ createdAt: -1 })
        .populate("question", "title category difficulty approachTags");

    return res.status(200).json(new ApiResponse(200, sessions, "History fetched"));
});

export { getMyHistory };