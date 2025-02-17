import express from "express"
import { deleteEnquiry, getAllEnquiry, newEnquiry, sendReply } from "../controllers/enquiryControllers.js";
import { adminAuth } from "../middlewares/adminAuth.js";

const router = express.Router()

// Send Enquiry
router.post("/new-enquiry", newEnquiry);

// Get All Enquiry
router.get("/all-enquiry", adminAuth, getAllEnquiry)

// Delete Enquiry
router.delete("/delete/:id", adminAuth, deleteEnquiry)

// Update Enquiry
router.put("/update/:id",adminAuth,sendReply)

export { router as enquiryRouter };