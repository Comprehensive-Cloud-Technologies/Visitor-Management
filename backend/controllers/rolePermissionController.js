import pool from "../config/db.js";

/* GET ROLE PERMISSIONS */

export const getRolePermissions =
async (req,res)=>{

  try{

    const { roleId } =
      req.params;

    const [permissions] =
      await pool.execute(
        `
        SELECT *
        FROM role_permissions
        WHERE role_id = ?
        `,
        [roleId]
      );

    res.json({

      success:true,

      permissions

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


/* SAVE ROLE PERMISSIONS */

export const saveRolePermissions =
async (req,res)=>{

  try{

    const {
      role_id,
      permissions
    } = req.body;

    await pool.execute(
      `
      DELETE FROM role_permissions
      WHERE role_id = ?
      `,
      [role_id]
    );

    for(const permission of permissions)
    {
      await pool.execute(
        `
        INSERT INTO role_permissions
        (
          role_id,
          module_name,
          can_create,
          can_read,
          can_update,
          can_delete
        )
        VALUES
        (?, ?, ?, ?, ?, ?)
        `,
        [
          role_id,
          permission.module_name,
          permission.can_create,
          permission.can_read,
          permission.can_update,
          permission.can_delete
        ]
      );
    }

    res.json({
      success:true,
      message:"Permissions Saved Successfully"
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
export const getPermissionsByRole =
async (req,res)=>{

  try{

    const { roleId } =
      req.params;

    const [permissions] =
      await pool.execute(
        `
        SELECT *
        FROM role_permissions
        WHERE role_id = ?
        `,
        [roleId]
      );

    res.json({
      success:true,
      permissions
    });

  }
  catch(error){

    console.log(error);

    res.status(500).json({
      success:false
    });

  }

};