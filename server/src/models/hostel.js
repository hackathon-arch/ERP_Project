import mongoose from "mongoose";

const hostelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    college: {
      type: mongoose.Types.ObjectId,
      ref: "College",
    },
    warden: {
      type: mongoose.Types.ObjectId,
      ref: "User", 
    },
    rooms: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Room",
      },
    ],
  },
  { timestamps: true }
);

const Hostel = mongoose.model("Hostel", hostelSchema);
export default Hostel;
