const fs = require('fs');
const model = require('../model/teachersModel');
const Response = require('../response');
const Teacher = model.Teacher;
const multer = require('multer');

exports.createTeacher = async (req, res) => {
    const Storage = multer.diskStorage({
        destination: 'uploads',
        filename: (req, file, cb) => {
            cb(null, file.originalname);
        },
    });

    const upload = multer({
        storage: Storage
    }).single('image');

    upload(req, res, async (err) => {
        if (err) {
            console.log(err);
            return new Response(res, 500, "Internal Server Error", false, err.message);
        }

        try {
            const { firstName, lastName, email, gender, phoneNumber, bloodGroup, religion, classes, address, date, month, year } = req.body;

            if (!firstName || !lastName || !email || !phoneNumber || !date || !month || !year) {
                return new Response(res, 400, "All fields are required, including date of birth.", false);
            }

            const existingTeacher = await Teacher.findOne({ email: email });

            if (existingTeacher) {
                return new Response(res, 200, "Teacher Already Exists", false);
            }

            let image;
            if (req.file) {
                image = fs.readFileSync(req.file.path);
            }

            const DOB = new Date(year, month - 1, date);
            DOB.setHours(0, 0, 0, 0);

            const newTeacher = await Teacher.create({
                firstName,
                lastName,
                email,
                gender,
                phoneNumber,
                bloodGroup,
                religion,
                DOB,
                profilePic: {
                    data: image,
                    contentType: req.file.originalname
                }
            });

            if (classes) {
                newTeacher.classes.push(classes);
            }

            if (address) {
                newTeacher.address.push(address);
            }

            await newTeacher.save();

            return new Response(res, 200, "Teacher Added to Database", true, newTeacher);
        } catch (error) {
            console.log(error);
            return new Response(res, 500, "Internal Server Error", false, error.message);
        }
    });
};
exports.allTeachers = async (req,res)=>{
    try{
        const teachers = await Teacher.find().exec();
        return new Response(res, 200, "Teachers fetched Successfully", true, teachers);
    }
    catch (error) {
        console.log(error);
        return new Response(res, 500, "Internal Server Error", false, error.message);
    }
}