import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["student", "hostel_admin", "college_admin", "super_admin"],
      required: true,
    },
    college: {
      type: mongoose.Schema.ObjectId,
      ref: "College",
      required: true,
    },
    enrollment: {
      type: String,
      unique: true,
      sparse: true,
    },
    department: {
      type: mongoose.Schema.ObjectId,
      ref: "Department",
    },
    hostel_application_status: {
      type: String,
      enum: ["applied", "not_applied", "allocated", "rejected"],
      default: "not_applied",
    },
    allocated_room: {
      type: mongoose.Schema.ObjectId,
      ref: "Room",
      default: null,
    },
    semester: {
      type: Number,
      required: function () {
        return this.role === "student";
      },
    },
    paymentHistory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Payment",
      },
    ],
    refresh_token: {
      type: String,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.checkPassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw new Error("Error occured while matchibg the password");
  }
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      name: this.name,
      role: this.role,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

userSchema.methods.generateTempToken = function () {
  const unhashed_token = crypto.randomBytes(20).toString("hex");
  const hashed_token = crypto
    .createHash("sha256")
    .update(unhashed_token)
    .digest("hex");
  const token_expiry = Date.now() + 60 * 20 * 100;
  return { unhashed_token, hashed_token, token_expiry };
};

const User = mongoose.model("User", userSchema);
export { User };
