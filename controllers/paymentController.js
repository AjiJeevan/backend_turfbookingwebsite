import { Booking } from "../models/bookingModel.js";
import { Payment } from "../models/paymentModel.js";


// Create New Payment
export const newPayment = async(req,res,next)=>{
    try {

        const { bookingId, amount, paymentMethod, transactionId } = req.body;
        const userId = req.user.id;

        if ((!bookingId && !userId && !amount && !paymentMethod && !transactionId)) {
          console.log(slot.endtTime);
          return res.status(400).json({
            message: "All fields are required.",
          });
        }

        const booking = await Booking.findById(bookingId)
        if(!booking){
            return res.status(404).json({ message: "Booking not found." });
        }

        const newPayment = new Payment({
          bookingId,
          userId,
          amount,
          paymentMethod,
          transactionId,
        });
        await newPayment.save()
        return res.json({data : newPayment,"message": "New Payment created"})
        
    } catch (error) {
        return res
          .status(error.statusCode || 500)
          .json({ message: error.message || "Internal server error" });
    }
}

// Get Payment Details
export const getPaymentDetails = async(req,res,next)=>{
    try {

        const paymentId = req.params.id
        
        const paymentDetails = await Payment.findById(paymentId)

        if(!paymentDetails){
            return res.status(404).json({message : "Payment details not found"})
        }
        return res.json({data : paymentDetails , message : "Payment Details fetched"})

    } catch (error) {
        return res
          .status(error.statusCode || 500)
          .json({ message: error.message || "Internal server error" });
    }
}


// Update Payment Status by Manager
export const updatePaymentStatus = async (req, res, next) => {
  try {
    const {paymentId, paymentStatus} = req.body;
    const userId = req.user.id;

    if (!paymentId && !userId) {
      console.log(slot.endtTime);
      return res.status(400).json({
        message: "All fields are empty.",
      });
    }

    const paymentDetails = await Payment.findById(paymentId);
    if (!paymentDetails) {
      return res.status(404).json({ message: "Payment details not found." });
    }

    paymentDetails.paymentStatus = paymentStatus;
    await paymentDetails.save()

    return res.json({
      data: paymentDetails,
      message: "Payment status updated successfully.",
    });
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Internal server error" });
  }
};

// Get All Payments
export const getAllPayments = async(req,res,next)=>{
    try {
        const paymentsLists = await Payment.find();

        if (!paymentsLists) {
          return res.status(404).json({ message: "No record found " });
        }
        return res.json({ data: paymentsLists, message: "Payment list is fetched" });
    } catch (error) {
        return res
          .status(error.statusCode || 500)
          .json({ message: error.message || "Internal server error" });
    }
}
