import Router from "express";
const router = Router();
import {
  create_college,
  create_department,
} from "../controllers/admin.controllers.js";

import { create_room } from "../controllers/warden.controllers.js";

router.post("/create_college", create_college);
router.post("/create_department", create_department);
router.post("/create_room", create_room);

export default router;
