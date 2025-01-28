import express from "express"
import { adminLogin, adminLogout, adminProfile, adminSignin, deactivateAdmin, 
    updateAdminPassword, updateAdminProfile } from "../controllers/adminControllers.js"
import {deactivateManager} from "../controllers/managerControllers.js"
import { adminAuth } from "../middlewares/adminAuth.js";
import { checkAdmin } from "../middlewares/checkAdmin.js";
import { upload } from "../middlewares/multer.js";

const router = express.Router()


//signin
router.post("/signin",upload.single('profilePic'),adminSignin)

//login
router.put("/login",checkAdmin ,adminLogin);

//profile
router.get("/profile",adminAuth,adminProfile)

//logout
router.get("/logout",adminAuth,adminLogout)

//Update Password
router.patch("/update-password",adminAuth,updateAdminPassword)

//Deactivate Admin Account
router.put("/deactivate-admin",adminAuth,deactivateAdmin)

//profile-updates
router.post("/update-profile",adminAuth,updateAdminProfile)


export {router as adminRouter}