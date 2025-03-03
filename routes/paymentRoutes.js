import express from "express"
import { userAuth } from "../middlewares/userAuth.js";
import { createCheoutSession, getAllPayments, getAllUserPayments, getPaymentDetails, newPayment, updatePaymentStatus } from "../controllers/paymentController.js";
import { managerAuth } from "../middlewares/managerAuth.js";
import { adminAuth } from "../middlewares/adminAuth.js";

const router = express.Router()

// Create New Payment
router.post("/new-payment",userAuth,newPayment)

// Get Payment Details
router.get("/payment-details/:id",getPaymentDetails)

// Update Payment Status
router.put("/update-payment-status",managerAuth,updatePaymentStatus)

// Get All Payments
router.get("/all-payments", adminAuth, getAllPayments)

// Get All Payments of a User
router.get("/all-user-payments", userAuth, getAllUserPayments)

//Create Check Out Session
router.post("/create-checkout-session", userAuth,createCheoutSession)


export { router as paymentRouter };