import express from "express"
import { userAuth } from "../middlewares/userAuth.js";
import { getAllBookings, getBookingDetails, getBookingHistory, newBooking, updateBookingRequest, updateBookingStatus } from "../controllers/bookingControllers.js";
import { managerAuth } from "../middlewares/managerAuth.js";

const router = express.Router()

//See all the bookings
router.get("/all-booking",managerAuth, getAllBookings)

// Update booking request status
router.put("/update-booking-request", managerAuth, updateBookingRequest);

//Create booking
router.post("/new-booking",userAuth,newBooking)

//Update booking status
router.put("/update-booking",userAuth,updateBookingStatus)

//Booking history
router.get("/booking-history", userAuth, getBookingHistory)

// Booking Details of a turfs assigned to a particular manager
router.get("/booking-details/:id", managerAuth, getBookingDetails)



export { router as bookingRouter };