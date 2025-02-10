import express from "express"
import { managerAuth } from "../middlewares/managerAuth.js";
import { deactivateManager, getAllManager, getAssignedTurf, managerLogin, managerLogout, managerProfile, updateManagerPassword, updateManagerProfile } from "../controllers/managerControllers.js";
import { checkManager } from "../middlewares/checkManager.js";
import { adminAuth } from "../middlewares/adminAuth.js";
import { adminSignin } from "../controllers/adminControllers.js";
import { upload } from "../middlewares/multer.js";

const router = express.Router()

//login
router.put("/login",checkManager ,managerLogin);

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
router.get("/assigned-turf",managerAuth,getAssignedTurf)




export { router as managerRouter };