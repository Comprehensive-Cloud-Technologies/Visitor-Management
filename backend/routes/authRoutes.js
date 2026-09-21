import express from "express";
import {signup,login,getUsers,
  getUser,
  updateUser,
  deleteUser,
  changeStatus,updateProfile,changePassword,} from "../controllers/authController.js";
  import { forgotPassword, verifyOtp, resetPassword } from "../controllers/passwordController.js";
  import employeeRoutes from "./employeeRoutes.js";

const router = express.Router();

router.get("/test", (req, res) => {
  res.send("Auth Route Working");
});

router.post("/register", signup);
router.post("/login", login);
router.get("/", getUsers);
router.get("/:id", getUser);
router.put("/profile/:id", updateProfile);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);
router.put("/status/:id", changeStatus);
router.put("/change-password/:id", changePassword);
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPassword);
router.use("/employees", employeeRoutes);
export default router;