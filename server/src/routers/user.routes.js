import Router from "express";
const router = Router();
import { register, login, logout } from "../controllers/user.controllers.js";
import { protect } from "../middlewares/user.middlewares.js";
import {
  getMyFeeAnnouncements,
  recordPayment,
} from "../controllers/user.controllers.js";

router.use(protect);

router.post("/register", register);
router.post("/login", login);
router.post("/logout", protect, logout);
router.get("/my_announcements", getMyFeeAnnouncements);
router.post("/pay", recordPayment);

export default router;
