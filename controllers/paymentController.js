import { Booking } from "../models/bookingModel.js";
import { Payment } from "../models/paymentModel.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create New Payment
export const newPayment = async(req,res,next)=>{
    try {

        const { bookingId, amount, paymentMethod, sessionId } = req.body;
        const userId = req.user.id;

        if ((!bookingId && !userId && !amount && !paymentMethod && !sessionId)) {
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
          sessionId,
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
        const paymentsLists = await Payment.find().populate("userId").sort({ createdAt: -1 })

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

// Get All Payments of a User
export const getAllUserPayments = async (req, res, next) => {
  try {
    const userId = req.user.id
    const payments = await Payment.find({ userId })
    .populate({
      path: "bookingId",
      select :"turfId",
      populate: {
        path: "turfId", 
        select: "name"
      }
    })
      .sort({ createdAt: -1 });
    
      if (!payments) {
        return res.status(404).json({ message: "No Paymnet Details Found " });
    }

      return res.json({ data: payments, message: "Payment list fetched for the user" });
    
  } catch (error) {
    return res
          .status(error.statusCode || 500)
          .json({ message: error.message || "Internal server error" });
  }
}



// Create Checkout Session
export const createCheoutSession = async (req, res, next) => {
  try {
    
    const { bookingId } = req.body
    // console.log("BookingId", bookingId)

    const userId = req.user.id

    const booking = await Booking.findById(bookingId).populate("turfId");
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL}/user/payment-success`,
      cancel_url: `${process.env.FRONTEND_URL}/user/payment-error`,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: booking.turfId.name,
              description: `Booking for ${booking.slots.join(", ")} on ${new Date(booking.date).toDateString()}`,
            },
            unit_amount: booking.totalPrice * 100,
          },
          quantity: 1,
        },
      ],
    });

    // Saving Payment details
    // console.log("checking.....")

    

    booking.paymentStatus = "paid";
    await booking.save();

    const newPayment = new Payment({
      bookingId,
      turfId : booking.turfId,
      userId,
      amount : booking.totalPrice,
      paymentMethod: "Credit Card",
      sessionId : session?.id,
    });
    await newPayment.save()

    res.status(200).json({data: newPayment, message : "Payment Successfull", sessionId: session.id });

  } catch (error) {
    return res
          .status(error.statusCode || 500)
          .json({ message: error.message || "Error creating payment session" });
  }
}
