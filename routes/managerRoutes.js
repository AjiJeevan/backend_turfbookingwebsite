import express from "express"
import { managerAuth } from "../middlewares/managerAuth.js";
import { managerLogin, managerLogout, managerProfile, updateManagerPassword } from "../controllers/managerControllers.js";
import { checkManager } from "../middlewares/checkManager.js";

const router = express.Router()

//login
router.put("/login",checkManager ,managerLogin);

//profile
router.get("/profile",managerAuth,managerProfile)

//logout
router.get("/logout",managerAuth,managerLogout)

//Update Password
router.patch("/update-password",managerAuth,updateManagerPassword)




export { router as managerRouter };