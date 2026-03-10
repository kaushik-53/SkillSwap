const nodemailer = require('nodemailer');
const otpGenerator = require('otp-generator');
const bcrypt = require('bcryptjs');

const generateOtp = () => {
    return otpGenerator.generate(6, { 
        upperCaseAlphabets: false, 
        specialChars: false, 
        lowerCaseAlphabets: false 
    });
};

const sendEmailOtp = async (email, otp) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'SkillSwap - Your OTP for Verification',
            text: `Your OTP for SkillSwap verification is: ${otp}. It will expire in 5 minutes.`
        };

        return await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error sending email OTP:', error);
        throw new Error('Failed to send email OTP');
    }
};

const hashOtp = async (otp) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(otp, salt);
};

module.exports = {
    generateOtp,
    sendEmailOtp,
    hashOtp
};
