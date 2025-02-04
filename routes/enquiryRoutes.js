import express from "express"
import { newEnquiry } from "../controllers/enquiryControllers.js";

const router = express.Router()

// Send Enquiry
router.post("/new-enquiry",newEnquiry);

export { router as enquiryRouter };