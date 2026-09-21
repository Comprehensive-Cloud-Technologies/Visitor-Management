import pool from "../config/db.js"
import transporter from "../config/mailer.js";
import process from "process";

import bcrypt from "bcryptjs";
export const forgotPassword = async (req, res) => {

  try {

    const { email } = req.body;

    const [users] = await pool.execute(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Email not found"
      });
    }
const otp = Math.floor(
  100000 + Math.random() * 900000
);



await pool.execute(
  `
  INSERT INTO password_reset_otp
  (email, otp)
  VALUES (?, ?)
  `,
  [email, otp]
);

await transporter.sendMail({
  from: process.env.EMAIL_USER,
  to: email,
  subject: "Password Reset OTP",
  html: `
    <h2>Password Reset Request</h2>
    <p>Your OTP is:</p>
    <h1>${otp}</h1>
    <p>This OTP is valid for 10 minutes.</p>
  `
});

    res.json({
      success: true,
      message: "OTP Generated"
    });

  }
  catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error"
    });

  }

};

export const verifyOtp = async (
  req,
  res
) => {

  try {

    const { email, otp } =
      req.body;

    const [rows] =
      await pool.execute(
        `
        SELECT *
        FROM password_reset_otp
        WHERE email = ?
        AND otp = ?
        ORDER BY id DESC
        LIMIT 1
        `,
        [email, otp]
      );

    if(rows.length === 0)
    {
      return res.status(400).json({
        success:false,
        message:"Invalid OTP"
      });
    }

    res.json({
      success:true,
      message:"OTP Verified"
    });

  }
  catch(error)
  {
    console.log(error);

    res.status(500).json({
      success:false,
      message:"Server Error"
    });
  }

};

export const resetPassword = async (
  req,
  res
) => {

  try {

    const {
      email,
      password
    } = req.body;

    const hashedPassword =
      await bcrypt.hash(
        password,
        10
      );

    await pool.execute(
      `
      UPDATE users
      SET
      password = ?,
      otp = NULL,
      otp_expiry = NULL
      WHERE email = ?
      `,
      [
        hashedPassword,
        email
      ]
    );

    await pool.execute(
      `
      DELETE FROM password_reset_otp
      WHERE email = ?
      `,
      [email]
    );

    res.json({

      success:true,
      message:
      "Password Reset Successfully"

    });

  }
  catch(error)
  {
    console.log(error);

    res.status(500).json({
      success:false,
      message:"Server Error"
    });
  }

};
export default {
  forgotPassword,
  verifyOtp,
  resetPassword};