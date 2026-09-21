import pool from "../config/db.js";

/* SIGNUP */
export const signup = async (req, res) => {

  try {

    const {
      fullName,
      employeeCode,
      email,
      mobile,
      password
    } = req.body;

    // Validation
    if (
      !fullName ||
      !employeeCode ||
      !email ||
      !mobile ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    // Email Validation
    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Email Format"
      });
    }

    // Check Email
    const [existingEmail] =
      await pool.execute(
        "SELECT id FROM users WHERE email = ?",
        [email]
      );

    if (existingEmail.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Email already exists"
      });
    }

    // Check Employee Code
    const [existingCode] =
      await pool.execute(
        "SELECT id FROM users WHERE employee_code = ?",
        [employeeCode]
      );

    if (existingCode.length > 0) {
      return res.status(400).json({
        success: false,
        message:
          "Employee Code already exists"
      });
    }

   await pool.execute(
  `
  INSERT INTO users
  (
    full_name,
    employee_code,
    username,
    email,
    mobile,
    password
  )
  VALUES
  (?, ?, ?, ?, ?, ?)
  `,
  [
    fullName,
    employeeCode,
    employeeCode,
    email,
    mobile,
    password
  ]
);
    res.status(201).json({
      success: true,
      message:
        "Registration Successful"
    });

  }
  catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
      detail: error.message
    });

  }

};
/* LOGIN */
export const login = async (req, res) => {

  try {

    const {
      username,
      password
    } = req.body;

    /* =========================
       1. VALIDATION
    ========================= */

    if (!username || !password) {

      return res.status(400).json({

        success: false,

        message:
          "Username and Password are required"

      });

    }

    /* =========================
       2. FIND USER + ROLE
       + COMPANY
    ========================= */

    const [users] = await pool.execute(

      `
      SELECT

        u.id,

        u.company_id,

        u.full_name,

        u.employee_code,

        u.email,

        u.mobile,

        u.username,

        u.password,

        u.role,

        u.role_id,

        u.status,

        u.profile_photo,

        u.last_login,

        r.role_name,

        c.company_name,

        c.company_code,

        c.logo AS company_logo,

        c.status AS company_status

      FROM users u

      LEFT JOIN roles r

        ON u.role_id = r.id

      LEFT JOIN companies c

        ON u.company_id = c.id

      WHERE u.username = ? OR u.email = ?

      LIMIT 1
      `,

      [username, username]

    );

    /* =========================
       3. USER CHECK
    ========================= */

    if (users.length === 0) {

      return res.status(401).json({

        success: false,

        message:
          "User not found"

      });

    }

    const user = users[0];

    /* =========================
       4. USER STATUS CHECK
    ========================= */

    if (
      user.status &&
      user.status.toLowerCase() === "inactive"
    ) {

      return res.status(401).json({

        success: false,

        message:
          "Your account is inactive. Contact your administrator."

      });

    }

    /* =========================
       5. COMPANY STATUS CHECK
    ========================= */

    if (
      user.company_status &&
      user.company_status.toUpperCase() !== "ACTIVE"
    ) {

      return res.status(401).json({

        success: false,

        message:
          "Your company account is inactive. Contact the system administrator."

      });

    }

    /* =========================
       6. PASSWORD CHECK
    ========================= */

    const isMatch =
      password === user.password;

    if (!isMatch) {

      return res.status(401).json({

        success: false,

        message:
          "Invalid Password"

      });

    }

    /* =========================
       7. UPDATE LAST LOGIN
    ========================= */

    await pool.execute(

      `
      UPDATE users
      SET
        last_login = NOW()
      WHERE id = ?
      `,

      [user.id]

    );

    /* =========================
       8. SUCCESS RESPONSE
    ========================= */

    return res.json({

      success: true,

      message:
        "Login Successful",

      user: {

        /* User */

        id:
          user.id,

        full_name:
          user.full_name,

        employee_code:
          user.employee_code,

        email:
          user.email,

        mobile:
          user.mobile,

        username:
          user.username,

        profile_photo:
          user.profile_photo,

        /* Role */

        role:
          user.role,

        role_id:
          user.role_id,

        role_name:
          user.role_name,

        /* Company */

        company_id:
          user.company_id,

        company_name:
          user.company_name,

        company_code:
          user.company_code,

        company_logo:
          user.company_logo,

        /* Status */

        status:
          user.status,

        last_login:
          new Date()

      }

    });

  }

  catch (error) {

    console.error(
      "Login Error:",
      error
    );

    return res.status(500).json({

      success: false,

      message:
        "Server Error"

    });

  }

};


/* UPDATE PROFILE */

export const updateProfile = async (
  req,
  res
) => {

  try {

    const { id } = req.params;

    const {
      full_name,
      employee_code,
      email,
      mobile
    } = req.body;

    await pool.execute(
      `
      UPDATE users
      SET
      full_name = ?,
      employee_code = ?,
      email = ?,
      mobile = ?
      WHERE id = ?
      `,
      [
        full_name,
        employee_code,
        email,
        mobile,
        id
      ]
    );

    res.json({
      success: true,
      message:
        "Profile Updated Successfully"
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
export const getUsers = async (req,res) => {

  try {

    const [users] =
      await pool.execute(
        `
        SELECT
        id,
        full_name,
        employee_code,
        email,
        mobile,
        role,
        status,
        created_at,
        last_login
        FROM users
        ORDER BY id DESC
        `
      );

    res.json({
      success:true,
      users
    });

  }
  catch(error){

    console.log(error);

    res.status(500).json({
      success:false,
      message:"Server Error"
    });

  }

};
export const getUser = async (req,res)=>{

  try{

    const { id } = req.params;

    const [user] =
      await pool.execute(
        `
        SELECT *
        FROM users
        WHERE id = ?
        `,
        [id]
      );

    if(user.length === 0){

      return res.status(404).json({
        success:false,
        message:"User Not Found"
      });

    }

    res.json({
      success:true,
      user:user[0]
    });

}
    catch(error){
console.log(error);
    res.status(500).json({
      success:false
    });

  }

};
export const updateUser = async (
  req,
  res
)=>{

  try{

    const { id } =
      req.params;

    const {
      fullName,
      employeeCode,
      email,
      mobile
    } = req.body;

    await pool.execute(
      `
      UPDATE users
      SET
      full_name=?,
      employee_code=?,
      email=?,
      mobile=?
      WHERE id=?
      `,
      [
        fullName,
        employeeCode,
        email,
        mobile,
        id
      ]
    );

    res.json({

      success:true,
      message:
      "User Updated"

    });

  }
  catch(error){
console.log(error);
    res.status(500).json({
      success:false
    });


  }

};
export const deleteUser = async (
  req,
  res
)=>{

  try{

    const { id } =
      req.params;

    await pool.execute(
      `
      DELETE FROM users
      WHERE id=?
      `,
      [id]
    );

    res.json({

      success:true,
      message:
      "User Deleted"

    });

  }
  catch(error){
console.log(error);
    res.status(500).json({
      success:false
    });


  }

};
export const changeStatus = async (
  req,
  res
)=>{

  try{

    const { id } =
      req.params;

    const {
      status
    } = req.body;

    await pool.execute(
      `
      UPDATE users
      SET status=?
      WHERE id=?
      `,
      [
        status,
        id
      ]
    );

    res.json({

      success:true,
      message:
      "Status Updated"

    });

  }
  catch(error){
console.log(error);
    res.status(500).json({

      success:false

    });

  }

};
export const changePassword = async (
  req,
  res
) => {

  try {

    const { id } = req.params;

    const {
      currentPassword,
      newPassword
    } = req.body;

    const [users] =
      await pool.execute(
        "SELECT * FROM users WHERE id = ?",
        [id]
      );

    if(users.length === 0)
    {
      return res.status(404).json({
        success:false,
        message:"User Not Found"
      });
    }

    const user = users[0];

    const isMatch =
  currentPassword === user.password;

    if(!isMatch)
    {
      return res.status(400).json({
        success:false,
        message:"Current Password Incorrect"
      });
    }
await pool.execute(
  "UPDATE users SET password=? WHERE id=?",
  [newPassword, id]
);

    res.json({
      success:true,
      message:"Password Changed Successfully"
    });

  }
  catch(error)
  {
    console.error(error);

    res.status(500).json({
      success:false,
      message:"Server Error"
    });
  }

};
export default {
  signup,
  login,updateUser,
  getUsers,
  getUser,
  deleteUser,
  changeStatus,
  updateProfile,
  changePassword
};