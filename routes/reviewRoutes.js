import express from "express"
import { userAuth } from "../middlewares/userAuth.js"
import { createReview, deleteReview, getTurfRating, getTurfReview, updateReview } from "../controllers/reviewControllers.js"
import { managerAuth } from "../middlewares/managerAuth.js"

const router = express.Router()

// create review
router.post("/new-review",userAuth,createReview)

// update review
router.put("/update-review",userAuth,updateReview)

// delete review by User
router.put("/delete-review/:id",userAuth,deleteReview)

// delete review by Manager
router.put("/monitor-review/:id",managerAuth,deleteReview)

// get reviews of a turf for user
router.get("/review/:id", userAuth, getTurfReview)

// get rating of a turf for user
router.get("/rating/:id", getTurfRating)

export {router as reviewRouter}