import express from "express"
import { userSignup,userLogin, userProfile, userLogout, updateUserPassword, deactivateUser, updateUserProfile } from "../controllers/userControllers.js"
import { userAuth } from "../middlewares/userAuth.js";
import {checkUser} from "../middlewares/checkUser.js"
import { upload } from "../middlewares/multer.js";
import { authenticateToken } from "../middlewares/authenticateToken.js";

export const router = express.Router()


//signup
router.post("/signup",upload.single('profilePic'),userSignup)

//login
router.put("/login",checkUser,userLogin);

//profile
router.get("/profile",userAuth,userProfile)

//logout
router.get("/logout",userAuth,userLogout)

//profile-updates
router.post("/update-profile",userAuth,updateUserProfile)

//forgot-password

//Update Password
router.patch("/update-password",userAuth,updateUserPassword)

//deactivate-account
router.put("/deactivate-account", userAuth, deactivateUser);

// Verify Token
router.get("/verify-token", authenticateToken)


export {router as userRouter}