import express from "express";
import cors from "cors";
const app = express();

app.use(
  cors({
    origin: process.env.cors_origin,
    credentials: true,
  })
)

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

import healtcheckRouter from './src/routers/healthcheck.routes.js';
import userRouter from './src/routers/user.routes.js';
import { errorhandler } from './src/middlewares/error.middlewares.js';

app.get("/home", (req, res) => {
  res.json({ message: "this is the home route" });
});

app.use("/healthcheck", healtcheckRouter)
app.use("/users", userRouter)

app.use(errorhandler);
export default app;
