const Class = require('../models/class.model');
const Student = require('../models/student.model');
const Exam = require('../models/examination.models');
const Schedule = require('../models/schedule.model');
module.exports = {
    getAllClasses: async (req, res) => {
        try {
            const schoolId = req.user.schoolId;
            const allClasses = await Class.find({school:schoolId});
            res.status(200).json({success:true, message:"Success i fetching all classes",data:allClasses})
        } catch (error) {
            console.log("GetAllClasses error",error);
             res.status(500).json({ sucess: false, message: "Server error in getting class ." });
        }
    },
    createClass: async (req, res) => {
        try {

            const newClass = new Class({
                school: req.user.schoolId,
                class_text: req.body.class_text,
                class_num: req.body.class_num
            })

            await newClass.save();
            res.status(200).json({ success: true, message: "Successfully created the Class ." });

        } catch (err) {
            res.status(500).json({ sucess: false, message: "Server error in creating class ." });
        }
    },
    updateClassWithId: async (req, res) => {
        try {
            let id = req.params.id;
            await Class.findOneAndUpdate({ _id: id }, { $set: { ...req.body } });
            const classAfterUpdate = await Class.findOne({ _id: id });
            res.status(200).json({ success: true, message: "Class updated.", data: classAfterUpdate });
        } catch (error) {
            console.log("update class Error", error);
            res.status(500).json({ sucess: false, message: "Server error in updating class ." });
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
    deleteClassWithId: async (req, res) => {
    try {
        let id = req.params.id;
        let schoolId = req.user.schoolIdl;

        const classStudentCount = await Student.countDocuments({ student_class: id, school: schoolId });
        const classExamCount = await Exam.countDocuments({ class: id, school: schoolId });
        const classScheduleCount = await Schedule.countDocuments({ class: id, school: schoolId });

        if (classStudentCount === 0 && classExamCount === 0 && classScheduleCount === 0) {
            const deletedClass = await Class.findOneAndDelete({ _id: id, school: schoolId });
            if (!deletedClass) {
                return res.status(404).json({ success: false, message: "Class not found" });
            }
            return res.status(200).json({ success: true, message: "Class deleted successfully" });
        } else {
            return res.status(400).json({ success: false, message: "This Class is already in use" });
        }

    } catch (error) {
        console.log("Deleting class Error", error);
        return res.status(500).json({ success: false, message: "Server error in deleting class." });
    }
},
getSingleClass: async(req,res)=>{
     try {
            const schoolId = req.user.schoolId;
            const classId = req.params.id;
            const allClasses = await Class.findOne({school:schoolId, _id:classId}).populate('attendee');
            res.status(200).json({success:true, message:"Success i fetching all  single class",data:allClasses})
        } catch (error) {
            console.log("GetAllClasses error",error);
             res.status(500).json({ sucess: false, message: "Server error in getting single class ." });
        }
},
// getAttendeeClass: async(req,res)=>{
//      try {
//             const schoolId = req.user.schoolId;
//             // const attendeeId = req.user.id;
//                 const attendeeId = mongoose.Types.ObjectId(req.user.id); 
//              //const classes = await Class.find({school:schoolId, attendee:attendeeId});
//             const classes = await Class.find({
//     school: schoolId,
//     attendee: { $in: [attendeeId] }
// });

//             res.status(200).json({success:true, message:"Success in fetching attendee class",data:classes})
//         } catch (error) {
//             console.log("Get Attendee classes error",error);
//              res.status(500).json({ sucess: false, message: "Server error in getting Attendee class ." });
//         }
// }
getAttendeeClass: async (req, res) => {
    try {
        const schoolId = req.user.schoolId;
        const attendeeId = mongoose.Types.ObjectId(req.user.id);

        const classes = await Class.find({
            school: schoolId,
            attendee: { $in: [attendeeId] }   // FIXED
        });

        res.status(200).json({
            success: true,
            message: "Success in fetching attendee class",
            data: classes
        });

    } catch (error) {
        console.log("Get Attendee classes error", error);
        res.status(500).json({
            success: false,
            message: "Server error in getting Attendee class."
        });
    }
}


}