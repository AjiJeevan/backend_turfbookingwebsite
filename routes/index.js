import { adminRouter } from "./adminRoutes.js";
import { bookingRouter } from "./bookingRoutes.js";
import { managerRouter } from "./managerRoutes.js";
import { notificationRouter } from "./notificationRoutes.js";
import { paymentRouter } from "./paymentRoutes.js";
import { reviewRouter } from "./reviewRoutes.js";
import { turfRouter } from "./turfRoutes.js";
import { userRouter } from "./userRoutes.js"
import express from "express"

const router = express.Router()

router.use('/user',userRouter)
router.use("/admin", adminRouter);
router.use("/manager",managerRouter)
router.use("/turf",turfRouter)
router.use("/booking",bookingRouter)
router.use("/review",reviewRouter)
router.use("/payment",paymentRouter)
router.use("/notification",notificationRouter)

export {router as apiRouter}