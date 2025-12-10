const Subject = require('../models/subject.model');
const Student = require('../models/student.model');
const Exam = require('../models/examination.models');
const Schedule = require('../models/schedule.model');

module.exports = {
    // getScheduleWithClass: async (req, res) => {
    //     //console.log(req.params.id)
    //     try {
    //         const classId = req.params.id;
    //         const schoolId = req.user.id;
    //         const schedules = await Schedule.find({ school: schoolId, class:classId}).populate(['teacher','subject']);
    //         res.status(200).json({ success: true, message: "Success i fetching all schedules", data: schedules })
    //     } catch (error) {
    //         console.log("Get Schedule with class error", error);
    //         res.status(500).json({ sucess: false, message: "Server error in getting schedule ." });
    //     }
    // },
    getScheduleWithClass: async (req, res) => {
    try {
        const classId = req.params.id;
        const schoolId = req.user.schoolId; // ← use schoolId, not id
        const schedules = await Schedule.find({ school: schoolId, class: classId })
            .populate({ path: 'teacher', select: 'name' })
            .populate({ path: 'subject', select: 'name' });

        res.status(200).json({ success: true, message: "Fetched schedules successfully", data: schedules });
    } catch (error) {
        console.log("Get Schedule with class error", error);
        res.status(500).json({ success: false, message: "Server error in getting schedule." });
    }
},

    createSchedule: async (req, res) => {

        try {

            const newSchedule = new Schedule({
                school: req.user.schoolId,
                teacher:req.body.teacher,
                subject:req.body.subject,
                class:req.body.selectedClass,
                startTime:req.body.startTime,
                endTime:req.body.endTime
            })

            await newSchedule.save();
            res.status(200).json({ success: true, message: "Successfully created the schedule ." });

        } catch (err) {
            res.status(500).json({ sucess: false, message: "Server error in creating schedule ." });
        }
    },
    getScheduleWithId: async (req, res) => {
        //console.log(req.params.id)
        try {
            const id = req.params.id;
            const schoolId = req.user.id;
            const schedule = (await Schedule.find({ school: schoolId, _id:id}))[0];
            res.status(200).json({ success: true, message: "Success i fetching all schedules", data: schedule })
        } catch (error) {
            console.log("Get Schedule with class error", error);
            res.status(500).json({ sucess: false, message: "Server error in getting schedule ." });
        }
    },
    updateScheduleWithId: async (req, res) => {
        try {
            let id = req.params.id;
            await Schedule.findOneAndUpdate({ _id: id }, { $set: { ...req.body } });
            const scheduleAfterUpdate = await Schedule.findOne({ _id: id });
            res.status(200).json({ success: true, message: "Schedule updated.", data: scheduleAfterUpdate });
        } catch (error) {
            console.log("update schedule Error", error);
            res.status(500).json({ sucess: false, message: "Server error in updating schedule ." });
        }
    },
    // deleteClassWithId: async (req, res) => {
    //     try {
    //         let id = req.params.id;
    //         let schoolId = req.user.schoolIdl;

    //         const classStudentCount = (await Student.find({ student_class: id, school: schoolId })).length;
    //         const classExamCount = (await Exam.find({ class: id, school: schoolId })).length;
    //         const classScheduleCount = (await Schedule.find({ class: id, school: schoolId })).length;
    //         await Class.findOneAndDelete({ _id: id, school: schoolId })
    //         res.status(200).json({ success: true, message: "Class Deleted Successfully" })

    //         if ((classStudentCount === 0) && (classExamCount === 0) && (classScheduleCount === 0)) {
    //             await Class.findOneAndDelete({ _id: id, school: schoolId })
    //             res.status(200).json({ sucess: true, message: "Class deleted successfully" });
    //         } else {
    //             res.status(500).json({ sucess: true, message: "This Class is already in use" });
    //         }

    //     } catch (error) {
    //         console.log("Deleting class Error", error);
    //         res.status(500).json({ sucess: false, message: "Server error in updating class ." });
    //     }
    // }
    deleteScheduleWithId: async (req, res) => {
        try {
            let id = req.params.id;
            let schoolId = req.user.id;
                      
                await Schedule.findOneAndDelete({ _id: id, school: schoolId });
               
                return res.status(200).json({ success: true, message: "Schedule deleted successfully" });
           

        } catch (error) {
            console.log("Deleting Schedule Error", error);
            return res.status(500).json({ success: false, message: "Server error in deleting Schedule." });
        }
    }

}