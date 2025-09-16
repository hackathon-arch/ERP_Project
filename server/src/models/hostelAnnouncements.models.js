import mongoose from "mongoose";

const hostelSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    college: {
      type: mongoose.Types.ObjectId,
      ref: "College",
      required: true,
    },
    due_date: {
      type: Date,
    },
    query_person: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    hostel: {
      type: mongoose.Types.ObjectId, 
      ref: "Hostel",
      required: true,
    },
  },
  { timestamps: true }
);

const HostelAnnouncement = mongoose.model("HostelAnnouncement", hostelSchema);
export default HostelAnnouncement;
