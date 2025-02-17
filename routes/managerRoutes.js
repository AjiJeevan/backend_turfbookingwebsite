import express from "express"
import { managerAuth } from "../middlewares/managerAuth.js";
import { checkManager, deactivateManager, getAllManager, getAssignedTurf, managerLogin, managerLogout, managerProfile, updateManagerPassword, updateManagerProfile } from "../controllers/managerControllers.js";

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
router.put("/deactivate-manager", adminAuth, deactivateManager);

// Get All Manager Details
router.get("/all-manager", adminAuth, getAllManager)

// Get Assigned Turf
router.get("/assigned-turf", managerAuth, getAssignedTurf)

// Check User
router.get("/check-user", managerAuth,checkManager);




export { router as managerRouter };