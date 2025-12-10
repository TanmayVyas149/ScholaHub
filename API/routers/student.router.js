// const express = require("express");
// const { registerStudent,updateStudent,deleteStudentWithId,loginStudent,getStudentOwnData,getStudentsWithQuery, getStudentWithId} = require("../controllers/student.controller");
// const router = express.Router();
// const authMiddleware = require("../auth/auth")

// router.post("/register",authMiddleware(['SCHOOL']),registerStudent);
// router.get("/fetch-with-query",authMiddleware(['SCHOOL']),getStudentsWithQuery);
// router.post("/login",loginStudent);
// router.patch("/update/:id", authMiddleware(['SCHOOL']),updateStudent);
// router.get("/fetch-single",  authMiddleware(['STUDENT']),getStudentOwnData);
// router.get("/fetch/:id",  authMiddleware(['SCHOOL']),getStudentWithId);
// router.get("/delete/:id",  authMiddleware(['SCHOOL']),deleteStudentWithId);

// module.exports = router;
// routes/student.router.js
const express = require("express");
const {
  registerStudent,
  updateStudent,
  deleteStudentWithId,
  loginStudent,
  getStudentOwnData,
  getStudentsWithQuery,
  getStudentWithId,
} = require("../controllers/student.controller");
const router = express.Router();
const authMiddleware = require("../auth/auth");

router.post("/register", authMiddleware(["SCHOOL"]), registerStudent);
router.get("/fetch-with-query", authMiddleware(["SCHOOL","TEACHER"]), getStudentsWithQuery);
router.post("/login", loginStudent);
router.patch("/update/:id", authMiddleware(["SCHOOL"]), updateStudent);
router.get("/fetch-single", authMiddleware(["STUDENT"]), getStudentOwnData);
router.get("/fetch/:id", authMiddleware(["SCHOOL"]), getStudentWithId);
router.delete("/delete/:id", authMiddleware(["SCHOOL"]), deleteStudentWithId);

module.exports = router;
