const model = require('../model/userModel');
const USER = model.User;
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const otp = require('otp-generator');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if the user already exists
    const findUser = await USER.findOne({ email: email });

    if (findUser) {
      return res.status(400).json({
        statusCode: 400,
        data: findUser,
        message: 'User already exists',
        success: false
      });
    }

    // Generate OTP
    const generatedOtp = await generateOtp();

    // Create a new user with generated OTP
    const user = await USER.create({ name, email, password, otp: generatedOtp });

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    // Send email verification
    await sendVerificationEmail(email, generatedOtp);

    return res.status(200).json({
      statusCode: 200,
      data: user,
      message: 'User created successfully',
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

async function sendVerificationEmail(email, otp) {
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
    subject: 'OTP For verification',
    text: `Verification Code to walk-in: ${otp}`
  };

  transport.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.error(error);
    } else {
      console.log('Email sent successfully');
    }
  });
}

async function generateOtp() {
  try {
    const generatedOtp = await otp.generate(6, { upperCaseAlphabets: false, specialChars: false, digits: true, lowerCaseAlphabets: false });
    return generatedOtp;
  } catch (error) {
    console.error(error.message);
    throw error;
  }
}

exports.verifyEmailAndGenerateToken = async (req, res) => {
  const { email, otp } = req.body;

  try {
    // Find the user by email and check if OTP matches
    const user = await USER.findOne({ email: email, otp: otp });

    if (!user) {
      return res.status(401).json({
        statusCode: 401,
        message: 'Invalid OTP',
        success: false
      });
    }

    // Update user document, set isEmailVerified to true
    user.isEmailVerified = true;
    user.otp = null; // Optional: clear the OTP field after verification
    await user.save();
    
    // Generate JWT token
    const generatedJWToken = await jwt.sign({ email: email }, 'shhhhh');

    return res.status(200).json({
      statusCode: 200,
      data: { token: generatedJWToken },
      message: 'Email verified successfully. Token generated.',
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
