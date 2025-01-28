import express from "express"
import { managerAuth } from "../middlewares/managerAuth.js";
import { deleteNotification, getNotificationDetails, newNotification } from "../controllers/notificationControllers.js";

const router= express.Router()

// Create a Notification
router.post("/new-notification",managerAuth,newNotification)

// Get Notifications of a User
router.get("/notification-details/:id",managerAuth,getNotificationDetails)

// Delete Notification
router.put("/delete-notification/:id",managerAuth,deleteNotification)


export { router as notificationRouter };