import {ApiResponse} from '../Utils/ApiResponse.js';
import {asyncHandler} from "../Utils/asyncHandler.js";

const healthcheck = asyncHandler( async (req, res) => {
    return res.status(200).json(new ApiResponse(200,"OK","Health Check Passed",));
})

export {healthcheck}