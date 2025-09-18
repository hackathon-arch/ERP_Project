import express from "express";
import cors from "cors";
import ejs from "ejs";
import path from "path"; // 1. Import the 'path' module
import { fileURLToPath } from "url";
import healtcheckRouter from "./src/routers/healthcheck.routes.js";
import authRouter from "./src/routers/user.routes.js";
import adminRouter from "./src/routers/admin.routes.js";
import wardenRoutes from "./src/routers/warden.routes.js";
import departmentRoutes from "./src/routers/department.routes.js";
import cookieParser from "cookie-parser";
import { protect } from "./src/middlewares/user.middlewares.js";
import { User } from "./src/models/user.js";
import jwt from "jsonwebtoken";

const app = express();

app.use(
  cors({
    origin: process.env.cors_origin,
    credentials: true,
  })
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(cookieParser());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use("/healthcheck", healtcheckRouter);
app.use("/api/v1/auth", authRouter);
app.use("/admin", adminRouter);
app.use("/warden", wardenRoutes);
app.use("/department", departmentRoutes);

app.get("/", async (req, res) => {
  let user = null;

  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");
    if (token) {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      user = await User.findById(decoded._id).select(
        "-password -refresh_token"
      );
    }
  } catch (error) {
    // You may log the error for debugging, but don't render here.
    console.error("Token validation failed on / route:", error.message);
  }

  res.render("home", { user }); // ✅ only render once here
});

app.get("/dashboard", protect, (req, res) => {
  if (req.user) {
    res.render("dashboard", { user: req.user });
  } else {
    res.render("dashboard");
  }
});

export default app;
