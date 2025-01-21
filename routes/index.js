import { adminRouter } from "./adminRoutes.js";
import { managerRouter } from "./managerRoutes.js";
import { userRouter } from "./userRoutes.js"
import express from "express"
const router = express.Router()

router.use('/user',userRouter)
router.use("/admin", adminRouter);
router.use("/manager",managerRouter)





export {router as apiRouter}