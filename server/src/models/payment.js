import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    fees_structure: {
      type: mongoose.Schema.ObjectId,
      ref: "FeesAnnouncement",
      required: true,
    },
    amount_paid: {
      type: Number,
      required: true,
    },
    payment_status: {
      type: String,
      enum: ["success", "failed"],
      default: "success",
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
