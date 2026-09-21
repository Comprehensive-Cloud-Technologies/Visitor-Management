import express from "express";

import {

  getEmployees,

  getEmployee,

  addEmployee,

  updateEmployee,

  deleteEmployee,

  importEmployees

}
from "../controllers/employeeController.js";


const router =
  express.Router();


/* ==========================================
   GET ALL EMPLOYEES
========================================== */

router.get(
  "/",
  getEmployees
);


/* ==========================================
   ADD EMPLOYEE
========================================== */

router.post(
  "/",
  addEmployee
);


/* ==========================================
   IMPORT EMPLOYEES
========================================== */

router.post(
  "/import",
  importEmployees
);


/* ==========================================
   GET SINGLE EMPLOYEE
========================================== */

router.get(
  "/:id",
  getEmployee
);


/* ==========================================
   UPDATE EMPLOYEE
========================================== */

router.put(
  "/:id",
  updateEmployee
);


/* ==========================================
   DELETE EMPLOYEE
========================================== */

router.delete(
  "/:id",
  deleteEmployee
);


export default router;