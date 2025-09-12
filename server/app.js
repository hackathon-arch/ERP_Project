import express from "express";
import cors from "cors";
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.get("/home", (req, res) => {
  res.json({ message: "this is the home route" });
});

export default app;
