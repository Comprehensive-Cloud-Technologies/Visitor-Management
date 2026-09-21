import pool from "../config/db.js";

export const getCompanySettings =
async (req,res) => {

  try{

    const [data] =
      await pool.execute(
        `
        SELECT *
        FROM company_settings
        LIMIT 1
        `
      );

    res.json({
      success:true,
      settings:data[0]
    });

  }
  catch(error){

    console.log(error);

    res.status(500).json({
      success:false
    });

  }

};

export const updateCompanySettings =
async (req,res) => {

  try{

    const {
      company_name,
      company_logo,
      address,
      email,
      mobile
    } = req.body;

    await pool.execute(
      `
      UPDATE company_settings
      SET
      company_name=?,
      company_logo=?,
      address=?,
      email=?,
      mobile=?
      WHERE id=1
      `,
      [
        company_name,
        company_logo,
        address,
        email,
        mobile
      ]
    );

    res.json({
      success:true,
      message:"Settings Updated"
    });

  }
  catch(error){

    console.log(error);

    res.status(500).json({
      success:false
    });

  }

};