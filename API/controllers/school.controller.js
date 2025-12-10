//CRUD application
//authentication- school,student,and teacher
require("dotenv").config();
const formidable = require('formidable');
const path = require("path");
const fs = require("fs");
const School = require("../models/school.model");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
module.exports = {
    //register new school
    registerSchool: async (req, res) => {
        try {
            const form = new formidable.IncomingForm();
            form.parse(req, async (err, fields, files) => {
                const school = await School.findOne({email:fields.email[0]});
                if(school){
                    return res.status(409).json({success:false, message:"Email is already registered."});
                }else {
                const photo = files.image[0];
                let filepath = photo.filepath;
                let originalFilename = photo.originalFilename.replace(" ", "_");
                let newPath = path.join(__dirname, process.env.SCHOOL_IMAGE_PATH, originalFilename);

                let photoData = fs.readFileSync(filepath);
                fs.writeFileSync(newPath, photoData);

                const salt = bcrypt.genSaltSync(10);
                const hashPassword = bcrypt.hashSync(fields.password[0], salt);

                const newSchool = new School({
                    school_name: fields.school_name[0],
                    email: fields.email[0],
                    owner_name: fields.owner_name[0],
                    school_image:originalFilename,
                    password: hashPassword
                })
                const savedSchool = await newSchool.save();
                res.status(200).json({ success: true, data: savedSchool, message: "School is registered successfully" }) }
                
            })
        } catch (error) {
            res.status(500).json({ success: false, message: "School registration failed" })
        }
    },
    // login exsting school
  loginSchool: async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Login attempt:", email);

    const school = await School.findOne({ email });
    if (!school) {
      console.log(" Email not registered");
      return res.status(401).json({ success: false, message: "Email is not registered" });
    }

    const isAuth = bcrypt.compareSync(password, school.password);
    if (!isAuth) {
      console.log(" Incorrect password for:", email);
      return res.status(401).json({ success: false, message: "Password is Incorrect" });
    }

    //  Generate JWT token
    const token = jwt.sign(
      { id: school._id, schoolId: school._id,  role: "SCHOOL" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: school._id,
        owner_name: school.owner_name,
        school_name: school.school_name,
        image_url: school.school_image,
        role: "SCHOOL",
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Internal Server error [SCHOOL login]" });
  }
},
    //get data of all registered school
    getAllSchools: async (req, res) => {
        try {
            const schools = await School.find().select(["-password", "-id", "-email", "-owner_name", "-createdAt"]);
            res.status(200).json({ sucess: true, message: "Success in fetching all schools.", schools });
        } catch (error) {
            res.status(401).json({ success: false, message: "Internal Server error [SCHOOL data]" });
        }
    },
    // get data of single school using its id
getSchoolOwnData: async (req, res) => {
    try {
        const id = req.user.id;
const school = await School.findOne({ _id: id }).select("-password");
        
        if (school) {
            return res.status(200).json({ success: true, school });
        } else {
            return res.status(404).json({ success: false, message: "School not found" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal Server Error [Own SCHOOL data]" });
    }
},

   //update existing registered school
    updateSchool: async (req, res) => {
  try {
    const id = req.user.id;
    const form = new formidable.IncomingForm();

    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(400).json({ success: false, message: "Invalid form data" });
      }

      const school = await School.findById(id);
      if (!school) {
        return res.status(404).json({ success: false, message: "School not found" });
      }

      //  If new image uploaded
      if (files.image) {
        const photo = files.image[0];
        const filepath = photo.filepath;
        const originalFilename = photo.originalFilename.replace(/\s+/g, "_");

        // Delete old image if exists
        if (school.school_image) {
          const oldImagepath = path.join(__dirname, process.env.SCHOOL_IMAGE_PATH, school.school_image);
          if (fs.existsSync(oldImagepath)) {
            fs.unlink(oldImagepath, (err) => {
              if (err) console.log("Error deleting old image:", err);
            });
          }
        }

        // Save new image
        const newPath = path.join(__dirname, process.env.SCHOOL_IMAGE_PATH, originalFilename);
        const photoData = fs.readFileSync(filepath);
        fs.writeFileSync(newPath, photoData);

        // ✅ Update image name
        school.school_image = originalFilename;
      }

      // ✅ Update other fields
      if (fields.school_name) school.school_name = fields.school_name[0];

      await school.save();
      return res.status(200).json({
        success: true,
        message: "School updated successfully",
        school,
      });
    });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ success: false, message: "School update failed" });
  }
}

}