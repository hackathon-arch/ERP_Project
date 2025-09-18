import mongoose from "mongoose";

const fees_announcement = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    due_date: {
      type: Date,
      required: true,
    },
    college: {
      type: mongoose.Schema.ObjectId,
      ref: "College",
      required: true,
    },
    department: {
      type: mongoose.Schema.ObjectId,
      ref: "Department",
    },
    semester: {
      type: Number,
    },
  },
  { timestamps: true }
);

const FeesAnnouncement = mongoose.model("FeesAnnouncement", fees_announcement);
export default FeesAnnouncement;
