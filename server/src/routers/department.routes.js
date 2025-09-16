import Router from "express";
const router = Router();
import { make_department_announcement } from "../controllers/department.controllers.js";

router.post("/make_department_announcement", make_department_announcement);
export default router;
