const express = require("express");
const {getAllSubjects,createSubject,updateSubjectWithId,deleteSubjectWithId} = require('../controllers/subject.controller');
const authMiddleware = require("../auth/auth")

const router = express.Router();

router.post("/create", authMiddleware(['SCHOOL']),createSubject);
router.get("/all", authMiddleware(['SCHOOL']),getAllSubjects);
router.patch("/update/:id", authMiddleware(['SCHOOL']),updateSubjectWithId);
router.delete("/delete/:id",  authMiddleware(['SCHOOL']),deleteSubjectWithId);


module.exports = router;