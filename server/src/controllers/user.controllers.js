import User from "../models/user.js";
import College from "../models/college.js";
import Department from "../models/department.js";
import { Apierror } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      enrollment,
      semester,
      collegeName,
      departmentName,
    } = req.body;

    // 1. Validation and existence checks (same as before)
    if (
      [name, email, password, role, collegeName].some(
        (field) => !field || field.trim() === ""
      )
    ) {
      return res
        .status(400)
        .json(new Apierror(400, "All required fields must be provided"));
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { enrollment }],
    });
    if (existingUser) {
      return res
        .status(409)
        .json(
          new Apierror(
            409,
            "User with this email or enrollment number already exists"
          )
        );
    }

    const college = await College.findOne({ name: collegeName });
    if (!college) {
      return res.status(404).json(new Apierror(404, "College not found"));
    }

    let departmentId = null;
    if (role === "student") {
      const department = await Department.findOne({
        name: departmentName,
        college: college._id,
      });
      if (!department) {
        return res
          .status(404)
          .json(new Apierror(404, `Department '${departmentName}' not found`));
      }
      departmentId = department._id;
    }

    // 2. Create the new user object (without saving yet)
    const user = new User({
      name,
      email,
      password,
      role,
      enrollment,
      semester,
      college: college._id,
      department: departmentId,
    });

    // 3. Generate a refresh token for the new user
    const refreshToken = user.generateRefreshToken();
    user.refresh_token = refreshToken; // Assign it to the user object

    // 4. Save the user. The pre-save hook will hash the password, and the refresh token will be saved too.
    await user.save();

    const createdUser = await User.findById(user._id).select(
      "-password -refresh_token"
    );

    if (!createdUser) {
      return res
        .status(500)
        .json(
          new Apierror(500, "Something went wrong while registering the user")
        );
    }

    // 5. Send a successful response
    return res
      .status(201)
      .json(
        new ApiResponse(
          201,
          createdUser,
          "User registered successfully with a refresh token"
        )
      );
  } catch (error) {
    console.error("Error registering user:", error);
    return res
      .status(500)
      .json(new Apierror(500, "Internal Server Error", error.message));
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json(new Apierror(404, "User not found"));
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json(new Apierror(400, "Invalid credentials"));
    }

    const accessToken = jwt.sign(
      { _id: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );
    const refreshToken = jwt.sign(
      { _id: user._id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
    );

    user.refresh_token = refreshToken;
    await user.save();

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(new ApiResponse(200, { user }, "Login successful"));
  } catch (error) {
    return res
      .status(500)
      .json(new Apierror(500, "Internal Server Error", error.message));
  }
};

const logout = async (req, res) => {
  try {
    await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: { refresh_token: null },
      },
      {
        new: true,
      }
    );
    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    };
    return res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json(new ApiResponse(200, {}, "User logged out successfully"));
  } catch (error) {
    return res
      .status(500)
      .json(new Apierror(500, "Internal Server Error", error.message));
  }
};

export { register, login, logout };
