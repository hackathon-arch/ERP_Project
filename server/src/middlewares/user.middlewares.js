import jwt from "jsonwebtoken";
import {User} from "../models/user.js";
import { Apierror } from "../utils/ApiError.js";

const protect = async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return res
        .status(401)
        .json(new Apierror(401, "Unauthorized request: No token provided"));
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decodedToken?._id).select(
      "-password -refresh_token"
    );
    if (!user) {
      return res
        .status(401)
        .json(new Apierror(401, "Invalid Access Token: User not found"));
    }

    req.user = user;
    next();
  } catch (error) {
    return res
      .status(401)
      .json(new Apierror(401, error?.message || "Invalid Access Token"));
  }
};

export { protect };
