import mongoose from "mongoose"

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    bookingId : {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["Booking", "Payment", "General", "Reminder"],
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    isActive:{
        type :Boolean,
        default : true
    }
  },
  { timestamps: true }
);

export const Notification = mongoose.model("Notification", notificationSchema);

