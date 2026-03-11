require('dotenv').config();
const nodemailer = require('nodemailer');

async function testEmail() {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        console.log(`Testing with user: ${process.env.EMAIL_USER}`);
        // Log pass with mask
        const pass = process.env.EMAIL_PASS || '';
        console.log(`Testing with pass: ${pass.substring(0, 3)}... (length: ${pass.length})`);

        await transporter.verify();
        console.log("Transporter verification successful. Credentials are valid.");
    } catch (error) {
        console.error("Transporter verification failed:", error.message);
    }
}

testEmail();
