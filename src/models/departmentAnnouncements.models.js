import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    department: {
      type: mongoose.Types.ObjectId,
      ref: "Department",
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

const DepartmentAnnouncement = mongoose.model(
  "DepartmentAnnouncement",
  departmentSchema
);
export default DepartmentAnnouncement;
