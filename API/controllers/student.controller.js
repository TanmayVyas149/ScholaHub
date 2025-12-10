
// require("dotenv").config();
// const formidable = require("formidable");
// const path = require("path");
// const fs = require("fs");
// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
// const Student = require("../models/student.model");

// module.exports = {
//   // ✅ Register new student
//   registerStudent: async (req, res) => {
//     try {
//       const form = new formidable.IncomingForm();
//       form.parse(req, async (err, fields, files) => {
//         if (err) return res.status(400).json({ success: false, message: "Form parse error" });

//         const existingStudent = await Student.findOne({ email: fields.email[0] });
//         if (existingStudent) {
//           return res.status(409).json({ success: false, message: "Email is already registered." });
//         }

//         // Handle profile image upload (optional)
//         let imageName = null;
//         if (files.image && files.image.length > 0) {
//           const photo = files.image[0];
//           const filepath = photo.filepath;
//           const originalFilename = photo.originalFilename.replace(/\s+/g, "_");
//           const newPath = path.join(__dirname, process.env.STUDENT_IMAGE_PATH, originalFilename);

//           const photoData = fs.readFileSync(filepath);
//           fs.writeFileSync(newPath, photoData);
//           imageName = originalFilename;
//         }

//         // Hash password
//         const salt = bcrypt.genSaltSync(10);
//         const hashedPassword = bcrypt.hashSync(fields.password[0], salt);

//         // Save student data
//         const newStudent = new Student({
//           school: req.user.schoolId,
//           email: fields.email[0],
//           name: fields.name[0],
//           student_class: fields.student_class[0],
//           age: fields.age[0],
//           gender: fields.gender[0],
//           guardian: fields.guardian[0],
//           guardian_phone: fields.guardian_phone[0],
//           password: hashedPassword,
//           student_image: imageName,
//         });

//         const savedStudent = await newStudent.save();
//         res.status(200).json({
//           success: true,
//           data: savedStudent,
//           message: "Student registered successfully",
//         });
//       });
//     } catch (error) {
//       console.error("Register Error:", error);
//       res.status(500).json({ success: false, message: "Student registration failed" });
//     }
//   },

//   // ✅ Login student
//   loginStudent: async (req, res) => {
//     try {
//       const student = await Student.findOne({ email: req.body.email });
//       if (!student) {
//         return res.status(401).json({ success: false, message: "Email is not registered." });
//       }

//       const isAuth = bcrypt.compareSync(req.body.password, student.password);
//       if (!isAuth) {
//         return res.status(401).json({ success: false, message: "Password is incorrect." });
//       }

//       const jwtSecret = process.env.JWT_SECRET;
//       const token = jwt.sign(
//         {
//           id: student._id,
//           schoolId: student.school,
//           name: student.name,
//           image_url: student.student_image,
//           role: "STUDENT",
//         },
//         jwtSecret
//       );

//       res.header("Authorization", token);
//       res.status(200).json({
//         success: true,
//         message: "Successful login.",
//         user: {
//           id: student._id,
//           schoolId: student.school,
//           name: student.name,
//           image_url: student.student_image,
//           role: "STUDENT",
//         },
//       });
//     } catch (error) {
//       console.error("Login Error:", error);
//       res.status(500).json({ success: false, message: "Internal server error [Student login]" });
//     }
//   },

//   // ✅ Get all students
//   // getStudentsWithQuery: async (req, res) => {
//   //   try {
//   //         console.log("🔍 Entered getStudentsWithQuery");
//   //   console.log("req.user =", req.user);
//   //   console.log("req.query =", req.query);

//   //     const filterQuery = { school: req.user.schoolId };

//   //     if (req.query.hasOwnProperty("search")) {
//   //       filterQuery["name"] = { $regex: req.query.search, $options: "i" };
//   //     }

//   //     if (req.query.hasOwnProperty("student_class")) {
//   //       filterQuery["student_class"] = req.query.student_class;
//   //     }

//   //     const students = await Student.find(filterQuery).select(["-password"]);
//   //     res.status(200).json({
//   //       success: true,
//   //       message: "Fetched all students successfully",
//   //       students,
//   //     });
//   //   } catch (error) {
//   //     console.error(error);
//   //     res.status(500).json({ success: false, message: "Internal Server Error [All STUDENTS]" });
//   //   }
//   // },
//   // ✅ Get all students (safe query handling)
//   getStudentsWithQuery: async (req, res) => {
//     try {
//       // console.log("✅ Entered getStudentsWithQuery");
//       // console.log("req.user =", req.user);
//       // console.log("req.query =", req.query);

//       // Make sure user is authenticated
//       if (!req.user || !req.user.schoolId) {
//         return res.status(401).json({
//           success: false,
//           message: "Unauthorized or missing schoolId",
//         });
//       }

//       // Start building query
//       const filterQuery = { school: req.user.schoolId };

//       // 🔍 Safe way to check for query keys
//       if ("search" in req.query && req.query.search) {
//         filterQuery["name"] = { $regex: req.query.search, $options: "i" };
//       }

//       if ("student_class" in req.query && req.query.student_class) {
//         //  console.log("Student class",req.query.student_class);
//         filterQuery["student_class"] = req.query.student_class;
//       }

//       // Fetch students
//       // const students = await Student.find(filterQuery).select(["-password"]);
//       const students = await Student.find(filterQuery)
//         .populate('student_class')
//         ;
//       // Return response
//       res.status(200).json({
//         success: true,
//         message: "Fetched all students successfully",
//         students,
//       });
//     } catch (error) {
//       console.error("🔥 Error in getStudentsWithQuery:", error);
//       res.status(500).json({
//         success: false,
//         message: "Internal Server Error [All STUDENTS]",
//         error: error.message,
//       });
//     }
//   },

//   // ✅ Get own student data
//   getStudentOwnData: async (req, res) => {
//     try {
//       const id = req.user.id;
//       const schoolId = req.user.schoolId;
//       const student = await Student.findOne({ _id: id, school: schoolId }).select(["-password"]);

//       if (student) {
//         res.status(200).json({ success: true, student });
//       } else {
//         res.status(404).json({ success: false, message: "Student not found" });
//       }
//     } catch (error) {
//       res.status(500).json({ success: false, message: "Internal Server Error [Own STUDENT data]" });
//     }
//   },

//   // ✅ Get student by ID
//   getStudentWithId: async (req, res) => {
//     try {
//       const id = req.params.id;
//       const schoolId = req.user.schoolId;
//       //const student = await Student.findOne({ _id: id, school: schoolId }).select(["-password"]);
//       const student = await Student.findOne({ _id: id, school: schoolId })
//         .populate("student_class")
//         .select(["-password"]);

//       if (student) {
//         res.status(200).json({ success: true, student });
//       } else {
//         res.status(404).json({ success: false, message: "Student not found" });
//       }
//     } catch (error) {
//       res.status(500).json({ success: false, message: "Internal Server Error [STUDENT by ID]" });
//     }
//   },
//   // ✅ Update Student (except password)
// // Update Student
// // updateStudent (replace your existing function)
// updateStudent: async (req, res) => {
//   try {
//     const studentId = req.params.id;
//     // Resolve upload directory from env or fallback to backend public
//     const envPath = process.env.STUDENT_IMAGE_PATH || "public/images/uploaded/student";
//     // If envPath is relative, resolve against process.cwd()
//     const uploadDir = path.isAbsolute(envPath) ? envPath : path.join(process.cwd(), envPath);

//     if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

//     const form = new formidable.IncomingForm({
//       uploadDir,       // store temp uploads in same dir (formidable will create filepath)
//       keepExtensions: true,
//       multiples: false,
//     });

//     form.parse(req, async (err, fields, files) => {
//       console.log("UPDATE STUDENT - FIELDS:", fields);
//       console.log("UPDATE STUDENT - FILES:", files);

//       if (err) {
//         console.error("Form parse error:", err);
//         return res.status(400).json({ success: false, message: "Form parse error", error: err.message });
//       }

//       // helper to normalize field values (formidable may give arrays)
//       const getVal = (v) => {
//         if (typeof v === "undefined" || v === null) return undefined;
//         return Array.isArray(v) ? v[0] : v;
//       };

//       // Build update object only for provided values
//       const possibleFields = ["name", "email", "student_class", "age", "gender", "guardian", "guardian_phone", "password"];
//       const updateData = {};
//       possibleFields.forEach(k => {
//         const val = getVal(fields[k]);
//         if (typeof val !== "undefined" && val !== "") {
//           updateData[k] = val;
//         }
//       });

//       // Hash password if provided
//       if (updateData.password) {
//         updateData.password = await bcrypt.hash(updateData.password, 10);
//       }

//       // find student and check school ownership (optional but safer)
//       const student = await Student.findById(studentId);
//       if (!student) {
//         return res.status(404).json({ success: false, message: "Student not found" });
//       }
//       // if you require school ownership:
//       if (req.user?.schoolId && student.school.toString() !== req.user.schoolId.toString()) {
//         return res.status(403).json({ success: false, message: "Forbidden - school mismatch" });
//       }

//       // Handle file if present (frontend should send key "image")
//       const fileObj = files.image ? (Array.isArray(files.image) ? files.image[0] : files.image) : null;
//       if (fileObj && (fileObj.originalFilename || fileObj.name)) {
//         // fileObj.filepath is the temporary file saved by formidable
//         const originalName = fileObj.originalFilename || fileObj.name || `img_${Date.now()}`;
//         const safeName = Date.now() + "_" + originalName.replace(/\s+/g, "_");
//         const finalPath = path.join(uploadDir, safeName);

//         try {
//           // move/rename temp file to final filename
//           if (fileObj.filepath && fs.existsSync(fileObj.filepath)) {
//             fs.renameSync(fileObj.filepath, finalPath);
//           } else if (fileObj.path && fs.existsSync(fileObj.path)) {
//             fs.renameSync(fileObj.path, finalPath);
//           } else {
//             // fallback: copy then unlink
//             fs.copyFileSync(fileObj.filepath || fileObj.path, finalPath);
//             if (fileObj.filepath && fs.existsSync(fileObj.filepath)) fs.unlinkSync(fileObj.filepath);
//           }
//         } catch (e) {
//           console.error("File move error:", e);
//           return res.status(500).json({ success: false, message: "File save failed", error: e.message });
//         }

//         // delete old image if exists
//         if (student.student_image) {
//           const oldPath = path.join(uploadDir, student.student_image);
//           if (fs.existsSync(oldPath)) {
//             try { fs.unlinkSync(oldPath); } catch (e) { console.warn("Could not delete old image:", e.message); }
//           }
//         }

//         updateData.student_image = safeName;
//       }

//       // Perform update only with provided fields
//       const updated = await Student.findByIdAndUpdate(studentId, updateData, { new: true }).populate("student_class");

//       if (!updated) {
//         return res.status(500).json({ success: false, message: "Update failed" });
//       }

//       return res.json({ success: true, message: "Student updated successfully", student: updated });
//     });
//   } catch (error) {
//     console.error("updateStudent catch:", error);
//     return res.status(500).json({ success: false, message: "Server error", error: error.message });
//   }
// },

  

//   // ✅ Delete student by ID
//   deleteStudentWithId: async (req, res) => {
//     try {
//       const id = req.params.id;
//       const schoolId = req.user.schoolId;
//       await Student.findOneAndDelete({ _id: id, school: schoolId });
//       const students = await Student.find({ school: schoolId });
//       res.status(200).json({ success: true, message: "Student deleted.", students });
//     } catch (error) {
//       console.error("Delete Error:", error);
//       res.status(500).json({ success: false, message: "Student deletion failed" });
//     }
//   },
// };
require("dotenv").config();
const formidable = require("formidable");
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Student = require("../models/student.model");

module.exports = {

  // ---------------------------------------------------------
  // ✅ Register Student
  // ---------------------------------------------------------
  registerStudent: async (req, res) => {
    try {
      const form = new formidable.IncomingForm();

      form.parse(req, async (err, fields, files) => {
        if (err) {
          return res.status(400).json({ success: false, message: "Form parse error" });
        }

        // Check existing email
        const existingStudent = await Student.findOne({ email: fields.email?.[0] });
        if (existingStudent) {
          return res.status(409).json({ success: false, message: "Email is already registered." });
        }

        // -----------------------
        // Handle student image
        // -----------------------
        let imageName = null;

        if (files.student_image && files.student_image.length > 0) {
          const photo = files.student_image[0];
          const originalFilename = photo.originalFilename.replace(/\s+/g, "_");
          const newPath = path.join(__dirname, process.env.STUDENT_IMAGE_PATH, originalFilename);

          fs.writeFileSync(newPath, fs.readFileSync(photo.filepath));
          imageName = originalFilename;
        }

        // -----------------------
        // Password Hash
        // -----------------------
        const hashedPassword = bcrypt.hashSync(fields.password[0], 10);

        // -----------------------
        // Save Student
        // -----------------------
        const newStudent = new Student({
          school: req.user.schoolId,
          email: fields.email[0],
          name: fields.name[0],
          student_class: fields.student_class[0],
          age: fields.age[0],
          gender: fields.gender[0],
          guardian: fields.guardian[0],
          guardian_phone: fields.guardian_phone[0],
          student_image: imageName,
          password: hashedPassword,
        });

        const savedStudent = await newStudent.save();

        res.status(200).json({
          success: true,
          message: "Student registered successfully",
          data: savedStudent,
        });
      });

    } catch (error) {
      console.error("Register Error:", error);
      res.status(500).json({ success: false, message: "Student registration failed" });
    }
  },

  // ---------------------------------------------------------
  // ✅ Login Student
  // ---------------------------------------------------------
  loginStudent: async (req, res) => {
    try {
      const student = await Student.findOne({ email: req.body.email });

      if (!student) {
        return res.status(401).json({ success: false, message: "Email is not registered." });
      }

      const isAuth = bcrypt.compareSync(req.body.password, student.password);

      if (!isAuth) {
        return res.status(401).json({ success: false, message: "Password is incorrect." });
      }

      const token = jwt.sign(
        {
          id: student._id,
          schoolId: student.school,
          name: student.name,
          image_url: student.student_image,
          role: "STUDENT",
        },
        process.env.JWT_SECRET
      );

      res.status(200).json({
        success: true,
        message: "Login successful",
        token,
        user: {
          id: student._id,
          schoolId: student.school,
          name: student.name,
          image_url: student.student_image,
          role: "STUDENT",
        }
      });

    } catch (error) {
      console.error("Login Error:", error);
      res.status(500).json({ success: false, message: "Internal server error [Student login]" });
    }
  },

  // ---------------------------------------------------------
  // ✅ Get Students with query
  // ---------------------------------------------------------
  getStudentsWithQuery: async (req, res) => {
    try {
      if (!req.user?.schoolId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const filterQuery = { school: req.user.schoolId };

      if (req.query.search) {
        filterQuery.name = { $regex: req.query.search, $options: "i" };
      }

      if (req.query.student_class) {
        filterQuery.student_class = req.query.student_class;
      }

      const students = await Student.find(filterQuery)
        .populate("student_class") // populate class info
        .select("-password");

      res.status(200).json({
        success: true,
        message: "Fetched all students successfully",
        students,
      });

    } catch (error) {
      console.error("Error fetching students:", error);
      res.status(500).json({ success: false, message: "Internal Server Error [Students]" });
    }
  },

  // ---------------------------------------------------------
  // ✅ Get Student by ID
  // ---------------------------------------------------------
  getStudentWithId: async (req, res) => {
    try {
      const student = await Student.findOne({
        _id: req.params.id,
        school: req.user.schoolId
      }).populate("student_class").select("-password");

      if (!student) {
        return res.status(404).json({ success: false, message: "Student not found" });
      }

      res.status(200).json({ success: true, student });

    } catch (error) {
      res.status(500).json({ success: false, message: "Internal Server Error [Student by ID]" });
    }
  },

  // ---------------------------------------------------------
  // ✅ Update Student
  // ---------------------------------------------------------
  updateStudent: async (req, res) => {
    try {
      const form = new formidable.IncomingForm();
      const studentId = req.params.id;

      form.parse(req, async (err, fields, files) => {
        const student = await Student.findOne({
          _id: studentId,
          school: req.user.schoolId,
        });

        if (!student) {
          return res.status(404).json({ success: false, message: "Student not found" });
        }

        // -----------------------
        // Handle new image upload
        // -----------------------
        let newImageName = student.student_image;

        if (files.student_image && files.student_image.length > 0) {
          const photo = files.student_image[0];
          const originalFilename = photo.originalFilename.replace(/\s+/g, "_");

          const newPath = path.join(__dirname, process.env.STUDENT_IMAGE_PATH, originalFilename);

          // delete old image
          if (student.student_image) {
            const oldPath = path.join(__dirname, process.env.STUDENT_IMAGE_PATH, student.student_image);
            if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
          }

          fs.writeFileSync(newPath, fs.readFileSync(photo.filepath));
          newImageName = originalFilename;
        }

        // Update fields
        Object.keys(fields).forEach(field => {
          student[field] = fields[field][0];
        });

        student.student_image = newImageName;

        // Update password if provided
        if (fields.password) {
          student.password = bcrypt.hashSync(fields.password[0], 10);
        }

        await student.save();

        res.status(200).json({
          success: true,
          message: "Student updated successfully",
          student,
        });
      });

    } catch (error) {
      console.error("Update Student Error:", error);
      res.status(500).json({ success: false, message: "Student update failed" });
    }
  },

  // ---------------------------------------------------------
  // ✅ Delete Student
  // ---------------------------------------------------------
  deleteStudentWithId: async (req, res) => {
    try {
      const student = await Student.findOneAndDelete({
        _id: req.params.id,
        school: req.user.schoolId,
      });

      if (!student) {
        return res.status(404).json({ success: false, message: "Student not found." });
      }

      const students = await Student.find({ school: req.user.schoolId }).populate("student_class");

      res.status(200).json({
        success: true,
        message: "Student deleted successfully",
        students,
      });

    } catch (error) {
      console.error("Delete Student Error:", error);
      res.status(500).json({ success: false, message: "Student deletion failed" });
    }
  },
  // ---------------------------------------------------------
// ✅ Get logged-in student's own data
// ---------------------------------------------------------
 getStudentOwnData : async (req, res) => {
  try {
    if (!req.user?.id || !req.user?.role || req.user.role !== "STUDENT") {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const student = await Student.findOne({
      _id: req.user.id
    }).populate("student_class") // populate class info
      .select("-password"); // hide password

    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    res.status(200).json({
      success: true,
      student
    });
  } catch (error) {
    console.error("getStudentOwnData Error:", error);
    res.status(500).json({ success: false, message: "Failed to get student data" });
  }
},
};

