import Router from "express";
import College from "../models/college.js";
import { User } from "../models/user.js";
const router = Router();
import {
  create_college,
  create_department,
  create_hostel,
  make_announcement,
  make_fees_announcement,
} from "../controllers/admin.controllers.js";
import Department from "../models/department.js";

// super admin router.post("/create_college", create_college);

router.get("/create_department", async (req, res) => {
  const colleges = await College.find({});
  res.render("create_department", { colleges });
});
router.post("/create_department", create_department);
// warden router.post("/create_room", create_room);
router.get("/create_hostel", async (req, res) => {
  const colleges = await College.find({});
  const wardens = await User.find({ role: "hostel_admin" });
  res.render("create_hostel", { colleges, wardens });
});
router.post("/create_hostel", create_hostel);

router.get("/make_announcement", async (req, res) => {
  const colleges = await College.find({});
  res.render("announcement", { colleges });
});
router.post("/make_announcement", make_announcement);

router.get("/make_fees_announcement", async (req, res) => {
  const colleges = await College.find({});
  const departments = await Department.find({});
  res.render("fees_announcement", { colleges, departments });
});
router.post("/make_fees_announcement", make_fees_announcement);

export default router;
