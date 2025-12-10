const Subject = require('../models/subject.model');
const Student = require('../models/student.model');
const Exam = require('../models/examination.models');
const Schedule = require('../models/schedule.model');
module.exports = {
    getAllSubjects: async (req, res) => {
        try {
            const schoolId = req.user.id;
            const allSubjects = await Subject.find({ school: schoolId });
            res.status(200).json({ success: true, message: "Success i fetching all subjects", data: allSubjects })
        } catch (error) {
            console.log("getting all Subjects error", error);
            res.status(500).json({ sucess: false, message: "Server error in getting class ." });
        }
    },
    createSubject: async (req, res) => {

        try {

            const newSubject = new Subject({
                school: req.user.id,
                subject_name: req.body.subject_name,
                subject_code: req.body.subject_code
            })

            await newSubject.save();
            res.status(200).json({ success: true, message: "Successfully created the subject ." });

        } catch (err) {
            res.status(500).json({ sucess: false, message: "Server error in creating subject ." });
        }
    },
    updateSubjectWithId: async (req, res) => {
        try {
            let id = req.params.id;
            await Subject.findOneAndUpdate({ _id: id }, { $set: { ...req.body } });
            const subjectAfterUpdate = await Subject.findOne({ _id: id });
            res.status(200).json({ success: true, message: "Subject updated.", data: subjectAfterUpdate });
        } catch (error) {
            console.log("update subject Error", error);
            res.status(500).json({ sucess: false, message: "Server error in updating subject ." });
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
    deleteSubjectWithId: async (req, res) => {
        try {
            let id = req.params.id;
            let schoolId = req.user.id;

            const subjectExamCount = await Exam.countDocuments({ subject: id, school: schoolId });
            const subjectScheduleCount = await Schedule.countDocuments({ subject: id, school: schoolId });

            if (subjectExamCount === 0 && subjectScheduleCount === 0) {
                const deletedSubject = await Subject.findOneAndDelete({ _id: id, school: schoolId });
                if (!deletedSubject) {
                    return res.status(404).json({ success: false, message: "Subject not found" });
                }
                return res.status(200).json({ success: true, message: "Subject deleted successfully" });
            } else {
                return res.status(400).json({ success: false, message: "This Subject is already in use" });
            }

        } catch (error) {
            console.log("Deleting Subject Error", error);
            return res.status(500).json({ success: false, message: "Server error in deleting Subject." });
        }
    }

}