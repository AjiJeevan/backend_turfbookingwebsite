import express from "express"
import { userAuth } from "../middlewares/userAuth.js";
import { getAllBookingAdmin, getAllBookings, getAvailableSlot, getBookingDetails, getBookingHistory, getManagerBookings, getUserBookings, newBooking, updateBookingRequest, updateBookingStatus, updateCompletedBooking } from "../controllers/bookingControllers.js";
import { managerAuth } from "../middlewares/managerAuth.js";
import { adminAuth } from "../middlewares/adminAuth.js";

const router = express.Router()

//See all the bookings
router.get("/all-booking", managerAuth, getAllBookings)

//See all the bookings Admin
router.get("/all-booking-admin", adminAuth, getAllBookingAdmin);

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

// Get booking details of a turf on a selected day for user
router.post("/available-slot", getAvailableSlot);

// Get All bookings of a Specific user
router.get("/user-booking", userAuth, getUserBookings);

// Get All Booking under a manager
router.get("/all-boooking-manager", managerAuth, getManagerBookings)

// Update complete/expired booking
router.put("/completed-booking", updateCompletedBooking)




export { router as bookingRouter };