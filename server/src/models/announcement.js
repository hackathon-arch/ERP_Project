import mongoose from "mongoose";

const announcementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    visibility: {
      type: String,
      enum: ["all", "students", "hostelites"],
      default: "all",
    },
  },
  { timestamps: true }
);

const Announcement = mongoose.model("Announcement", announcementSchema);
export default Announcement;
