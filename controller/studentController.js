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
            const { firstName, lastName, email,motherName, fatherName, fatherOccupation, gender, phoneNumber, bloodGroup, religion, classes, address, date, month, year,amount } = req.body;

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
                amount,
                profilePic: {
                    data: image,
                    contentType: req.file.originalname
                }
            });


            if (address) {
                newStudent.address.push(address);
            }
            if(classes){
                newStudent.classes.push(classes)
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
exports.StudentFees = async (req, res)=>{
    const { email } = req.params;
const { amount } = req.body;

try {
    let updateQuery = {};

    if (amount === 2000) {
        updateQuery = { isPaid: true,amount:req.body.amount};
    }

    const studentFee = await Student.findOneAndUpdate(
        { email: email },
        updateQuery,
        { new: true }
    );

    if (!studentFee) {
        return new Response(res, 404, "Student not found", false);
    }

    const updatedStudent = await Student.findOne({ email: email });

    return new Response(res, 200, "Student's fee updated successfully", true, updatedStudent);
} catch (error) {
    console.log(error);
    return new Response(res, 500, "Internal Server Error", false, error.message);
}
}

exports.findAllStudents = async (req, res) => {
    try {
        const { page, limit, search, className, isPaid } = req.query;
        const skip = (Number(page) - 1) * Number(limit);
        const filters = {};

        if (search) {
            filters['firstName'] = { $regex: new RegExp(search, 'i') };
        }

        if (className) {
            filters['class'] = { $regex: new RegExp(className, 'i') };
        }
        if (isPaid !== undefined) {
            filters['isPaid'] = isPaid; 
        }

        const students = await Student.find(filters)
                                      .sort({ createdAt: -1 })
                                      .skip(skip)
                                      .limit(limit);

        if (!students || students.length === 0) {
            return new Response(res, 200, "No record", false);
        }
        
        return new Response(res, 200, "Data Retrieved", true, students);
    } catch (error) {
        return new Response(res, 500, "Internal Server Error", false, error.message);
    }
}
