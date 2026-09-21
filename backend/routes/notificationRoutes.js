import express from "express";

import {
  getNotifications,
  markAllNotificationsRead
}
from "../controllers/notificationController.js";

const router =
  express.Router();

router.get(
  "/",
  getNotifications
);

router.put(
  "/mark-all-read",
  markAllNotificationsRead
);

export default router;