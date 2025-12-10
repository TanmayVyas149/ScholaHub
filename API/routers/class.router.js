const express = require("express");
const {createClass,getAllClasses,getSingleClass,updateClassWithId,deleteClassWithId,getAttendeeClass} = require('../controllers/class.controller');
const router = express.Router();
const authMiddleware = require("../auth/auth")

router.post("/create", authMiddleware(['SCHOOL']),createClass);
router.get("/all", authMiddleware(['SCHOOL','TEACHER']),getAllClasses);
router.get("/single/:id", authMiddleware(['SCHOOL']),getSingleClass);
router.get("/attendee",authMiddleware(['TEACHER']),getAttendeeClass);
router.patch("/update/:id", authMiddleware(['SCHOOL']),updateClassWithId);
router.delete("/delete/:id",  authMiddleware(['SCHOOL']),deleteClassWithId);


module.exports = router;