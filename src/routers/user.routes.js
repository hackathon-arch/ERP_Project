import Router from "express";
const router = Router();
import {
  register,
  login,
  applyForHostel,
} from "../controllers/user.controllers.js";
import { protect } from "../middlewares/user.middlewares.js";
import {
  getMyFeeAnnouncements,
  recordPayment,
} from "../controllers/user.controllers.js";
import CollegeAnnouncement from "../models/collegeAnnouncements.models.js";
import FeesAnnouncement from "../models/feesAnnouncement.js";
import DepartmentAnnouncement from "../models/departmentAnnouncements.models.js";
import HostelAnnouncement from "../models/hostelAnnouncements.models.js";

router.get("/register", (req, res) => {
  res.render("register");
});

router.post("/register", register);

router.get("/login", (req, res) => {
  res.render("login");
});
router.post("/login", login);
router.post("/logout", protect, (req, res) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax", // or 'strict' depending on your setup
  });

  // You can redirect or send a JSON response
  return res.redirect("/"); // 👈 redirect to home after logout
});

router.get("/general_announcements", protect, async (req, res) => {
  const user = req.user;
  const announcements = await CollegeAnnouncement.find({});
  res.render("general", { user, announcements });
});

router.get("/general_announcements/:id", protect, async (req, res) => {
  const announcement = req.params;
  const user = req.user;
  const announcements = await CollegeAnnouncement.find({});
  res.render("general", { user, announcement });
});

router.get("/fees_announcements", protect, async (req, res) => {
  const user = req.user;
  const announcements = await FeesAnnouncement.find({});
  res.render("general", { user, announcements });
});

router.get("/fees_announcements/:id", protect, async (req, res) => {
  const announcement = req.params;
  const user = req.user;
  const announcements = await FeesAnnouncement.find({});
  res.render("general", { user, announcement });
});

router.get("/department_announcements", protect, async (req, res) => {
  const user = req.user;
  const announcements = await DepartmentAnnouncement.find({});
  res.render("general", { user, announcements });
});

router.get("/department_announcements/:id", protect, async (req, res) => {
  const announcement = req.params;
  const user = req.user;
  const announcements = await DepartmentAnnouncement.find({});
  res.render("general", { user, announcement });
});

router.get("/hostel_announcements", protect, async (req, res) => {
  const user = req.user;
  const announcements = await HostelAnnouncement.find({});
  res.render("general", { user, announcements });
});

router.get("/hostel_announcements/:id", protect, async (req, res) => {
  const announcement = req.params;
  const user = req.user;
  const announcements = await HostelAnnouncement.find({});
  res.render("general", { user, announcements });
});

router.get("/my_fees", protect, async (req, res) => {
  const user = req.user;
  if (!user) {
    res.status(404).json({ message: "problem created" });
  }
  const announcements = await FeesAnnouncement.find({
    semester: user.semester,
    department: user.department,
    college: user.college,
  });
  res.render("fees_status", { announcements });
});

router.post("/record/:announcementId", protect, recordPayment);

// Receipt page
router.get("/payment/receipt/:transactionId", protect, async (req, res) => {
  try {
    const { transactionId } = req.params;
    const payment = await Payment.findOne({ transactionId })
      .populate("student")
      .populate("fees_announcement");

    if (!payment) {
      return res.status(404).send("Receipt not found");
    }

    res.render("receipt", { payment });
  } catch (error) {
    console.error("Error fetching receipt:", error);
    res.status(500).send("Error generating receipt");
  }
});

export default router;
