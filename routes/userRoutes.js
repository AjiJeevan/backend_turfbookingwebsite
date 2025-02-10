import express from "express"
import { userSignup,userLogin, userProfile, userLogout, updateUserPassword, deactivateUser, updateUserProfile, checkUser } from "../controllers/userControllers.js"
import { userAuth } from "../middlewares/userAuth.js";
import {checkUserValid} from "../middlewares/checkUserValid.js"
import { upload } from "../middlewares/multer.js";
import { authenticateToken } from "../middlewares/authenticateToken.js";

export const router = express.Router()


//signup
router.post("/signup",upload.single('profilePic'),userSignup)

//login
router.put("/login",checkUserValid,userLogin);

//profile
router.get("/profile",userAuth,userProfile)

//logout
router.get("/logout",userAuth,userLogout)

//profile-updates
router.post("/update-profile",userAuth,upload.single('profilePic'),updateUserProfile)

//forgot-password

//Update Password
router.patch("/update-password",userAuth,updateUserPassword)

//deactivate-account
router.put("/deactivate-account", userAuth, deactivateUser);

// Verify Token
router.get("/verify-token", authenticateToken)

// Check User
router.get("/check-user", userAuth, checkUser);


export {router as userRouter}