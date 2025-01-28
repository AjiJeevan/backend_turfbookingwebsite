import express from "express"
import { userAuth } from "../middlewares/userAuth.js"
import { createReview, deleteReview, getTurfReview, updateReview } from "../controllers/reviewControllers.js"
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

// get reviews of a turf
router.get("/review/:id",getTurfReview)






export {router as reviewRouter}