import { Booking } from "../models/bookingModel.js";
import { Turf } from "../models/turfModel.js";

//New Booking
export const newBooking = async(req,res,next)=>{
    try {

        const {turfId,date,slot,totalPrice} = req.body;
        const userId = req.user.id;

      if (!turfId || !date || !slot || slot.length === 0 || !totalPrice) {
          console.log(slot)
          return res.status(400).json({
            message: "All fields are required.",
          });
        }

        const turf = await Turf.findById(turfId)
        if(!turf){
            return res.status(404).json({ message: "Turf not found." });
      }

        const bookingInfo= new Booking({
          turfId,
          userId,
          date,
          slots : slot,
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

// Booking Details of a turfs assigned to a particular manager
export const getBookingDetails = async (req, res, next) => {
  try {
    const turfId = req.params.id
    if (!turfId) {
       return res.status(400).json({
         message: "Please provide Turf Id",
       });
    }

    const bookingLists = await Booking.find({ turfId }).populate("turfId").populate("userId")
    if (!bookingLists) {
      return res.status(404).json({
        message: "No Booking Found",
      });
    }

    return res.json({ data: bookingLists , message: "Booking Lists fetched" });
    
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Internal server error" });
  }
}

// All booking details for Admin
export const getAllBookingDetails = async (req, res, next) => {
  try {

    const bookingLists = await Booking.find();

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


// Get All booking details of a turf on a puticular day
export const getAvailableSlot = async (req, res, next) => {
  try {
    const { turfId, date } = req.body;

    if (!turfId && !date) {
      console.log(turfId);
      return res.status(404).json({ message: "Provide Turf Id and Date" });
    }

    const turf = await Turf.findById(turfId);
    if (!turf) {
      return res.status(404).json({ message: "Turf not found!" });
    }

    const bookedSlots = await Booking.find({ turfId, date }).select("slots");

    const bookedSlotList = bookedSlots.flatMap((booking) => booking.slots);

    const availableSlots = turf.availability
      .filter(
        (slot) => slot.isAvailable && !bookedSlotList.includes(slot.slots[0])
      )
      .map((slot) => slot.slots[0]);

    if (!availableSlots) {
      return res.status(404).json({ message: "No slot available" });
    }

    return res.json({
      data: availableSlots,
      message: `Booking Lists fetched for ${turfId} on ${date} `,
    });

  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Internal server error" });
  }
};


// Get All bookings of a Specific user
export const getUserBookings = async (req, res, next) => {
  try {
    const userId = req.user.id

    const upcomingBookings = await Booking.find({
      userId,
      status: "confirmed",
      requestStatus: { $in: ["pending", "approved"] },
    }).populate("turfId", "name location").sort({date : 1})
    
    // console.log("Upcoming booking ===== ", upcomingBookings)

    const pastBookings = await Booking.find({
      userId,
      status: { $in: ["cancelled", "completed"] },
    }).populate("turfId", "name location");

    // console.log("Past Booking === ", pastBookings)
    
    return res.json({ data: { upcoming: upcomingBookings, history :  pastBookings } , message : "User Booking Details Fetched ....."});
    
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Internal server error" });
  }
}


// Get All Booking under a manager
export const getManagerBookings = async (req, res, next) => {
  try {
    const managerId = req.user.id

    const turfs = await Turf.find({ managerId }).select("_id");
    
    if (!turfs) {
      return res.status(404).json({ message: "No Turf under this manager" });
    }

    const turfIds = turfs.map((turf) => turf._id);
    const bookings = await Booking.find({ turfId: { $in: turfIds } }).populate("userId turfId");
    // console.log("Turfs === ", bookings);

    if (!bookings) {
      return res.status(404).json({ message: "No booking under this manager" });
    }

    return res.json({
      data: bookings,
      message: "Booking Details For Manager Fetched .....",
    });

  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Internal server error" });
  }
}

export const getAllBookingAdmin = async (req, res, next) => {
  try {
    const bookingLists = await Booking.find().populate("userId turfId");;

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