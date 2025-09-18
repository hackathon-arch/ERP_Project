import express from "express";
import cors from "cors";
import ejs from "ejs";
import path from "path"; // 1. Import the 'path' module
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src", "views"));

import healtcheckRouter from "./src/routers/healthcheck.routes.js";
import authRouter from "./src/routers/user.routes.js";
import adminRouter from "./src/routers/admin.routes.js";
import wardenRoutes from "./src/routers/warden.routes.js";
import departmentRoutes from "./src/routers/department.routes.js";
import cookieParser from "cookie-parser";

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

app.use("/healthcheck", healtcheckRouter);
app.use("/api/v1/auth", authRouter);
app.use("/admin", adminRouter);
app.use("/warden", wardenRoutes);
app.use("/department", departmentRoutes);

app.get("/", (req, res) => {
  res.render("home");
});

export default app;
