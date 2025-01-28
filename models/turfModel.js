import mongoose, { Schema } from "mongoose";

const turfSchema = mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  location: {
    address: {
      type: String,
      require: true,
    },
    city: {
      type: String,
      require: true,
    },
  },
  image: {
    type: String,
    default:
      "https://rubberflooringmats.ae/wp-content/uploads/2024/05/Football-Artificial-1.jpg",
  },
  price: {
    type: Number,
    require: true,
  },
  facilities: [
    {
      type: String,
    },
  ],
  sportsType: {
    type: [String],
  },
  availability: [
    {
      date: {
        type: Date,
        require: true,
      },
      slots: [
        {
          startTime: {
            type: String,
            require: true,
          },
          endTime: {
            type: String,
            require: true,
          },
          isAvailable: {
            type: Boolean,
            require: true,
            default: true,
          },
        },
      ],
    },
  ],
  managerId: {
    type: mongoose.Types.ObjectId,
    ref: "Manager",
    require: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

export const Turf = mongoose.model("Turf", turfSchema);
