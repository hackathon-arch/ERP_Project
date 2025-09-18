import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    number: {
      type: Number,
      required: true,
    },
    floor: {
      type: Number,
      required: true,
    },
    hostel: {
      type: mongoose.Types.ObjectId,
      ref: "Hostel",
    },
    capacity: {
      type: Number,
      required: true,
      default: 2,
    },
    status: {
      type: String,
      enum: ["available", "occupied", "maintenance"], // ✅ only these allowed
      default: "available",
    },
    people: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

const Room = mongoose.model("Room", roomSchema);
export default Room;
