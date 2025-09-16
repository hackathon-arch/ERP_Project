import Router from "express";
const router = Router();

import {
  create_room,
  make_hostel_announcement,
} from "../controllers/warden.controllers.js";

router.post("/create_room", create_room);
router.post("/make_hostel_announcement", make_hostel_announcement);

export default router;
