import express from "express"
import { managerAuth } from "../middlewares/managerAuth.js";
import { checkManager, deactivateManager, getAllManager, getAssignedTurf, getManagerDetails, managerLogin, managerLogout, managerProfile, updateManager, updateManagerPassword, updateManagerProfile } from "../controllers/managerControllers.js";

import { adminAuth } from "../middlewares/adminAuth.js";
import { adminSignin } from "../controllers/adminControllers.js";
import { upload } from "../middlewares/multer.js";
import { checkManagerValid } from "../middlewares/checkManagerValid.js";

const router = express.Router()

//login
router.put("/login",checkManagerValid,managerLogin);

//profile
router.get("/profile",managerAuth,managerProfile)

//logout
router.get("/logout",managerAuth,managerLogout)

//Update Password
router.patch("/update-password",managerAuth,updateManagerPassword)

//profile-updates
router.post("/update-profile", managerAuth, upload.single('profilePic'), updateManagerProfile);

//Register Manager
router.post("/register-manager",adminAuth,adminSignin)

//Deactivate Manager Account
router.delete("/deactivate-manager/:id", adminAuth, deactivateManager);

// Get All Manager Details
router.get("/all-manager", adminAuth, getAllManager)

// Get Assigned Turf
router.get("/assigned-turf", managerAuth, getAssignedTurf)

// Get Details of a manager for Admin
router.get("/manager-details/:id", adminAuth, getManagerDetails)

// Update a manager details by Admin
router.put("/update-manager/:id",adminAuth,updateManager)

// Check User
router.get("/check-user", managerAuth,checkManager);




export { router as managerRouter };