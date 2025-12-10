const Examination = require('../models/examination.models');

module.exports = {

    newExamination: async (req, res) => {
      //  console.log('called',req.body)
        try {
            const schoolId = req.user.schoolId;
            const {date, subjectId, examType, classId} = req.body;
            const newExamination = new Examination({
                school: schoolId,
                examDate: date,
                subject: subjectId,
                examType: examType,
                class: classId
            })
            const saveData = await newExamination.save();
            res.status(200).json({ success: true, message: "Success in creating new Examination.", data: saveData })
        } catch (error) {
            res.status(500).json({ success: false, message: "Error in creating new examination" })
        }
    },
    getAllExamination: async (req, res) => {
        try {
            const schoolId = req.user.schoolId;
            const examinations = await Examination.find({ school: schoolId });
            res.status(200).json({ success: true, examinations })
        } catch (error) {
            res.status(500).json({ success: false, message: "Error in Fetching Examinations." })
        }
    },
    getExaminationsByClass: async (req, res) => {
        try {
            const schoolId = req.user.schoolId;
            const classId = req.params.id;
            const examinations = await Examination.find({ class: classId, school: schoolId }).populate('subject');
            res.status(200).json({ success: true, examinations })
        } catch (error) {
            res.status(500).json({ success: false, message: "Error in Fetching Examinations." })
        }
    },
    updateExminationWithId: async (req, res) => {
        try {
            const schoolId = req.user.schoolId;
            const examinationId = req.params.id;
            const {date, subjectId, examType, classId}= req.body;
            await Examination.findOneAndUpdate({ _id: examinationId, school: schoolId }, {
                $set:
                {

                    examDate: date,
                    subject: subjectId,
                    examType: examType,

                }
            })
            res.status(200).json({ success: true, message: 'Examination is updated successsfully.' })
        } catch (error) {
            res.status(500).json({ success: false, message: "Error in Updating Examinations." })
        }
    },
    deleteExaminationWithId: async (req, res) => {
        try {
            const schoolId = req.user.schoolId;
            const examinationId = req.params.id;
            await Examination.findOneAndDelete({ _id: examinationId, school:schoolId })
            res.status(200).json({ success: true, message: 'Examination is deleted successsfully.' })
        } catch (error) {
            res.status(500).json({ success: false, message: "Error in Deleting Examinations." })
        }
    }
}