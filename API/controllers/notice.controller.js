const Notice = require('../models/notice.model');

module.exports = {

   
    getAllNotices: async (req, res) => {
        try {
            const schoolId = req.user.schoolId;
            const allNotices = await Notice.find({ school: schoolId }).sort({ createdAt: -1 });

            return res.status(200).json({
                success: true,
                message: "Successfully fetched all notices",
                data: allNotices
            });

        } catch (error) {
            console.log("getAllNotices Error:", error);
            return res.status(500).json({
                success: false,
                message: "Server error in getting notices."
            });
        }
    },
     getTeacherNotices: async (req, res) => {
        try {
            const schoolId = req.user.schoolId;
            const allNotices = await Notice.find({ school: schoolId, audience:'teacher' });

            return res.status(200).json({
                success: true,
                message: "Successfully fetched all notices",
                data: allNotices
            });

        } catch (error) {
            console.log("getAllNotices Error:", error);
            return res.status(500).json({
                success: false,
                message: "Server error in getting notices."
            });
        }
    },
 getStudentNotices: async (req, res) => {
        try {
            const schoolId = req.user.schoolId;
            const allNotices = await Notice.find({ school: schoolId, audience:'student' });

            return res.status(200).json({
                success: true,
                message: "Successfully fetched all notices",
                data: allNotices
            });

        } catch (error) {
            console.log("getAllNotices Error:", error);
            return res.status(500).json({
                success: false,
                message: "Server error in getting notices."
            });
        }
    },

    
    createNotice: async (req, res) => {
        try {
            const {title, message, audience} = req.body;

            const newNotice = new Notice({
                school: req.user.schoolId,
                title: title,
                message: message,
                audience: audience,   
               
            });

            await newNotice.save();

            return res.status(200).json({
                success: true,
                message: "Notice created successfully.",
                
            });

        } catch (error) {
            console.log("createNotice Error:", error);
            return res.status(500).json({
                success: false,
                message: "Server error in creating notice."
            });
        }
    },

   
    updateNoticeWithId: async (req, res) => {
        try {
            let id = req.params.id;
            

            await Notice.findOneAndUpdate(
                { _id: id},
                { $set: { ...req.body } }
            );

            const updatedNotice = await Notice.findOne({ _id: id });

             res.status(200).json({
                success: true,
                message: "Notice updated successfully.",
                data: updatedNotice
            });

        } catch (error) {
            console.log("updateNotice Error:", error);
            return res.status(500).json({
                success: false,
                message: "Server error in updating notice."
            });
        }
    },

   
    deleteNoticeWithId: async (req, res) => {
        try {
            let id = req.params.id;
            let schoolId = req.user.schoolId;

             await Notice.findOneAndDelete({
                _id: id,
                school: schoolId
            });

            // if (!deletedNotice) {
            //     return res.status(404).json({
            //         success: false,
            //         message: "Notice not found."
            //     });
            // }

             res.status(200).json({
                success: true,
                message: "Notice deleted successfully"
            });

        } catch (error) {
            console.log("delete Notice Error:", error);
             res.status(500).json({
                success: false,
                message: "Server error in deleting notice."
            });
        }
    }

};
