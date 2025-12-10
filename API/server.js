require('dotenv').config()
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

//routers import
const schoolRouter = require("./routers/school.routers");
const classRouter = require("./routers/class.router");
const subjectRouter = require("./routers/subject.router");
const studentRouter = require("./routers/student.router");
const attendanceRouter = require("./routers/attendance.router");
const teacherRouter = require("./routers/teacher.router");
const scheduleRouter = require("./routers/schedule.router")
const examinationRouter = require("./routers/examination.router");
const noticeRouter = require("./routers/notice.router")
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const corsOption = { exposedHeaders: "Authorisation" }
app.use(cors(corsOption));
app.use(cookieParser());

//mongodb connection
// mongoose.connect(process.env.MONGO_URI, {})
//     .then(() => console.log(" MongoDB Atlas connected successfully"))
//     .catch((err) => console.log(" MongoDB connection error:", err)); // routers ap
const connectDB = async()=>{
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/scholahub");
         console.log(" Connected to local MongoDB successfully");
    } catch (error) {
        console.error(" MongoDB connection error:", error);
        process.exit(1);
    }
}

connectDB();

    //routers
app.use("/api/school", schoolRouter);
app.use("/api/class",classRouter);
app.use("/api/subject",subjectRouter);
app.use("/api/student",studentRouter);
 app.use("/api/teacher",teacherRouter);
 app.use("/api/schedule",scheduleRouter);
 app.use("/api/attendance",attendanceRouter);
 app.use("/api/examination",examinationRouter);
 app.use("/api/notice",noticeRouter)
const PORT = process.env.PORT;
app.listen(PORT, () => { console.log("Server is running at port => ", PORT); })




























