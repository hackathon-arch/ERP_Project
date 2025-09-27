import mongoose from "mongoose";

const admissionOrderSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    collegeName: { type: String, required: true },
    departmentName: { type: String, required: true },
    address: { type: String, required: true }
  },
  { timestamps: true }
);

export const AdmissionOrder = mongoose.model("AdmissionOrder", admissionOrderSchema);