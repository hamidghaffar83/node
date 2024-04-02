const mongoose = require('mongoose');
const model = require('../model/studentModel');
const Response = require('../response');
const nodemailer = require('nodemailer');
const StudentModel = model.Student;

exports.allParents = async (req, res) => {
    try {
        const { firstName, lastName, fatherName, motherName, fatherOccupation, email, phoneNumber, religion, address } = req.body;
        const query = {};
        if (firstName) query.firstName = firstName;
        if (lastName) query.lastName = lastName;
        if (fatherName) query.fatherName = fatherName;
        if (motherName) query.motherName = motherName;
        if (fatherOccupation) query.fatherOccupation = fatherOccupation;
        if (email) query.email = email;
        if (phoneNumber) query.phoneNumber = phoneNumber;
        if (religion) query.religion = religion;
        if (address) query.address = address;

        const students = await StudentModel.find(query);

        const parents = students.map(student => ({
            parentsoF: student.firstName + ' ' + student.lastName,
            fatherName: student.fatherName,
            motherName: student.motherName,
            fatherOccupation: student.fatherOccupation,
            email: student.email,
            phoneNumber: student.phoneNumber,
            religion: student.religion,
            address: student.address
        }));

        return new Response(res, 200, "Parents fetched successfully", true, parents);
    } catch (error) {
        console.log(error);
        return new Response(res, 500, "Internal Server Error", false, error.message);
    }
}
exports.updateParent = async (req, res) => {
    try {
        

        // Find the parent by ID and update its details
        const updatedParent = await StudentModel.findOneAndUpdate(
            { _id: req.params.id },
            {firstName: req.body.firstName, lastName:req.body.lastName, motherName:req.body.motherName, fatherName:req.body.fatherName, email:req.body.email, fatherOccupation:req.body.fatherOccupation, address: req.body.address, phoneNumber:req.body.phoneNumber, religion:req.body.religion},
            { new: true }
        );

        if (!updatedParent) {
            return new Response(res, 404, "Parent not found", false, "No parent found with the provided ID");
        }

        return new Response(res, 200, "Parent updated successfully", true, updatedParent);
    } catch (error) {
        console.log(error);
        return new Response(res, 500, "Internal Server Error", false, error.message);
    }
}

exports.blockedParent = async (req, res) => {
    try {
        const { email } = req.params;
        console.log("EMAIL=> ", email)
        const blockedParent = await StudentModel.findOneAndUpdate(
            { email: email },
            { isStudentActive: false },
            { new: true }
        );

        if (!blockedParent) {
            return new Response(res, 404, "Parent not found", false, "No parent found with the provided email");
        }

        return new Response(res, 200, "Parent updated successfully", true, blockedParent);
    } catch (error) {
        console.log(error);
        return new Response(res, 500, "Internal Server Error", false, error.message);
    }
}
exports.deleteParent = async (req, res) => {
    try {
        const deleteParent = await StudentModel.findOneAndDelete({ _id: req.params.id });
        
        if (!deleteParent) {
            return new Response(res, 404, "Parent not found", false);
        }

        if (!deleteParent.isStudentActive) {
            return new Response(res, 403, "Parent not deleted because student is not active", false);
        }

        return new Response(res, 200, "Parent deleted successfully", true, deleteParent);
    } catch (error) {
        console.log(error);
        return new Response(res, 500, "Internal Server Error", false, error.message);
    }
}

exports.sendEmailToParent = async (req, res) => {
    try {
        const { email } = req.params;

        const emailToSingle = await StudentModel.findOne({ email: email });

        if (!emailToSingle) {
            return new Response(res, 404, "Parent not found", false);
        }

        if (!emailToSingle.isStudentActive) {
            return new Response(res, 403, "Email not sent to parent because student is not active", false);
        }

        await sendVerificationEmail(email, req.body.title, req.body.message);

        return res.status(200).json({
            statusCode: 200,
            message: 'Email sent to parent',
            success: true
        });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({
            statusCode: 500,
            message: 'Internal Server Error',
            success: false
        });
    }
};

async function sendVerificationEmail(email, title, message) {
    try {
        const transport = await nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: 'ghaffarhamid83@gmail.com',
                pass: 'xtnu okhk wrol qzrn'
            }
        });

        const mailOptions = {
            from: 'ghaffarhamid83@gmail.com',
            to: email,
            subject: title,
            text: message
        };

        await transport.sendMail(mailOptions);
        console.log('Email sent successfully');
    } catch (error) {
        console.error(error);
        throw new Error('Failed to send email');
    }
}

exports.sendEmailToActiveParents = async (req, res) => {
    try {
        const activeParents = await StudentModel.find({ isStudentActive: true });

        if (activeParents.length === 0) {
            return res.status(404).json({
                statusCode: 404,
                message: "No active parents found",
                success: false
            });
        }

        const emails = activeParents.map(parent => parent.email);

        await sendVerificationEmails(emails, req.body.title, req.body.message);

        return res.status(200).json({
            statusCode: 200,
            message: 'Emails sent to active parents',
            success: true
        });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({
            statusCode: 500,
            message: 'Internal Server Error',
            success: false
        });
    }
};
async function sendVerificationEmails(emails, title, message) {
    try {
        const transport = await nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: 'ghaffarhamid83@gmail.com',
                pass: 'xtnu okhk wrol qzrn'
            }
        });

        for (const email of emails) {
            const mailOptions = {
                from: 'ghaffarhamid83@gmail.com',
                to: email,
                subject: title,
                text: message
            };

            await transport.sendMail(mailOptions);
            console.log(`Email sent successfully to ${email}`);
        }
    } catch (error) {
        console.error(error);
        throw new Error('Failed to send emails');
    }
}