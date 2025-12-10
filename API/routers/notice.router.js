const express = require("express");
const {createNotice,updateNoticeWithId,deleteNoticeWithId,getAllNotices,getTeacherNotices,getStudentNotices} = require("../controllers/notice.controller")
const router = express.Router();
const authMiddleware = require("../auth/auth")

router.post("/create", authMiddleware(['SCHOOL']),createNotice);
router.get("/all", authMiddleware(['SCHOOL']),getAllNotices);
router.get("/teacher",authMiddleware(['TEACHER']),getTeacherNotices);
router.get("/student",authMiddleware(['STUDENT']),getStudentNotices);
router.patch("/update/:id", authMiddleware(['SCHOOL']),updateNoticeWithId);
router.delete("/delete/:id",  authMiddleware(['SCHOOL']),deleteNoticeWithId);


module.exports = router;