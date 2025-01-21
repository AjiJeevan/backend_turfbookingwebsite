import express from "express"
import { adminLogin, adminLogout, adminProfile, adminSignin, deactivateAdmin, deactivateManager, updateAdminPassword } from "../controllers/adminControllers.js"
import { adminAuth } from "../middlewares/adminAuth.js";
import { checkAdmin } from "../middlewares/checkAdmin.js";

const router = express.Router()


//signin
router.post("/signin",adminSignin)

//login
router.put("/login",checkAdmin ,adminLogin);

//profile
router.get("/profile",adminAuth,adminProfile)

//logout
router.get("/logout",adminAuth,adminLogout)

//Register Manager
router.post("/register-manager",adminAuth,adminSignin)


//Update Password
router.patch("/update-password",adminAuth,updateAdminPassword)

//Deactivate Admin Account
router.put("/deactivate-admin",adminAuth,deactivateAdmin)

//Deactivate Manager Account
router.put("/deactivate-manager", adminAuth, deactivateManager);


export {router as adminRouter}