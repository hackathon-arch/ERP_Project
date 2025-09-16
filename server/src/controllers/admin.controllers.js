import { User } from "../models/user.js";
import College from "../models/college.js";
import Department from "../models/department.js";
import Hostel from "../models/hostel.js";
import Room from "../models/room.js";
import { Apierror } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const create_college = async (req, res) => {
  try {
    const { name, contact_person } = req.body;
    const newCollege = await College.create({
      name,
      contact_person,
    });

    return res.status(201).json({ message: "College created successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to create college", error });
  }
};

const create_department = async (req, res) => {
  try {
    const { name, college_name, hod } = req.body;

    const found_college = await College.findOne({ name: college_name });

    if (!found_college) {
      return res
        .status(404)
        .json(new Apierror(404, "College not found with this name"));
    }

    const newDepartment = await Department.create({
      name,
      college: found_college._id,
      hod,
    });

    found_college.departments.push(newDepartment._id);

    await found_college.save();

    return res
      .status(201)
      .json(
        new ApiResponse(
          201,
          newDepartment,
          "Department created and linked successfully"
        )
      );
  } catch (error) {
    return res
      .status(500)
      .json(new Apierror(500, "Failed to create department", error));
  }
};

const create_hostel = async (req, res) => {
  const { name, address, college_name, warden_name, room_number } = req.body;
  const found_college = await College.findOne({ name: college_name });
  if (!found_college) {
    return res
      .status(404)
      .json({ message: "college is not found with this name" });
  }
  const found_warden = await User.findOne({ name: warden_name });
  if (!found_warden) {
    return res.status(404).json({ message: "user not found" });
  }
  if (found_warden.role !== "hostel_admin") {
    return res
      .status(489)
      .json({ message: "User found but the user is not an hostel admin" });
  }

  const created_hostel = await Hostel.create({
    name,
    address,
    college: found_college._id,
    warden: found_warden._id,
    rooms: room_number,
  });

  //const belonging_rooms = await Room.find({}) ;


  console.log("Hostel created successfully ✅");
  return res.status(201).json({
    message: "Hostel creation successful",
    data: created_hostel,
  });
};

export { create_college, create_department , create_hostel};
