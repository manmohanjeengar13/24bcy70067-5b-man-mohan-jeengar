import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 50
    },
    roll: {
      type: Number,
      required: true,
      unique: true,
      min: 1
    }
  },
  { timestamps: true }
);

export default mongoose.model("Student", studentSchema);