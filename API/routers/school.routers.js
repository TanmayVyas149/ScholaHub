const express = require("express");
const { registerSchool,getAllSchools, loginSchool, updateSchool, getSchoolOwnData } = require("../controllers/school.controller");
const router = express.Router();
const authMiddleware = require("../auth/auth")

router.post("/register",registerSchool);
router.get("/all",getAllSchools);
router.post("/login",loginSchool);
router.patch("/update", authMiddleware(['SCHOOL']),updateSchool);
router.get("/fetch-single",  authMiddleware(['SCHOOL']),getSchoolOwnData);


module.exports = router;