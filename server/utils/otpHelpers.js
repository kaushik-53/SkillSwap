const { Resend } = require('resend');
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
        if (!process.env.RESEND_API_KEY) {
            console.error('RESEND_API_KEY is missing');
            throw new Error('Email service configuration error');
        }

        const resend = new Resend(process.env.RESEND_API_KEY);

        const { data, error } = await resend.emails.send({
            from: 'SkillSwap <onboarding@resend.dev>', // Resend's default sender for unverified domains
            to: email,
            subject: 'SkillSwap - Your OTP for Verification',
            text: `Your OTP for SkillSwap verification is: ${otp}. It will expire in 5 minutes.`
        });

        if (error) {
            console.error('Resend API Error:', error);
            throw new Error('Failed to send email via Resend');
        }

        return data;
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
