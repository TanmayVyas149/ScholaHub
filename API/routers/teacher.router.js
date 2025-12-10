
const express = require("express");
const {updateTeacher,registerTeacher,loginTeacher,getTeacherById,deleteTeacherWithId,getTeachersWithQuery,getTeacherOwnData} = require("../controllers/teacher.controller");
const router = express.Router();
const authMiddleware = require("../auth/auth");

router.post("/register", authMiddleware(["SCHOOL"]), registerTeacher);
router.get("/fetch-with-query", authMiddleware(["SCHOOL"]), getTeachersWithQuery);
router.post("/login", loginTeacher);
router.patch("/update/:id", authMiddleware(["SCHOOL"]),updateTeacher);
router.get("/fetch-single", authMiddleware(["TEACHER"]), getTeacherOwnData);
router.get("/fetch/:id", authMiddleware(["SCHOOL"]),getTeacherById);
router.delete("/delete/:id", authMiddleware(["SCHOOL"]),deleteTeacherWithId);

module.exports = router;
