import express from "express";
const router = express.Router();
import {
  getAllUsers,
  register,
  sendRegisterOTP,
  sendForgetPasswordOTP,
  changePassword,
  login,
  deleteAllUsers,
  updateUserType,
} from "../controllers/user.js";
// import { hostevent } from "../controllers/events.js";

router.get("/get-all-users", getAllUsers);
router.post("/send-register-otp", sendRegisterOTP);
router.post("/register", register);
router.post("/login", login);
// router.get("/get-all-posts", hostevent);
router.post("/send-forget-password-otp", sendForgetPasswordOTP);
router.put("/change-password", changePassword);
router.put("/update-usertype", updateUserType);
router.delete("/delete_all_users", deleteAllUsers);

export default router;
