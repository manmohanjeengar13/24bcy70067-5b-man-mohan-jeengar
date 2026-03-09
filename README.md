# 🎓 Student Management System (MVC)

A full-stack **CRUD (Create, Read, Update, Delete)** web application built using:

* **Node.js**
* **Express.js**
* **MongoDB (Mongoose)**
* **EJS**
* **Bootstrap 5**
* **pnpm**

This project follows the **MVC (Model-View-Controller)** architecture to ensure clean code structure and separation of concerns.

---

# 📌 Project Objective

The aim of this project is to:

* Implement MVC architecture
* Build RESTful APIs
* Integrate MongoDB using Mongoose
* Render dynamic UI using EJS
* Apply middleware and validation
* Create a clean and responsive frontend

---

# 🏗️ Project Architecture (MVC Pattern)

```
student-mvc/
│
├── config/
│   └── db.js
│
├── controllers/
│   └── student.controller.js
│
├── models/
│   └── student.model.js
│
├── routes/
│   ├── student.routes.js
│   └── student.view.routes.js
│
├── views/
│   └── students/
│       ├── index.ejs
│       └── edit.ejs
│
├── .env
├── index.js
└── package.json
```

### 🔹 Model

Defines database structure using Mongoose schema.

### 🔹 View

EJS templates that render dynamic HTML.

### 🔹 Controller

Handles business logic and database interaction.

### 🔹 Routes

Maps HTTP endpoints to controller functions.

---

# 🚀 Installation & Setup

## 1️⃣ Initialize Project

```bash
pnpm init -y
```

Add ES module support in `package.json`:

```json
"type": "module"
```

---

## 2️⃣ Install Dependencies

```bash
pnpm add express mongoose ejs dotenv cors method-override
pnpm add -D nodemon
```

---

## 3️⃣ Add Scripts in `package.json`

```json
"scripts": {
  "dev": "nodemon index.js",
  "start": "node index.js"
}
```

---

# 🔐 Environment Variables

Create `.env` file:

```env
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/studentDB
```

If using MongoDB Atlas:

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/studentDB
```

---

# 🗄️ Database Connection

## 📂 config/db.js

```js
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ Database Connection Failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;
```

### Explanation

* Connects to MongoDB using Mongoose.
* If connection fails → application exits.

---

# 📚 Student Model

## 📂 models/student.model.js

```js
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
```

### Explanation

* `name` must be:

  * Required
  * Between 3–50 characters
  * Automatically trimmed

* `roll` must be:

  * Unique
  * Positive integer

* `timestamps: true` adds:

  * `createdAt`
  * `updatedAt`

---

# 🎮 Controller Logic

## 📂 controllers/student.controller.js

```js
import Student from "../models/student.model.js";

export const getStudents = async (req, res) => {
  const students = await Student.find().sort({ roll: 1 });
  res.json(students);
};

export const createStudent = async (req, res) => {
  try {
    const student = await Student.create(req.body);
    res.status(201).json(student);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getStudentById = async (req, res) => {
  const student = await Student.findById(req.params.id);
  if (!student) return res.status(404).json({ error: "Not Found" });
  res.json(student);
};

export const updateStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(student);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteStudent = async (req, res) => {
  await Student.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted Successfully" });
};
```

### Explanation

Each function:

* Receives request
* Interacts with database
* Sends response

---

# 🌐 API Routes

## 📂 routes/student.routes.js

```js
import express from "express";
import {
  getStudents,
  createStudent,
  getStudentById,
  updateStudent,
  deleteStudent
} from "../controllers/student.controller.js";

const router = express.Router();

router.get("/", getStudents);
router.post("/", createStudent);
router.get("/:id", getStudentById);
router.put("/:id", updateStudent);
router.delete("/:id", deleteStudent);

export default router;
```

### RESTful Endpoints

| Method | Endpoint      | Description      |
| ------ | ------------- | ---------------- |
| GET    | /students     | Get all students |
| POST   | /students     | Create student   |
| GET    | /students/:id | Get one student  |
| PUT    | /students/:id | Update student   |
| DELETE | /students/:id | Delete student   |

---

# 🖥️ View Routes (EJS Rendering)

## 📂 routes/student.view.routes.js

```js
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
```

### Difference from API routes:

* API routes return JSON.
* View routes render EJS templates.

---

# 🎨 Frontend (EJS + Bootstrap)

### index.ejs

* Displays student cards
* Add student form
* Edit & Delete buttons
* Responsive Bootstrap UI

### edit.ejs

* Pre-filled form
* Updates student record

---

# 🧠 Main Entry File

## 📂 index.js

```js
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

app.get("/", (req, res) => {
  res.redirect("/view/students");
});

app.listen(process.env.PORT, () =>
  console.log(`🚀 Server running on port ${process.env.PORT}`)
);
```

---

# 🧪 Running the Project

```bash
pnpm dev
```

Open in browser:

```
http://localhost:3000
```

---

# 📊 Features Implemented

✅ MVC Architecture
✅ RESTful Routing
✅ MongoDB Integration
✅ Form Handling
✅ Method Override for PUT & DELETE
✅ Input Validation
✅ Bootstrap Responsive UI
✅ Error Handling

---

# 🔮 Future Improvements

* Search functionality
* Pagination
* Flash messages
* AJAX-based CRUD
* Authentication (Admin login)
* Deployment on Render / Railway / VPS
* Docker support

---

# 📌 Conclusion

This project demonstrates:

* Clean architecture
* Backend development fundamentals
* Database integration
* Professional folder structure
* Real-world CRUD application design

It serves as a solid foundation for building larger full-stack applications.

---

© 2026 Student Management System Project
Built using Node.js, Express, MongoDB & EJS
