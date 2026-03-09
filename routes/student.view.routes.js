import express from "express";
import Student from "../models/student.model.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const students = await Student.find().sort({ roll: 1 });
  res.render("students/index", { students });
});

router.get("/edit/:id", async (req, res) => {
  const student = await Student.findById(req.params.id);
  res.render("students/edit", { student });
});

router.post("/", async (req, res) => {
  await Student.create(req.body);
  res.redirect("/view/students");
});

router.put("/:id", async (req, res) => {
  await Student.findByIdAndUpdate(req.params.id, req.body);
  res.redirect("/view/students");
});

router.delete("/:id", async (req, res) => {
  await Student.findByIdAndDelete(req.params.id);
  res.redirect("/view/students");
});

export default router;
