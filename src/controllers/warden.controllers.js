import { User } from "../models/user.js";
import College from "../models/college.js";
import Department from "../models/department.js";
import Hostel from "../models/hostel.js";
import Room from "../models/room.js";
import { Apierror } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import HostelAnnouncement from "../models/hostelAnnouncements.models.js";

const create_room = async (req, res) => {
  const { number, floor, capacity, status, people_names } = req.body;

  try {
    let peopleArray = [];
    try {
      peopleArray = JSON.parse(people_names); // if frontend sends JSON string
    } catch {
      peopleArray = Array.isArray(people_names) ? people_names : [people_names];
    }

    // Find users by names
    const users = await User.find({ name: { $in: peopleArray } });

    // Validation checks
    if (users.length !== peopleArray.length) {
      return res
        .status(404)
        .json(new Apierror(404, "One or more users not found by name"));
    }

    if (users.length > capacity) {
      return res
        .status(400)
        .json(new Apierror(400, "Too many people for this room"));
    }

    if (users.some((u) => u.allocated_room)) {
      return res
        .status(400)
        .json(
          new Apierror(
            400,
            "One or more users already allocated to another room"
          )
        );
    }

    // Create new room
    const newRoom = await Room.create({
      number,
      floor,
      capacity,
      status,
      people: users.map((u) => u._id),
    });

    // Update allocated users
    await User.updateMany(
      { _id: { $in: users.map((u) => u._id) } },
      {
        $set: {
          hostel_application_status: "allocated",
          allocated_room: newRoom._id,
        },
      }
    );

    res.redirect("/dashboard");
  } catch (error) {
    console.error("Error in create_room:", error);
    return res
      .status(500)
      .json(new Apierror(500, "Server error", error.message));
  }
};

// ✅ Make hostel announcement
const make_hostel_announcement = async (req, res) => {
  console.log("1. Controller started.");
  try {
    const {
      title,
      content,
      collegeName,
      hostelName,
      queryPersonName,
      due_date,
    } = req.body;

    // Required fields validation
    const requiredFields = [
      title,
      content,
      collegeName,
      hostelName,
      queryPersonName,
    ];
    if (requiredFields.some((field) => !field || String(field).trim() === "")) {
      return res
        .status(400)
        .json(new Apierror(400, "All required fields must be provided."));
    }

    // Check college
    const college = await College.findOne({ name: collegeName });
    if (!college) {
      return res.status(404).json(new Apierror(404, "College not found."));
    }

    // Check hostel under that college
    const hostel = await Hostel.findOne({
      name: hostelName,
      college: college._id,
    });
    if (!hostel) {
      return res
        .status(404)
        .json(new Apierror(404, "Hostel not found within this college."));
    }

    // Check query person
    const queryPerson = await User.findOne({ name: queryPersonName });
    if (!queryPerson) {
      return res
        .status(404)
        .json(new Apierror(404, "Query person (user) not found."));
    }

    // Create new announcement
    const newAnnouncement = await HostelAnnouncement.create({
      title,
      content,
      college: college._id,
      hostel: hostel._id,
      query_person: queryPerson._id,
      due_date: due_date || null,
    });

    res.redirect("/dashboard");
  } catch (error) {
    console.error("Error in make_hostel_announcement:", error);
    return res
      .status(500)
      .json(new Apierror(500, "Internal Server Error", error.message));
  }
};

export { create_room, make_hostel_announcement };
