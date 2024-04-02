const fs = require('fs');
const model = require('../model/studentModel');
const Response = require('../response');
const Student = model.Student;
const multer = require('multer');

exports.createStudent =  async (req, res) => {
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
            const { firstName, lastName, email,motherName, fatherName, fatherOccupation, gender, phoneNumber, bloodGroup, religion, classes, address, date, month, year } = req.body;

            if (!firstName || !lastName || !email || !phoneNumber || !date || !month || !year) {
                return new Response(res, 400, "All fields are required, including date of birth.", false);
            }

            const existingStudent = await Student.findOne({ email: email });

            if (existingStudent) {
                return new Response(res, 200, "Student Already Exists", false);
            }

            let image;
            if (req.file) {
                image = fs.readFileSync(req.file.path);
            }

            const DOB = new Date(year, month - 1, date);
            DOB.setHours(0, 0, 0, 0);

            const newStudent = await Student.create({
                firstName,
                lastName,
                email,
                fatherName,
                motherName,
                fatherOccupation,
                gender,
                phoneNumber,
                bloodGroup,
                religion,
                DOB,
                classes,
                profilePic: {
                    data: image,
                    contentType: req.file.originalname
                }
            });


            if (address) {
                newStudent.address.push(address);
            }

            await newStudent.save();

            return new Response(res, 200, "Student Added to Database", true, newStudent);
        } catch (error) {
            console.log(error);
            return new Response(res, 500, "Internal Server Error", false, error.message);
        }
    });
};
exports.allStudents = async (req,res)=>{
    try{
        const students = await Student.find().exec();
        return new Response(res, 200, "Students fetched Successfully", true, students);
    }
    catch (error) {
        console.log(error);
        return new Response(res, 500, "Internal Server Error", false, error.message);
    }
}