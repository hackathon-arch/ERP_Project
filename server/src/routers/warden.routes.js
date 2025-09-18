import Router from "express";
const router = Router();
import { User } from "../models/user.js";
import { protect } from "../middlewares/user.middlewares.js";
import {
  create_room,
  make_hostel_announcement,
} from "../controllers/warden.controllers.js";
import College from "../models/college.js";
import Hostel from "../models/hostel.js";
import Department from "../models/department.js";
router.get("/create_room", async (req, res) => {
  const students = await User.find({ role: "student" });
  res.render("create_room", { students });
});
router.post("/create_room", protect, create_room);
router.get("/make_hostel_announcement", async (req, res) => {
  const colleges = await College.find({});
  const hostels = await Hostel.find({});
  const students = await User.find({ role: "student" });
  res.render("hostel_announcement", { colleges, hostels, students });
});
router.post("/make_hostel_announcement", make_hostel_announcement);

export default router;
