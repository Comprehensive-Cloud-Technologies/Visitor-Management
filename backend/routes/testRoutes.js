import express from "express";
import { testVisitorPass } from "../controllers/testController.js";

const router = express.Router();

router.get("/pass/:id", testVisitorPass);

export default router;