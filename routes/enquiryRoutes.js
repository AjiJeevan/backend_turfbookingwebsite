import express from "express"
import { getAllEnquiry, newEnquiry } from "../controllers/enquiryControllers.js";
import { adminAuth } from "../middlewares/adminAuth.js";

const router = express.Router()

// Send Enquiry
router.post("/new-enquiry", newEnquiry);

// Get All Enquiry
router.get("/all-enquiry",adminAuth,getAllEnquiry)

export { router as enquiryRouter };