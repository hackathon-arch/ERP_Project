import express from "express";
import cors from "cors";
const app = express();
import healtcheckRouter from "./src/routers/healthcheck.routes.js";
import authRouter from "./src/routers/user.routes.js";
import adminRouter from "./src/routers/admin.routes.js";
import wardenRoutes from "./src/routers/warden.routes.js";
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

app.get("/", (req, res) => {
  res.json({ message: "this is the home route" });
});

export default app;
