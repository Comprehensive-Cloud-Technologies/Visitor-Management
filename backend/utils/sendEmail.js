import nodemailer from "nodemailer";
import process from "process";
const transporter =
  nodemailer.createTransport({

    service: "gmail",

    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }

  });

export const sendOtpEmail =
async (
  email,
  otp
) => {

  await transporter.sendMail({

    from:
      process.env.EMAIL_USER,

    to: email,

    subject:
      "Password Reset OTP",

    html: `
      <h2>Password Reset</h2>

      <p>Your OTP is:</p>

      <h1>${otp}</h1>

      <p>
        Valid for 10 minutes
      </p>
    `
  });

};