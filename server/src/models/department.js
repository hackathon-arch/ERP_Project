import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema(
  {
    name: {
      type: String, 
      required: true,
    },
    college: {
      type: mongoose.Schema.ObjectId,
      ref: "College",
      required: true,
    },
  },
  { timestamps: true }
);

const Department = mongoose.model("Department", departmentSchema);
export default Department;
