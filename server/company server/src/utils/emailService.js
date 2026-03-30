/**
 * @description Enhanced Email Sending Utility with templates
 */

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SENDING_EMAIL,
        pass: process.env.SENDING_EMAIL_PASSWORD
    }
});

/**
 * Send interview invitation email
 * @param {string} email - Candidate email
 * @param {string} candidateName - Candidate name
 * @param {string} companyName - Company name
 * @param {string} interviewTitle - Interview title
 * @param {string} inviteLink - Invitation link
 */
exports.sendInterviewInvite = async (email, candidateName, companyName, interviewTitle, inviteLink) => {
    const htmlTemplate = `
        <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <h2>Interview Invitation</h2>
                <p>Hello ${candidateName},</p>
                <p>You have been invited by <strong>${companyName}</strong> for an interview.</p>
                <p><strong>Interview Title:</strong> ${interviewTitle}</p>
                <p>Please click the link below to start your interview:</p>
                <p><a href="${inviteLink}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Start Interview</a></p>
                <p>This link is valid for 7 days.</p>
                <p>Best regards,<br>AI Interviewer Team</p>
            </body>
        </html>
    `;

    return transporter.sendMail({
        from: `"AI Interviewer" <${process.env.SENDING_EMAIL}>`,
        to: email,
        subject: `Interview Invitation from ${companyName}`,
        html: htmlTemplate
    });
};

/**
 * Send interview result/feedback email
 * @param {string} email - Candidate email
 * @param {string} candidateName - Candidate name
 * @param {string} companyName - Company name
 * @param {string} interviewTitle - Interview title
 * @param {string} score - Interview score (percentage)
 * @param {string} feedback - Feedback text
 */
exports.sendInterviewResult = async (email, candidateName, companyName, interviewTitle, score, feedback) => {
    const htmlTemplate = `
        <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <h2>Interview Result</h2>
                <p>Hello ${candidateName},</p>
                <p>Thank you for completing the interview at <strong>${companyName}</strong>.</p>
                <p><strong>Interview:</strong> ${interviewTitle}</p>
                <p><strong>Score:</strong> ${score}%</p>
                <h3>Feedback</h3>
                <p>${feedback}</p>
                <p>Best regards,<br>AI Interviewer Team</p>
            </body>
        </html>
    `;

    return transporter.sendMail({
        from: `"AI Interviewer" <${process.env.SENDING_EMAIL}>`,
        to: email,
        subject: `Interview Result - ${companyName}`,
        html: htmlTemplate
    });
};

/**
 * Send interview reminder email
 * @param {string} email - Candidate email
 * @param {string} candidateName - Candidate name
 * @param {string} companyName - Company name
 */
exports.sendInterviewReminder = async (email, candidateName, companyName) => {
    const htmlTemplate = `
        <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <h2>Interview Reminder</h2>
                <p>Hello ${candidateName},</p>
                <p>This is a friendly reminder that you have a pending interview with <strong>${companyName}</strong>.</p>
                <p>Please complete your interview at your earliest convenience.</p>
                <p>Best regards,<br>AI Interviewer Team</p>
            </body>
        </html>
    `;

    return transporter.sendMail({
        from: `"AI Interviewer" <${process.env.SENDING_EMAIL}>`,
        to: email,
        subject: `Interview Reminder - ${companyName}`,
        html: htmlTemplate
    });
};
