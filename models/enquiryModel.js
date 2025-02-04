import mongoose, { Schema } from "mongoose";

const enquirySchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  enquiry: {
    type: String,
    maxlength: 500,
    required: true,
  },
  replyMessage: {
    type: String,
    maxlength: 500,
  },
  status: {
    type: String,
    enum: ["pending", "replied"],
    required: true,
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export const Enquiry = mongoose.model("Enquiry", enquirySchema);
