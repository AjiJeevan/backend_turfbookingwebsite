import express from "express"
import { createTurf, deleteTurf, getAllTurf, getTurfAssigned, getTurfDetails, reassignManager, updateTurf } from "../controllers/turfControllers.js";
import { adminAuth } from "../middlewares/adminAuth.js";
import {upload} from "../middlewares/multer.js"

const router = express.Router()

// Add New Turf
router.post("/create-turf",adminAuth,upload.single('image'),createTurf)

// Update Existing Turf
router.post("/update-turf/:id", adminAuth,upload.single('image'), updateTurf);

// Get All Turf
router.get("/all-turf",getAllTurf)

// Get Details of a Turf
router.get("/turf-details/:id",getTurfDetails)

// Delete Turf 
router.delete("/delete-turf/:id", adminAuth, deleteTurf)

// get list of turf assigned to a manager for admin
router.get("/assigned-turf/:id", adminAuth, getTurfAssigned)

//Reassign manager with other Manager
router.put("/reassign-manager",adminAuth,reassignManager)



export { router as turfRouter };