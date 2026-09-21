import express from "express";

import {
  getRoles,
  addRole,
  getRoleById,
  updateRole,
  deleteRole
}
from "../controllers/roleController.js";

const router =
  express.Router();

/* GET ALL ROLES */

router.get(
  "/",
  getRoles
);

/* ADD ROLE */

router.post(
  "/",
  addRole
);

/* GET SINGLE ROLE */

router.get(
  "/:id",
  getRoleById
);

/* UPDATE ROLE */

router.put(
  "/:id",
  updateRole
);

/* DELETE ROLE */

router.delete(
  "/:id",
  deleteRole
);

export default router;