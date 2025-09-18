import Router from "express";
const router = Router();
import College from "../models/college.js";
import Department from "../models/department.js";
import { make_department_announcement } from "../controllers/department.controllers.js";

router.get("/make_department_announcement", async (req, res) => {
  const colleges = await College.find({});
  const departments = await Department.find({});
  res.render("department_announcement", { colleges, departments });
});

router.post("/make_department_announcement", make_department_announcement);
export default router;
