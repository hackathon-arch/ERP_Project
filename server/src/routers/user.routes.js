import Router from "express";
const router = Router();
import { register, login, logout } from "../controllers/user.controllers.js";
import { protect } from "../middlewares/user.middlewares.js";

router.post("/register", register);
router.post("/login", login);
router.post("/logout", protect, logout);

export default router;
