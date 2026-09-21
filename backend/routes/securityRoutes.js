import express from "express";

import {

    searchVisitor

} from "../controllers/securityController.js";

const router = express.Router();

router.get(

    "/search/:keyword",

    searchVisitor

);

export default router;