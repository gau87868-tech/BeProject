const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
    service : "gmail",
    auth : {
        user : process.env.SENDING_EMAIL,
        pass : process.env.SENDING_EMAIL_PASSWORD
    }
});

async function sendInvite(email,interviewLink){
    await transporter.sendMail({
        from : `"AI Interviewer" <${process.env.SENDING_EMAIL}>`,
        to : email,
        subject : "Interview Invitation",
        html : `<p>You have been invited for an interview.</p>
      <p><a href="${interviewLink}">Click here to join</a></p>`
    });
}

module.exports = sendInvite;