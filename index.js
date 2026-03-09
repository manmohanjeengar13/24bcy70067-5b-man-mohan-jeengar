import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import methodOverride from "method-override";
import connectDB from "./config/db.js";
import studentRoutes from "./routes/student.routes.js";
import studentViewRoutes from "./routes/student.view.routes.js";

dotenv.config();
connectDB();

const app = express();

app.set("view engine", "ejs");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.use("/students", studentRoutes);
app.use("/view/students", studentViewRoutes);

app.listen(process.env.PORT, () =>
  console.log(`🚀 Server running on port ${process.env.PORT}`)
);