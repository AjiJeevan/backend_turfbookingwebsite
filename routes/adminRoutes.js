import express from "express"
import { adminLogin, adminLogout, adminProfile, adminSignin, checkAdmin, deactivateAdmin, 
    updateAdminPassword, updateAdminProfile } from "../controllers/adminControllers.js"
import {deactivateManager} from "../controllers/managerControllers.js"
import { adminAuth } from "../middlewares/adminAuth.js";
import { upload } from "../middlewares/multer.js";
import { checkAdminValid } from "../middlewares/checkAdminValid.js";

const router = express.Router()


//signin
router.post("/signin",upload.single('profilePic'),adminSignin)

//login
router.put("/login", checkAdminValid, adminLogin);

//profile
router.get("/profile",adminAuth,adminProfile)

//logout
router.get("/logout",adminAuth,adminLogout)

//Update Password
router.patch("/update-password",adminAuth,updateAdminPassword)

//Deactivate Admin Account
router.put("/deactivate-admin/:id",adminAuth,deactivateAdmin)

//profile-updates
router.post("/update-profile", adminAuth, upload.single('profilePic'), updateAdminProfile)

// Check User
router.get("/check-user", adminAuth, checkAdmin);


export {router as adminRouter}