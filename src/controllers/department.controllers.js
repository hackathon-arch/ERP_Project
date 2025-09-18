import { User } from "../models/user.js";
import College from "../models/college.js";
import Department from "../models/department.js";
import Hostel from "../models/hostel.js";
import Room from "../models/room.js";
import { Apierror } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import DepartmentAnnouncement from "../models/departmentAnnouncements.models.js";

const make_department_announcement = async (req, res) => {
  try {
    const { title, content, departmentName, collegeName, due_date } = req.body;

    const requiredFields = [title, content, departmentName, collegeName];
    if (requiredFields.some((field) => !field || String(field).trim() === "")) {
      return res
        .status(400)
        .json(new Apierror(400, "All required fields must be provided."));
    }

    const college = await College.findOne({ name: collegeName });
    if (!college) {
      return res.status(404).json(new Apierror(404, "College not found."));
    }

    const department = await Department.findOne({
      name: departmentName,
      college: college._id,
    }).populate("hod");
    if (!department) {
      return res
        .status(404)
        .json(new Apierror(404, "Department not found within this college."));
    }
    if (!department.hod) {
      return res
        .status(404)
        .json(new Apierror(404, "HOD not found for this department."));
    }

    const newAnnouncement = new DepartmentAnnouncement({
      title,
      content,
      department: department._id,
      college: college._id,
      query_person: department.hod,
      due_date: due_date,
    });

    await newAnnouncement.save();
    res.redirect("/dashboard");
  } catch (error) {
    console.error("Error creating department announcement:", error);
    return res
      .status(500)
      .json(new Apierror(500, "Internal Server Error", error.message));
  }
};

export { make_department_announcement };
