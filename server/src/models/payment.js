import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    fee_structure: {
      type: mongoose.Schema.ObjectId,
      ref: "FeeStructure",
      required: true,
    },
    amount_paid: {
      type: Number,
      required: true,
    },
    transaction_id: {
      type: String,
      required: true,
      unique: true,
    },
    payment_status: {
      type: String,
      enum: ["success", "failed", "pending"],
      required: true,
    },
    payment_date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Payment = mongoose.model("Payment", paymentSchema);
export default Payment;
