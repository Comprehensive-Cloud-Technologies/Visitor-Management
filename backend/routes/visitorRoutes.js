import express from "express";

import {

  getVisitors,
  getVisitorById,
  getVisitorByPassId,
  addVisitor,
  updateVisitor,
  deleteVisitor,
  checkOutVisitor,
  bulkUpdateVisitorStatus,
  approveVisitorFromEmail,
  checkInVisitor,
  getVisitorForScan,
  searchVisitors,
  getDashboardStats,
  printVisitorPass,
  getCurrentVisitors,
  getRecentActivity,
 

}
from "../controllers/visitorController.js";

const router = express.Router();
router.get("/", getVisitors);

router.post("/", addVisitor);

router.put("/bulk-status", bulkUpdateVisitorStatus);

router.put("/checkout/:id", checkOutVisitor);

router.get("/search/:query", searchVisitors);
router.get(

    "/pass/:visitorPassId",

    getVisitorByPassId

);

/* NEW ROUTES */
router.get("/current", getCurrentVisitors);

router.get("/recent-activity", getRecentActivity);

router.get("/dashboard-stats", getDashboardStats);

/* Approval & Scan */
router.get("/approve/:id/:status", approveVisitorFromEmail);

router.get("/scan/:id", getVisitorForScan);

/* Print Visitor Pass */
router.get("/print/:id", printVisitorPass);

router.put("/checkin/:id", checkInVisitor);

/* GENERIC ROUTES LAST */
router.get("/:id", getVisitorById);

router.put("/:id", updateVisitor);

router.delete("/:id", deleteVisitor);
export default router;