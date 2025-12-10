require("dotenv").config();
const formidable = require("formidable");
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Teacher = require("../models/teacher.model");

module.exports = {

  // ---------------------------------------------------------
  // ✅ Register Teacher
  // ---------------------------------------------------------
  registerTeacher: async (req, res) => {
    try {
      const form = new formidable.IncomingForm();

      form.parse(req, async (err, fields, files) => {
        if (err) {
          return res.status(400).json({ success: false, message: "Form parse error" });
        }

        // Check existing email
        const existingTeacher = await Teacher.findOne({ email: fields.email?.[0] });
        if (existingTeacher) {
          return res.status(409).json({ success: false, message: "Email is already registered." });
        }

        // -----------------------
        // Handle profile image
        // -----------------------
        let imageName = null;

        if (files.teacher_image && files.teacher_image.length > 0) {
          const photo = files.teacher_image[0];
          const originalFilename = photo.originalFilename.replace(/\s+/g, "_");
          const newPath = path.join(__dirname, process.env.TEACHER_IMAGE_PATH, originalFilename);

          fs.writeFileSync(newPath, fs.readFileSync(photo.filepath));
          imageName = originalFilename;
        }

        // -----------------------
        // Password Hash
        // -----------------------
        const hashedPassword = bcrypt.hashSync(fields.password[0], 10);

        // -----------------------
        // Save Teacher
        // -----------------------
        const newTeacher = new Teacher({
          school: req.user.schoolId,
          email: fields.email[0],
          name: fields.name[0],
          qualification: fields.qualification[0],
          age: fields.age[0],
          gender: fields.gender[0],
          teacher_image: imageName,
          password: hashedPassword,
        });

        const savedTeacher = await newTeacher.save();

        res.status(200).json({
          success: true,
          message: "Teacher registered successfully",
          data: savedTeacher,
        });
      });

    } catch (error) {
      console.error("Register Error:", error);
      res.status(500).json({ success: false, message: "Teacher registration failed" });
    }
  },

  // ---------------------------------------------------------
  // ✅ Login Teacher
  // ---------------------------------------------------------
  loginTeacher: async (req, res) => {
    try {
      const teacher = await Teacher.findOne({ email: req.body.email });

      if (!teacher) {
        return res.status(401).json({ success: false, message: "Email is not registered." });
      }

      const isAuth = bcrypt.compareSync(req.body.password, teacher.password);

      if (!isAuth) {
        return res.status(401).json({ success: false, message: "Password is incorrect." });
      }

      const token = jwt.sign(
        {
          id: teacher._id,
          schoolId: teacher.school,
          name: teacher.name,
          image_url: teacher.teacher_image,
          role: "TEACHER",
        },
        process.env.JWT_SECRET
      );

      res.status(200).json({
        success: true,
        message: "Login successful",
        token,
        user: {
          id: teacher._id,
          schoolId: teacher.school,
          name: teacher.name,
          image_url: teacher.teacher_image,
          role: "TEACHER",
        }
      });

    } catch (error) {
      console.error("Login Error:", error);
      res.status(500).json({ success: false, message: "Internal server error [Teacher login]" });
    }
  },

  // ---------------------------------------------------------
  // ✅ Get teachers with query
  // ---------------------------------------------------------
  getTeachersWithQuery: async (req, res) => {
    try {
      if (!req.user?.schoolId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const filterQuery = {
        school: req.user.schoolId,
      };

      if (req.query.search) {
        filterQuery.name = { $regex: req.query.search, $options: "i" };
      }

      const teachers = await Teacher.find(filterQuery).select("-password");

      res.status(200).json({
        success: true,
        message: "Fetched all teachers successfully",
        teachers,
      });

    } catch (error) {
      console.error("Error fetching teachers:", error);
      res.status(500).json({ success: false, message: "Internal Server Error [Teachers]" });
    }
  },

  // ---------------------------------------------------------
  // ✅ Get teacher by ID
  // ---------------------------------------------------------
  getTeacherById: async (req, res) => {
    try {
      const teacher = await Teacher.findOne({
        _id: req.params.id,
        school: req.user.schoolId
      }).select("-password");

      if (!teacher) {
        return res.status(404).json({ success: false, message: "Teacher not found" });
      }

      res.status(200).json({ success: true, teacher });

    } catch (error) {
      res.status(500).json({ success: false, message: "Internal Server Error [Teacher by ID]" });
    }
  },
   getTeacherOwnData: async (req, res) => {
    try {
      const teacher = await Teacher.findOne({
        _id: req.user.id,
        school: req.user.schoolId,
      }).select(["-password"]);

      if (!teacher) {
        return res.status(404).json({ success: false, message: "Teacher not found" });
      }

      res.status(200).json({ success: true, teacher });
    } catch (error) {
      console.log("Teacher Own Data Error:", error);
      res.status(500).json({ success: false, message: "Failed to get teacher data" });
    }
  },

  // ---------------------------------------------------------
  // ✅ Update Teacher
  // ---------------------------------------------------------
  updateTeacher: async (req, res) => {
    try {
      const form = new formidable.IncomingForm();
      const teacherId = req.params.id;

      form.parse(req, async (err, fields, files) => {
        const teacher = await Teacher.findOne({
          _id: teacherId,
          school: req.user.schoolId,
        });

        if (!teacher) {
          return res.status(404).json({ success: false, message: "Teacher not found" });
        }

        // -----------------------
        // Handle new image upload
        // -----------------------
        let newImageName = teacher.teacher_image;

        if (files.teacher_image && files.teacher_image.length > 0) {
          const photo = files.teacher_image[0];
          const originalFilename = photo.originalFilename.replace(/\s+/g, "_");

          const newPath = path.join(__dirname, process.env.TEACHER_IMAGE_PATH, originalFilename);

          // delete old image
          if (teacher.teacher_image) {
            const oldPath = path.join(__dirname, process.env.TEACHER_IMAGE_PATH, teacher.teacher_image);
            if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
          }

          fs.writeFileSync(newPath, fs.readFileSync(photo.filepath));
          newImageName = originalFilename;
        }

        // Update fields
        Object.keys(fields).forEach(field => {
          teacher[field] = fields[field][0];
        });

        teacher.teacher_image = newImageName;

        // Update password
        if (fields.password) {
          teacher.password = bcrypt.hashSync(fields.password[0], 10);
        }

        await teacher.save();

        res.status(200).json({
          success: true,
          message: "Teacher updated successfully",
          teacher,
        });
      });

    } catch (error) {
      console.error("Update Teacher Error:", error);
      res.status(500).json({ success: false, message: "Teacher update failed" });
    }
  },

  // ---------------------------------------------------------
  // ✅ Delete Teacher
  // ---------------------------------------------------------
  deleteTeacherWithId: async (req, res) => {
    try {
      const teacher = await Teacher.findOneAndDelete({
        _id: req.params.id,
        school: req.user.schoolId,
      });

      if (!teacher) {
        return res.status(404).json({ success: false, message: "Teacher not found." });
      }

      const teachers = await Teacher.find({ school: req.user.schoolId });

      res.status(200).json({
        success: true,
        message: "Teacher deleted successfully",
        teachers,
      });

    } catch (error) {
      console.error("Delete Teacher Error:", error);
      res.status(500).json({ success: false, message: "Teacher deletion failed" });
    }
  },
};
