import { Booking } from "../models/bookingModel.js";
import { Notification } from "../models/notificationModel.js";


// Create a Notification
export const newNotification = async(req,res,next)=>{
    try {

        const { userId, bookingId, title, message, type } = req.body;

        if (!userId || !bookingId || !title || !message || !type) {
          return res.status(400).json({
            message: "All fileds are required.",
          });
        }

        const booking = await Booking.findById(bookingId)
        if(!booking){
            return res.status(404).json({ message: "Booking not found." });
        }

        const newNotification = new Notification({
          userId,
          bookingId,
          title,
          message,
          type,
        });
        await newNotification.save()

        return res.json({data : newNotification,"message": "Notification created"})
        
    } catch (error) {
        return res
          .status(error.statusCode || 500)
          .json({ message: error.message || "Internal server error" });
    }
}


// Get Notifications of a User
export const getNotificationDetails = async(req,res,next)=>{
    try {

        const notificationId = req.params.id
        
        const notificationDetails = await Notification.findById(notificationId)

        if(!notificationDetails){
            return res.status(404).json({message : "notification details not found"})
        }
        return res.json({data : notificationDetails , message : "notification Details fetched"})

    } catch (error) {
        return res
          .status(error.statusCode || 500)
          .json({ message: error.message || "Internal server error" });
    }
}

// Delete Notification
export const deleteNotification = async (req, res, next) => {
  try {
    const notificationId= req.params.id;

    if (!notificationId) {
      return res.status(400).json({
        message: "Notification Id is Empty",
      });
    }

    const deletedNotification = await Notification.findById(notificationId)
    deletedNotification.isActive = false
    await deletedNotification.save();

    return res.json({
      data: deletedNotification,
      message: "Notification deletd successfully.",
    });

  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Internal server error" });
  }
};
