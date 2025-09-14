import jwt from 'jsonwebtoken';
import { User } from '../models/user.js';
import { Apierror } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const verifyJWT = asyncHandler(async(req, _, next) => {
    const token = req.cookies.accesstoken || req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        throw new Apierror(401, "Unauthorized");
    }

    try {
        const decodedtoken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const user = await User.findById(decodedtoken?._id).select('-password -refreshtoken');

        if (!user) {
            throw new Apierror(401, "Unauthorized");
        }
        req.user = user;

        next();

    } catch (error) {
        
        throw new Apierror(401, error?.message || "Invalid access token");
    }
})