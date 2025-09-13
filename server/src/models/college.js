import mongoose from "mongoose";

const collegeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    departments: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Department",
      },
    ],
    hostels: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Hostel",
      },
    ],
    contact_person: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const College = mongoose.model("College", collegeSchema);
export default College;
