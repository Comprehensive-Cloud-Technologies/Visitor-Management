import pool from "../config/db.js";

/* GET ALL ROLES */

export const getRoles =
async (req,res)=>{

  try{

    const [roles] =
      await pool.execute(
        `
        SELECT *
        FROM roles
        ORDER BY id DESC
        `
      );

    res.json({
      success:true,
      roles
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

/* ADD ROLE */

export const addRole =
async (req,res)=>{

  try{

    const {
      role_name,
      status
    } = req.body;

    const [existing] =
      await pool.execute(
        `
        SELECT id
        FROM roles
        WHERE role_name = ?
        `,
        [role_name]
      );

    if(existing.length > 0)
    {
      return res.status(400).json({
        success:false,
        message:"Role Already Exists"
      });
    }

    await pool.execute(
      `
      INSERT INTO roles
      (
        role_name,
        status
      )
      VALUES
      (?,?)
      `,
      [
        role_name,
        status || "Active"
      ]
    );

    res.json({

      success:true,

      message:
      "Role Added Successfully"

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

/* GET SINGLE ROLE */

export const getRoleById =
async (req,res)=>{

  try{

    const { id } =
      req.params;

    const [role] =
      await pool.execute(
        `
        SELECT *
        FROM roles
        WHERE id = ?
        `,
        [id]
      );

    if(role.length === 0)
    {
      return res.status(404).json({
        success:false,
        message:"Role Not Found"
      });
    }

    res.json({
      success:true,
      role:role[0]
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

/* UPDATE ROLE */

export const updateRole =
async (req,res)=>{

  try{

    const { id } =
      req.params;

    const {
      role_name,
      status
    } = req.body;

    const [existing] =
      await pool.execute(
        `
        SELECT id
        FROM roles
        WHERE role_name = ?
        AND id != ?
        `,
        [
          role_name,
          id
        ]
      );

    if(existing.length > 0)
    {
      return res.status(400).json({
        success:false,
        message:"Role Already Exists"
      });
    }

    await pool.execute(
      `
      UPDATE roles
      SET
      role_name = ?,
      status = ?
      WHERE id = ?
      `,
      [
        role_name,
        status,
        id
      ]
    );

    res.json({

      success:true,

      message:
      "Role Updated Successfully"

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

/* DELETE ROLE */

export const deleteRole =
async (req,res)=>{

  try{

    const { id } =
      req.params;

    await pool.execute(
      `
      DELETE FROM roles
      WHERE id = ?
      `,
      [id]
    );

    res.json({

      success:true,

      message:
      "Role Deleted Successfully"

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