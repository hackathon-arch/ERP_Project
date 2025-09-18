import mongoose from "mongoose";
import dotenv from "dotenv";
import Room from "./models/room.js";
import path from "path";
import { User } from "../src/models/user.js";
import College from "./models/college.js";
import { fileURLToPath } from "url";
dotenv.config();

import app from "../app.js";

const PORT = process.env.PORT || 5000;

const connect_to_database = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {});
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ Error connecting to MongoDB:", error.message);
    process.exit(1);
  }
};

// const createDefaultCollegeAdmin = async () => {
//   try {
//     // Check if any college_admin already exists
//     const existingAdmin = await User.findOne({ role: "college_admin" });
//     if (existingAdmin) {
//       console.log("College admin already exists, skipping creation.");
//       return;
//     }

//     // Find the college to assign (replace with your default college name)
//     const college = await College.findOne({
//       name: "Sister Nivedita University",
//     });
//     if (!college) {
//       console.error("Default college not found. Cannot create college_admin.");
//       return;
//     }

//     // Create a new college_admin user
//     const adminData = {
//       name: process.env.NAME,
//       email: process.env.EMAIL,
//       password: process.env.PASSWORD, // Make sure to hash password as per your User model logic
//       role: "college_admin",
//       college: college._id,
//     };

//     const adminUser = new User(adminData);
//     await adminUser.save();

//     console.log("Default college_admin created successfully!");
//   } catch (error) {
//     console.error("Error creating default college_admin:", error);
//   }
// };

const start_server = async () => {
  await connect_to_database();
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
};

start_server();

//createDefaultCollegeAdmin();
