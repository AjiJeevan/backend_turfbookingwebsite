import express from "express"
import { managerAuth } from "../middlewares/managerAuth.js";
import { deactivateManager, managerLogin, managerLogout, managerProfile, updateManagerPassword, updateManagerProfile } from "../controllers/managerControllers.js";
import { checkManager } from "../middlewares/checkManager.js";
import { adminAuth } from "../middlewares/adminAuth.js";
import { adminSignin } from "../controllers/adminControllers.js";

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
router.post("/update-profile", managerAuth, updateManagerProfile);

//Register Manager
router.post("/register-manager",adminAuth,adminSignin)

//Deactivate Manager Account
router.put("/deactivate-manager", adminAuth, deactivateManager);




export { router as managerRouter };