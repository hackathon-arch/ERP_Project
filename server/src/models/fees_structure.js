import mongoose from "mongoose";

const feeStructureSchema = new mongoose.Schema(
  {
    title: {
      type: String, // e.g., "Tuition Fee - Fall 2025"
      required: true,
    },
    description: String,
    amount: {
      type: Number,
      required: true,
    },
    dueDate: {
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

const FeeStructure = mongoose.model("FeeStructure", feeStructureSchema);
export default FeeStructure;
