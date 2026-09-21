import express from "express";

import {

  getRolePermissions,

  saveRolePermissions,getPermissionsByRole

}

from "../controllers/rolePermissionController.js";

const router =
express.Router();


router.get(

  "/:roleId",

  getRolePermissions

);


router.post(

  "/",

  saveRolePermissions

);
router.get(

  "/permissions/:roleId",   
    getPermissionsByRole
);

export default router;