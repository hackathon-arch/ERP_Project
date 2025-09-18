import { Payment } from "../models/payment.js";
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
    const accessToken = user.generateAccessToken();
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
    res
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 1000 * 60 * 60 * 7,
      })
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 1000 * 60 * 60 * 24 * 30,
      })
      .redirect("/dashboard");
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(409)
        .json(new Apierror(409, "Email or enrollment number already exists."));
    }
    console.error("Error registering user:", error);
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
      maxAge: 1000 * 60 * 60 * 24, // 1 day, adjust if needed
    };

    // Set tokens as cookies
    res
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options);

    // Redirect to dashboard
    res.redirect("/dashboard");
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
    const { announcementId } = req.params; // coming from /record/:announcementId
    const student = req.user;

    if (!student) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // 1. Find announcement
    const announcement = await FeesAnnouncement.findById(announcementId);
    if (!announcement) {
      return res.status(404).json({ message: "Fees announcement not found." });
    }

    // 2. Prevent duplicate payments
    const existingPayment = await Payment.findOne({
      student: student._id,
      fees_announcement: announcementId,
    });
    if (existingPayment) {
      return res
        .status(409)
        .json({ message: "You have already paid this fee." });
    }

    // 3. Generate unique transactionId
    const transactionId = `txn_${crypto.randomBytes(6).toString("hex")}`;

    // 4. Save new payment
    const newPayment = await Payment.create({
      student: student._id,
      fees_announcement: announcementId,
      amount: announcement.amount,
      status: "completed",
      receipt_url: `/payment/receipt/${transactionId}`,
      transactionId,
    });

    // 5. Return success + redirect URL
    return res.status(201).json({
      success: true,
      message: "Payment successful",
      redirectUrl: newPayment.receipt_url,
    });
  } catch (error) {
    console.error("Error in recordPayment:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const applyForHostel = async (req, res) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json(new Apierror(401, "User not authenticated."));
    }

    const student = await User.findById(userId);

    if (!student) {
      return res
        .status(404)
        .json(new Apierror(404, "Student profile not found."));
    }

    if (student.role !== "student") {
      return res
        .status(403)
        .json(new Apierror(403, "Only students can apply for a hostel."));
    }

    if (
      student.hostel_application_status === "applied" ||
      student.hostel_application_status === "allocated"
    ) {
      return res
        .status(409)
        .json(
          new Apierror(
            409,
            `You have already ${student.hostel_application_status} for a hostel.`
          )
        );
    }

    student.hostel_application_status = "applied";
    await student.save({ validateBeforeSave: false });
    return res.redirect("/dashboard");
  } catch (error) {
    console.error("Error applying for hostel:", error);
    return res
      .status(500)
      .json(new Apierror(500, "Internal Server Error", error.message));
  }
};

export {
  register,
  login,
  getMyFeeAnnouncements,
  recordPayment,
  applyForHostel,
};
