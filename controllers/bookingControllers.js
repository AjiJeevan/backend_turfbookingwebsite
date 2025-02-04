import { Booking } from "../models/bookingModel.js";
import { Turf } from "../models/turfModel.js";

//New Booking
export const newBooking = async(req,res,next)=>{
    try {

        const {turfId,date,slot,totalPrice} = req.body;
        const userId = req.user.id;

        if (!turfId || !date || !slot || !slot.startTime || !slot.endTime || !totalPrice) {
          return res.status(400).json({
            message: "All fields are required.",
          });
        }

        const turf = await Turf.findById(turfId)
        if(!turf){
            return res.status(404).json({ message: "Turf not found." });
        }

        const existingBookings = await Booking.find({
            turfId,
            date,
            'slot.startTime': { $lt: slot.endTime },
            'slot.endTime': { $gt: slot.startTime }  
        })

        if (existingBookings.length > 0) {
          return res
            .status(409)
            .json({ message: "The selected slot is not available." });
        }

        const bookingInfo= new Booking({
          turfId,
          userId,
          date,
          slot,
          totalPrice
        });

        await bookingInfo.save()

        return res.json({data : bookingInfo , message : "Booking details added to the database"})
        
    } catch (error) {
        return res
          .status(error.statusCode || 500)
          .json({ message: error.message || "Internal server error" });
    }
}

// Get all booking details for Manager
export const getAllBookings = async (req, res, next) => {
  try {

    const userId = req.user.id

    const turfId = await Turf.find({userId : userId }, 'turfId')

    if(!turfId){
        return res.status(404).json({message : "No turf assigned"})
    }

    const bookingLists = await Booking.find({turfId : turfId})


    if (!bookingLists) {
      return res.status(404).json({ message: "No details found " });
    }

    return res.json({ data: bookingLists, message: "Booking Lists fetched" });

  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Internal server error" });
  }
};

//Update Booking by user
export const updateBookingStatus = async(req,res,next)=>{
    try {

        const {bookingId,turfId,status} = req.body;
        const userId = req.user.id;

        if (!bookingId || !turfId || !status){
          return res.status(400).json({
            message: "All fields are required.",
          });
        }

        const turf = await Turf.findById(turfId)

        if(!turf){
            return res.status(404).json({ message: "Turf not found." });
        }

        const updatedBooking = await Booking.findById(bookingId)
        if (!updatedBooking) {
          return res.status(404).json({ message: "Booking is not found" });
        }

        updatedBooking.status = status;
        await updatedBooking.save();

        return res.json({data : updatedBooking , message : "Booking status updated"})
        
    } catch (error) {
        return res
          .status(error.statusCode || 500)
          .json({ message: error.message || "Internal server error" });
    }
}

//Update Booking Request by manager
export const updateBookingRequest = async(req,res,next)=>{
    try {

        const { bookingId, turfId, requestStatus } = req.body;
        const userId = req.user.id;

        if (!bookingId || !turfId || !requestStatus) {
          return res.status(400).json({
            message: "All fields are required.",
          });
        }

        const turf = await Turf.findById(turfId)

        if(!turf){
            return res.status(404).json({ message: "Turf not found." });
        }

        const updatedBooking = await Booking.findById(bookingId)
        if (!updatedBooking) {
          return res.status(404).json({ message: "Booking is not found" });
        }
        if(updatedBooking.status != "confirmed"  ){
            return res.status(404).json({ message: `Booking is ${updatedBooking.status}` });
        }

        updatedBooking.requestStatus = requestStatus;
        await updatedBooking.save();

        return res.json({data : updatedBooking , message : "Booking Request status updated"})
        
    } catch (error) {
        return res
          .status(error.statusCode || 500)
          .json({ message: error.message || "Internal server error" });
    }
}

// Get booking history
export const getBookingHistory = async (req, res, next) => {
  try {

    const userId = req.user.id

    const bookingHistory = await Booking.find({userId : userId})


    if (!bookingHistory) {
      return res.status(404).json({ message: "No Bookings" });
    }

    return res.json({ data: bookingHistory, message: "Booking Lists fetched" });

  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Internal server error" });
  }
};