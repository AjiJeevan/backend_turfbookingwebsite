import express from "express"
import { userSignin,userLogin, userProfile, userLogout, updateUserPassword, deactivateUser, updateUserProfile } from "../controllers/userControllers.js"
import { userAuth } from "../middlewares/userAuth.js";
import {checkUser} from "../middlewares/checkUser.js"

export const router = express.Router()


//signin
router.post("/signin",userSignin)

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



// check-user


export {router as userRouter}