import mongoose, { Schema } from "mongoose";

const userSchema = mongoose.Schema({
  fname: {
    type: String,
    require: true,
  },
  lname: {
    type: String,
  },
  email: {
    type: String,
    require: true,
    unique: true,
  },
  password: {
    type: String,
    require: true,
    minLength: 8,
  },
  mobile: {
    type: String,
    require: true,
    maxLength: 10,
    unique: true,
  },
  profilePic: {
    type: String,
    default:
      "https://i.pinimg.com/originals/98/1d/6b/981d6b2e0ccb5e968a0618c8d47671da.jpg",
  },
  dob: {
    type: Date, // YYYY-MM-DD
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

export const User = mongoose.model("User", userSchema);
