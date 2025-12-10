// const Attendance = require("../models/attendance.model") ;
// const moment = require("moment");
// module.exports  = {
//     markAttendance: async(req,res)=>{
//         try {
//         const {studentId, date, status, classId}= req.body;
//         const schoolId = req.user.schoolId;
//         const newAttendance = new Attendance({
//             student: studentId,
//             date,
//             status,
//             class:classId,
//             school:schoolId
//         })
//         await new Attendance.save();
//         res.status(201).json(newAttendance)
//         } catch (error) {
//             res.status(500).json({success:false, message: "Error in marking attendance"})
//         }
//     },
//     getAttendance: async(req,res)=>{
       
//         try {
//              const {studentId} = req.params;
//              const attendance = await Attendance.find({student:studentId}).populate('student');
//              res.status(200).json(attendance)

//         } catch (error) {
//             res.status(500).json({success:false, message:"Error in getting attendance"})
//         }
//     },
//     checkAttendance: async(req,res)=>{
//        const {classId} = req.params;
//         try {
//             const today = moment().startOf('day')
//             const attendanceForToday = await Attendance.findOne({
//                 class:req.params.classId,
//                 date:{
//                     $gte:today.toDate(),
//                     $lt : moment(today).endOf('day').toDate()
//                 }
//             })
//             if(attendanceForToday){
//                 return res.status(200).json({attendanceTaken:true, message:"Attendance already taken"})
//             }else{
//                 return res.status(200).json({attendanceTaken:false, message:"No attendance taken yet for today"})
//             }
//         } catch (error) {
//                 res.status(500).json({success:false, message:"Error in checking attendance"})
//         }
//     }
// }
const Attendance = require("../models/attendance.model");
const moment = require("moment");

module.exports = {
    markAttendance: async (req, res) => {
        try {
            const { studentId, date, status, classId } = req.body;
            const schoolId = req.user.schoolId;

            const newAttendance = new Attendance({
                student: studentId,
                date,
                status,
                class: classId,
                school: schoolId
            });

            await newAttendance.save();   // FIXED

            return res.status(201).json(newAttendance);

        } catch (error) {
            console.error("Mark Attendance Error:", error);   // Log for debugging
            return res.status(500).json({ success: false, message: "Error in marking attendance" });
        }
    },

    getAttendance: async (req, res) => {
        try {
            const { studentId } = req.params;

            const attendance = await Attendance.find({ student: studentId })
                .populate("student");

            return res.status(200).json(attendance);

        } catch (error) {
            console.error("Get Attendance Error:", error);
            return res.status(500).json({ success: false, message: "Error in getting attendance" });
        }
    },

    checkAttendance: async (req, res) => {
        try {
            const { classId } = req.params;

            const today = moment().startOf("day");

            const attendanceForToday = await Attendance.findOne({
                class: classId,
                date: {
                    $gte: today.toDate(),
                    $lt: moment(today).endOf("day").toDate()
                }
            });

            if (attendanceForToday) {
                return res.status(200).json({
                    attendanceTaken: true,
                    message: "Attendance already taken"
                });
            }

            return res.status(200).json({
                attendanceTaken: false,
                message: "No attendance taken yet for today"
            });

        } catch (error) {
            console.error("Check Attendance Error:", error);
            return res.status(500).json({ success: false, message: "Error in checking attendance" });
        }
    }
};
