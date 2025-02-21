import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  turfId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Turf",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  slots: {
    type: [String],
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["confirmed", "cancelled", "completed"],
    default: "confirmed",
  },
  requestStatus: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  paymentStatus: {
    type: String,
    enum: ["not", "paid", "failed"],
    default: "not",
  },
},
{ timestamps: true }
);

export const Booking = mongoose.model("Booking", bookingSchema);
