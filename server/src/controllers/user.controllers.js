import Payment from "../models/payment.js";
import FeesAnnouncement from "../models/feesAnnouncement.js";
import { User } from "../models/user.js";
import College from "../models/college.js";
import Department from "../models/department.js";
import { Apierror } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { generateReceiptPdf } from "../utils/receiptGenerator.js";
import { sendEmailWithAttachment } from "../utils/emailService.js";
import crypto from "crypto";

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

    const baseRequiredFields = [name, email, password, role, collegeName];
    if (role === "student") {
      baseRequiredFields.push(enrollment, semester, departmentName);
    }

    if (
      baseRequiredFields.some((field) => !field || String(field).trim() === "")
    ) {
      return res
        .status(400)
        .json(new Apierror(400, "All required fields must be provided"));
    }

    const uniquenessQuery = [{ email }];
    if (enrollment) {
      uniquenessQuery.push({ enrollment });
    }
    const existingUser = await User.findOne({ $or: uniquenessQuery });
    if (existingUser) {
      let errorMessage = "User already exists.";
      if (existingUser.email === email) {
        errorMessage = "User with this email already exists.";
      } else if (existingUser.enrollment === enrollment) {
        errorMessage = "User with this enrollment number already exists.";
      }
      return res.status(409).json(new Apierror(409, errorMessage));
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
    const userData = {
      name,
      email,
      password,
      role,
      college: college._id,
    };
    if (role === "student") {
      userData.enrollment = enrollment;
      userData.semester = semester;
      userData.department = departmentId;
    }
    const user = new User(userData);
    const refreshToken = user.generateRefreshToken();
    user.refresh_token = refreshToken;
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
    return res
      .status(201)
      .json(new ApiResponse(201, createdUser, "User registered successfully"));
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(409)
        .json(new Apierror(409, "Email or enrollment number already exists."));
    }
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

const getMyFeeAnnouncements = async (req, res) => {
  try {
    const student = req.user;
    if (!student || student.role !== "student") {
      console.log(student);
      return res.status(403).json(new Apierror(403, "Access denied."));
    }
    const announcements = await FeesAnnouncement.find({
      department: student.department,
      semester: student.semester,
    });
    return res
      .status(200)
      .json(new ApiResponse(200, announcements, "Fee announcements fetched."));
  } catch (error) {
    return res.status(500).json(new Apierror(500, "Internal Server Error"));
  }
};

const recordPayment = async (req, res) => {
  try {
    const { announcementId } = req.body;
    const student = req.user;

    const announcement = await FeesAnnouncement.findById(announcementId);
    if (!announcement) {
      return res
        .status(404)
        .json(new Apierror(404, "Fees announcement not found."));
    }

    const existingPayment = await Payment.findOne({
      student: student._id,
      feesAnnouncement: announcementId,
    });
    if (existingPayment) {
      return res
        .status(409)
        .json(new Apierror(409, "You have already paid this fee."));
    }

    const transactionId = `txn_${crypto.randomBytes(8).toString("hex")}`;

    const newPayment = await Payment.create({
      student: student._id,
      fees_structure: announcementId, 
      amount_paid: announcement.amount, 
      transactionId,
    });
    const receiptBuffer = await generateReceiptPdf(
      newPayment,
      student,
      announcement
    );
    await sendEmailWithAttachment(
      student.email,
      `Payment Receipt for ${announcement.title}`,
      `Dear ${student.name},\n\nPlease find your attached receipt.\n\nTransaction ID: ${newPayment.transactionId}`,
      receiptBuffer
    );
    await User.findByIdAndUpdate(student._id, {
      $push: { paymentHistory: newPayment._id },
    });

    return res
      .status(201)
      .json(
        new ApiResponse(201, newPayment, "Payment recorded and receipt sent.")
      );
  } catch (error) {
    console.error("Error in recordPayment:", error);
    return res.status(500).json(new Apierror(500, "Internal Server Error"));
  }
};

export { register, login, logout, getMyFeeAnnouncements, recordPayment };
