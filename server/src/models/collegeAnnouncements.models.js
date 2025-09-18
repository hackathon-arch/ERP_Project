import mongoose from "mongoose";

const collegeSchema = new mongoose.Schema(
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
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const CollegeAnnouncement = mongoose.model(
  "CollegeAnnouncement",
  collegeSchema
);
export default CollegeAnnouncement;
