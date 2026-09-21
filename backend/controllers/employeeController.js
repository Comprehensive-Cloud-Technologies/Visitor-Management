import pool from "../config/db.js";

/* ==========================================
   GET COMPANY ID FROM REQUEST
========================================== */

const getCompanyId = (req) => {

  const companyId =
    Number(
      req.headers["x-company-id"]
    );

 if (
    !companyId ||
    Number(companyId) <= 0
  ) {

    return null;

  }

  return Number(companyId);

};


/* ==========================================
   GET ALL EMPLOYEES
========================================== */

/* ==========================================
   GET ALL EMPLOYEES - COMPANY WISE
========================================== */

/* ==========================================
   GET ALL EMPLOYEES
   COMPANY-WISE
========================================== */

export const getEmployees =
async (req, res) => {

  try {

    const companyId =
      getCompanyId(req);

    /* ==========================
       COMPANY VALIDATION
    ========================== */

    if (
      !companyId
    ) {

      return res.status(400).json({

        success: false,

        message:
          "Company ID is required"

      });

    }

    /* ==========================
       GET COMPANY EMPLOYEES
    ========================== */

    const [employees] =
      await pool.execute(

        `
        SELECT
          id,
          company_id,
          employee_code,
          employee_name,
          department,
          designation,
          email,
          mobile,
          warehouse,
          status,
          username,
          role_id,
          user_id,
          created_at
        FROM employees
        WHERE company_id = ?
        ORDER BY id DESC
        `,

        [
          companyId
        ]

      );

    /* ==========================
       SUCCESS RESPONSE
    ========================== */

    return res.json({

      success: true,

      employees

    });

  }
  catch (error) {

    console.error(

      "GET EMPLOYEES ERROR:",

      error

    );

    return res.status(500).json({

      success: false,

      message:
        "Unable to load employees"

    });

  }

};


/* ==========================================
   ADD EMPLOYEE
========================================== */

export const addEmployee =
async (req, res) => {

  const connection =
    await pool.getConnection();

  try {
    

    const companyId =
      getCompanyId(req);

    if (!companyId) {

      return res.status(400).json({

        success: false,

        message:
          "Company ID is required"

      });

    }

    const {

      employee_code,

      employee_name,

      department,

      designation,

      email,

      mobile,

      warehouse,

      status,

      username,

      password,

      role_id

    } = req.body;


    /* ==========================
       REQUIRED VALIDATION
    ========================== */

    if (

      !employee_code ||

      !employee_name ||

      !email ||

      !mobile ||

      !username ||

      !password ||

      !role_id

    ) {

      return res.status(400).json({

        success: false,

        message:
          "Please fill all required employee details"

      });

    }


    /* ==========================
       EMAIL VALIDATION
    ========================== */

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
      !emailRegex.test(email)
    ) {

      return res.status(400).json({

        success: false,

        message:
          "Invalid email format"

      });

    }


    await connection.beginTransaction();


    /* ==========================
       CHECK EMPLOYEE CODE
       COMPANY-WISE
    ========================== */

    const [existingEmployee] =
      await connection.execute(

        `
        SELECT id
        FROM employees
        WHERE employee_code = ?
        AND company_id = ?
        `,

        [

          employee_code,

          companyId

        ]

      );

    if (
      existingEmployee.length > 0
    ) {

      await connection.rollback();

      return res.status(400).json({

        success: false,

        message:
          "Employee Code Already Exists"

      });

    }


    /* ==========================
       CHECK EMPLOYEE EMAIL
       COMPANY-WISE
    ========================== */

    const [existingEmail] =
      await connection.execute(

        `
        SELECT id
        FROM employees
        WHERE email = ?
        AND company_id = ?
        `,

        [

          email,

          companyId

        ]

      );

    if (
      existingEmail.length > 0
    ) {

      await connection.rollback();

      return res.status(400).json({

        success: false,

        message:
          "Email Already Exists"

      });

    }


    /* ==========================
       CHECK USERNAME
    ========================== */

    const [existingUsername] =
      await connection.execute(

        `
        SELECT id
        FROM users
        WHERE username = ?
        `,

        [username]

      );

    if (
      existingUsername.length > 0
    ) {

      await connection.rollback();

      return res.status(400).json({

        success: false,

        message:
          "Username Already Exists"

      });

    }


    /* ==========================
       INSERT USER
    ========================== */

    const [userResult] =
      await connection.execute(

        `
        INSERT INTO users
        (

          company_id,

          full_name,

          employee_code,

          email,

          mobile,

          username,

          password,

          role_id

        )
        VALUES
        (?, ?, ?, ?, ?, ?, ?, ?)
        `,

        [

          companyId,

          employee_name,

          employee_code,

          email,

          mobile,

          username,

          password,

          role_id

        ]

      );


    const userId =
      userResult.insertId;


    /* ==========================
       INSERT EMPLOYEE
    ========================== */

    await connection.execute(

      `
      INSERT INTO employees
      (

        company_id,

        employee_code,

        employee_name,

        department,

        designation,

        email,

        mobile,

        username,

        password,

        role_id,

        warehouse,

        status,

        user_id

      )
      VALUES
      (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,

      [

        companyId,

        employee_code,

        employee_name,

        department,

        designation,

        email,

        mobile,

        username,

        password,

        role_id,

        warehouse,

        status,

        userId

      ]

    );


    await connection.commit();


    res.status(201).json({

      success: true,

      message:
        "Employee Added Successfully"

    });

  }
  catch (error) {

    await connection.rollback();

    console.log(error);

    res.status(500).json({

      success: false,

      message:
        "Unable to add employee"

    });

  }
  finally {

    connection.release();

  }

};


/* ==========================================
   GET SINGLE EMPLOYEE
========================================== */
/* ==========================================
   GET SINGLE EMPLOYEE - COMPANY WISE
========================================== */

/* ==========================================
   GET SINGLE EMPLOYEE
   COMPANY-WISE
========================================== */

export const getEmployee =
async (req, res) => {

  try {

    const {

      id

    } = req.params;


    const companyId =
      getCompanyId(req);


    /* ==========================
       COMPANY VALIDATION
    ========================== */

    if (
      !companyId
    ) {

      return res.status(400).json({

        success: false,

        message:
          "Company ID is required"

      });

    }


    /* ==========================
       GET EMPLOYEE
       ONLY FROM CURRENT COMPANY
    ========================== */

    const [employees] =
      await pool.execute(

        `
        SELECT
          id,
          company_id,
          employee_code,
          employee_name,
          department,
          designation,
          email,
          mobile,
          warehouse,
          status,
          username,
          role_id,
          user_id,
          created_at
        FROM employees
        WHERE
          id = ?
          AND company_id = ?
        LIMIT 1
        `,

        [

          id,

          companyId

        ]

      );


    /* ==========================
       EMPLOYEE NOT FOUND
    ========================== */

    if (
      employees.length === 0
    ) {

      return res.status(404).json({

        success: false,

        message:
          "Employee not found or does not belong to this company"

      });

    }


    /* ==========================
       SUCCESS RESPONSE
    ========================== */

    return res.json({

      success: true,

      employee:
        employees[0]

    });

  }
  catch (error) {

    console.error(

      "GET EMPLOYEE ERROR:",

      error

    );

    return res.status(500).json({

      success: false,

      message:
        "Unable to load employee"

    });

  }

};

/* ==========================================
   UPDATE EMPLOYEE
========================================== */

/* ==========================================
   UPDATE EMPLOYEE - COMPANY WISE
========================================== */

export const updateEmployee =
async (req, res) => {

  let connection;

  try {

    connection =
      await pool.getConnection();


    const companyId =
      getCompanyId(req);


    const { id } =
      req.params;


    /* ==========================
       COMPANY VALIDATION
    ========================== */

    if (!companyId) {

      return res.status(400).json({

        success: false,

        message:
          "Company ID is required"

      });

    }


    /* ==========================
       GET FORM DATA
    ========================== */

    const {

      employee_code,

      employee_name,

      department,

      designation,

      email,

      mobile,

      warehouse,

      status

    } = req.body;


    /* ==========================
       REQUIRED VALIDATION
    ========================== */

    if (

      !employee_code ||

      !employee_name ||

      !email ||

      !mobile

    ) {

      return res.status(400).json({

        success: false,

        message:
          "Please fill all required employee details"

      });

    }


    /* ==========================
       EMAIL FORMAT VALIDATION
    ========================== */

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    if (

      !emailRegex.test(
        email
      )

    ) {

      return res.status(400).json({

        success: false,

        message:
          "Invalid email format"

      });

    }


    /* ==========================
       START TRANSACTION
    ========================== */

    await connection
      .beginTransaction();


    /* ==========================
       CHECK EMPLOYEE
       COMPANY-WISE
    ========================== */

    const [existingEmployee] =
      await connection.execute(

        `
        SELECT

          id,

          user_id

        FROM employees

        WHERE id = ?

        AND company_id = ?
        `,

        [

          id,

          companyId

        ]

      );


    if (

      existingEmployee.length === 0

    ) {

      await connection
        .rollback();


      return res.status(404).json({

        success: false,

        message:
          "Employee Not Found"

      });

    }


    /* ==========================
       CHECK DUPLICATE
       EMPLOYEE CODE
    ========================== */

    const [duplicateCode] =
      await connection.execute(

        `
        SELECT id

        FROM employees

        WHERE employee_code = ?

        AND company_id = ?

        AND id != ?
        `,

        [

          employee_code,

          companyId,

          id

        ]

      );


    if (

      duplicateCode.length > 0

    ) {

      await connection
        .rollback();


      return res.status(400).json({

        success: false,

        message:
          "Employee Code Already Exists"

      });

    }


    /* ==========================
       CHECK DUPLICATE EMAIL
    ========================== */

    const [duplicateEmail] =
      await connection.execute(

        `
        SELECT id

        FROM employees

        WHERE email = ?

        AND company_id = ?

        AND id != ?
        `,

        [

          email,

          companyId,

          id

        ]

      );


    if (

      duplicateEmail.length > 0

    ) {

      await connection
        .rollback();


      return res.status(400).json({

        success: false,

        message:
          "Email Already Exists"

      });

    }


    /* ==========================
       UPDATE EMPLOYEE
    ========================== */

    await connection.execute(

      `
      UPDATE employees

      SET

        employee_code = ?,

        employee_name = ?,

        department = ?,

        designation = ?,

        email = ?,

        mobile = ?,

        warehouse = ?,

        status = ?

      WHERE id = ?

      AND company_id = ?
      `,

      [

        employee_code,

        employee_name,

        department || "",

        designation || "",

        email,

        mobile,

        warehouse || "",

        status || "Active",

        id,

        companyId

      ]

    );


    /* ==========================
       UPDATE LINKED USER
    ========================== */

    const userId =
      existingEmployee[0]
        .user_id;


    if (userId) {

      await connection.execute(

        `
        UPDATE users

        SET

          full_name = ?,

          employee_code = ?,

          email = ?,

          mobile = ?,

          status = ?

        WHERE id = ?

        AND company_id = ?
        `,

        [

          employee_name,

          employee_code,

          email,

          mobile,

          status || "Active",

          userId,

          companyId

        ]

      );

    }


    /* ==========================
       SAVE BOTH UPDATES
    ========================== */

    await connection
      .commit();


    return res.json({

      success: true,

      message:
        "Employee Updated Successfully"

    });

  }
  catch (error) {

    console.error(

      "UPDATE EMPLOYEE ERROR:",

      error

    );


    if (connection) {

      await connection
        .rollback();

    }


    return res.status(500).json({

      success: false,

      message:
        "Unable to update employee"

    });

  }
  finally {

    if (connection) {

      connection.release();

    }

  }

};


/* ==========================================
   DELETE EMPLOYEE
========================================== */

/* ==========================================
   DELETE EMPLOYEE - COMPANY WISE
========================================== */

export const deleteEmployee =
async (req, res) => {

  let connection;

  try {

    connection =
      await pool.getConnection();


    const companyId =
      getCompanyId(req);


    const { id } =
      req.params;


    /* ==========================
       COMPANY VALIDATION
    ========================== */

    if (!companyId) {

      return res.status(400).json({

        success: false,

        message:
          "Company ID is required"

      });

    }


    /* ==========================
       START TRANSACTION
    ========================== */

    await connection
      .beginTransaction();


    /* ==========================
       GET EMPLOYEE
       COMPANY-WISE
    ========================== */

    const [employees] =
      await connection.execute(

        `
        SELECT

          id,

          user_id

        FROM employees

        WHERE id = ?

        AND company_id = ?
        `,

        [

          id,

          companyId

        ]

      );


    if (

      employees.length === 0

    ) {

      await connection
        .rollback();


      return res.status(404).json({

        success: false,

        message:
          "Employee Not Found"

      });

    }


    const userId =
      employees[0]
        .user_id;


    /* ==========================
       DELETE EMPLOYEE
    ========================== */

    const [employeeDeleteResult] =
      await connection.execute(

        `
        DELETE FROM employees

        WHERE id = ?

        AND company_id = ?
        `,

        [

          id,

          companyId

        ]

      );


    if (

      employeeDeleteResult
        .affectedRows === 0

    ) {

      throw new Error(

        "Employee could not be deleted"

      );

    }


    /* ==========================
       DELETE LINKED USER
    ========================== */

    if (userId) {

      await connection.execute(

        `
        DELETE FROM users

        WHERE id = ?

        AND company_id = ?
        `,

        [

          userId,

          companyId

        ]

      );

    }


    /* ==========================
       SAVE CHANGES
    ========================== */

    await connection
      .commit();


    return res.json({

      success: true,

      message:
        "Employee Deleted Successfully"

    });

  }
  catch (error) {

    console.error(

      "DELETE EMPLOYEE ERROR:",

      error

    );


    if (connection) {

      await connection
        .rollback();

    }


    return res.status(500).json({

      success: false,

      message:
        "Unable to delete employee"

    });

  }
  finally {

    if (connection) {

      connection.release();

    }

  }

};


/* ==========================================
   IMPORT EMPLOYEES
========================================== */

/* ==========================================
   IMPORT EMPLOYEES - COMPANY WISE
========================================== */

export const importEmployees =
async (req, res) => {

  let connection;

  try {

    connection =
      await pool.getConnection();


    const companyId =
      getCompanyId(req);


    /* ==========================
       COMPANY VALIDATION
    ========================== */

    if (!companyId) {

      return res.status(400).json({

        success: false,

        message:
          "Company ID is required"

      });

    }


    const {

      employees

    } = req.body;


    /* ==========================
       FILE DATA VALIDATION
    ========================== */

    if (

      !Array.isArray(employees)

      ||

      employees.length === 0

    ) {

      return res.status(400).json({

        success: false,

        message:
          "No employee data found"

      });

    }


    /* ==========================
       VALID EMPLOYEE ROWS
    ========================== */

    const validEmployees =
      employees.filter(

        (emp) =>

          String(
            emp.Employee_Code || ""
          ).trim()

          &&

          String(
            emp.Employee_Name || ""
          ).trim()

      );


    if (

      validEmployees.length === 0

    ) {

      return res.status(400).json({

        success: false,

        message:
          "No valid employee data found"

      });

    }


    /* ==========================
       DEFAULT ROLE
    ========================== */

    const defaultRoleId = 6;


    /* ==========================
       START TRANSACTION
    ========================== */

    await connection
      .beginTransaction();


    let importedCount = 0;

    const skippedEmployees = [];


    /* ==========================
       PROCESS EACH EMPLOYEE
    ========================== */

    for (

      const emp

      of validEmployees

    ) {

      const employeeCode =

        String(

          emp.Employee_Code

        ).trim();


      const employeeName =

        String(

          emp.Employee_Name

        ).trim();


      const email =

        String(

          emp.Email || ""

        ).trim();


      const mobile =

        String(

          emp.Mobile || ""

        ).trim();


      const department =

        String(

          emp.Department || ""

        ).trim();


      const designation =

        String(

          emp.Designation || ""

        ).trim();


      const warehouse =

        String(

          emp.Warehouse || ""

        ).trim();


      const status =

        String(

          emp.Status || "Active"

        ).trim();


      /* ==========================
         AUTO-GENERATED LOGIN
      ========================== */

      const username =

        employeeCode;


      const password =

        employeeCode;


      /* ==========================
         CHECK EMPLOYEE CODE
         COMPANY-WISE
      ========================== */

      const [existingEmployee] =

        await connection.execute(

          `
          SELECT id

          FROM employees

          WHERE employee_code = ?

          AND company_id = ?
          `,

          [

            employeeCode,

            companyId

          ]

        );


      if (

        existingEmployee.length > 0

      ) {

        skippedEmployees.push({

          employee_code:

            employeeCode,

          reason:

            "Employee code already exists"

        });

        continue;

      }


      /* ==========================
         CHECK EMAIL
         COMPANY-WISE
      ========================== */

      if (email) {

        const [existingEmail] =

          await connection.execute(

            `
            SELECT id

            FROM employees

            WHERE email = ?

            AND company_id = ?
            `,

            [

              email,

              companyId

            ]

          );


        if (

          existingEmail.length > 0

        ) {

          skippedEmployees.push({

            employee_code:

              employeeCode,

            reason:

              "Email already exists"

          });

          continue;

        }

      }


      /* ==========================
         CHECK USERNAME
      ========================== */

      const [existingUsername] =

        await connection.execute(

          `
          SELECT id

          FROM users

          WHERE username = ?
          `,

          [

            username

          ]

        );


      if (

        existingUsername.length > 0

      ) {

        skippedEmployees.push({

          employee_code:

            employeeCode,

          reason:

            "Username already exists"

        });

        continue;

      }


      /* ==========================
         INSERT USER
      ========================== */

      const [userResult] =

        await connection.execute(

          `
          INSERT INTO users
          (

            company_id,

            full_name,

            employee_code,

            email,

            mobile,

            username,

            password,

            role_id,

            status

          )
          VALUES
          (?, ?, ?, ?, ?, ?, ?, ?, ?)
          `,

          [

            companyId,

            employeeName,

            employeeCode,

            email,

            mobile,

            username,

            password,

            defaultRoleId,

            status

          ]

        );


      const userId =

        userResult.insertId;


      /* ==========================
         INSERT EMPLOYEE
      ========================== */

      await connection.execute(

        `
        INSERT INTO employees
        (

          company_id,

          employee_code,

          employee_name,

          department,

          designation,

          email,

          mobile,

          username,

          password,

          role_id,

          warehouse,

          status,

          user_id

        )
        VALUES
        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,

        [

          companyId,

          employeeCode,

          employeeName,

          department,

          designation,

          email,

          mobile,

          username,

          password,

          defaultRoleId,

          warehouse,

          status,

          userId

        ]

      );


      importedCount++;

    }


    /* ==========================
       COMMIT ALL CHANGES
    ========================== */

    await connection
      .commit();


    return res.json({

      success: true,

      imported:

        importedCount,

      skipped:

        skippedEmployees.length,

      skippedEmployees,

      message:

        `${importedCount} employee(s) imported successfully`

    });

  }
  catch (error) {

    console.error(

      "IMPORT EMPLOYEE ERROR:",

      error

    );


    if (connection) {

      await connection
        .rollback();

    }


    return res.status(500).json({

      success: false,

      message:
        "Unable to import employees"

    });

  }
  finally {

    if (connection) {

      connection.release();

    }

  }

};

