import Router from "express";
const router = Router();

import { create_room } from "../controllers/warden.controllers.js";

router.post("/create_room", create_room);

export default router;
