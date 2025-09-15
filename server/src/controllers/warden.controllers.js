import {User} from "../models/user.js";
import College from "../models/college.js";
import Department from "../models/department.js";
import Hostel from "../models/hostel.js";
import Room from "../models/room.js";
import { Apierror } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const create_room = async (req, res) => {
  try {
    const { number, floor, capacity, status, people_names } = req.body;
    const users = await User.find({ name: { $in: people_names } });
    if (users.length !== people_names.length) {
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
    const newRoom = await Room.create({
      number,
      floor,
      capacity,
      status,
      people: users.map((u) => u._id), // save user IDs
    });
    await User.updateMany(
      { _id: { $in: users.map((u) => u._id) } },
      {
        $set: {
          hostel_application_status: "allocated",
          allocated_room: newRoom._id,
        },
      }
    );
    return res
      .status(201)
      .json(
        new ApiResponse(
          201,
          newRoom,
          "New room created and users updated successfully"
        )
      );
  } catch (error) {
    return res
      .status(500)
      .json(new Apierror(500, "Server error", error.message));
  }
};

export { create_room };
