import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Sheet } from "../models/sheet.model.js";

const getAllSheets = asyncHandler(async (req, res) => {
    const sheets = await Sheet.find({});
    return res.status(200).json(new ApiResponse(200, sheets, "Sheets fetched"));
});

export { getAllSheets };