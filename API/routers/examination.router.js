const express = require("express");
const {getAllExamination,getExaminationsByClass,newExamination,deleteExaminationWithId,updateExminationWithId} = require('../controllers/examination.controller');
const router = express.Router();
const authMiddleware = require("../auth/auth")

router.post("/create", authMiddleware(['SCHOOL']),newExamination);
router.get("/all", authMiddleware(['SCHOOL']),getAllExamination);
router.get("/class/:id",authMiddleware(['SCHOOL','TEACHER','STUDENT']),getExaminationsByClass)
router.post("/update/:id", authMiddleware(['SCHOOL']),updateExminationWithId);
router.delete("/delete/:id",  authMiddleware(['SCHOOL']),deleteExaminationWithId);


module.exports = router;