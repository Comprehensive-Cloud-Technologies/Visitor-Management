import pool from "../config/db.js";

/* ==================================================
GET ALL COMPANIES
================================================== */

export const getCompanies = async (req, res) => {


try {

    const [companies] = await pool.execute(

        `
        SELECT
            id,
            company_name,
            company_code,
            email,
            mobile,
            address,
            city,
            state,
            country,
            pincode,
            website,
            logo,
            status,
            created_at,
            updated_at
        FROM companies
        ORDER BY id DESC
        `

    );

    res.status(200).json({

        success: true,

        companies

    });

}
catch (error) {

    console.error(
        "Get Companies Error:",
        error
    );

    res.status(500).json({

        success: false,

        message:
            "Unable to fetch companies."

    });

}


};

/* ==================================================
GET COMPANY BY ID
================================================== */

export const getCompanyById = async (req, res) => {


try {

    const { id } = req.params;

    const [companies] = await pool.execute(

        `
        SELECT
            id,
            company_name,
            company_code,
            email,
            mobile,
            address,
            city,
            state,
            country,
            pincode,
            website,
            logo,
            status,
            created_at,
            updated_at
        FROM companies
        WHERE id = ?
        `,

        [id]

    );

    if (companies.length === 0) {

        return res.status(404).json({

            success: false,

            message:
                "Company not found."

        });

    }

    res.status(200).json({

        success: true,

        company:
            companies[0]

    });

}
catch (error) {

    console.error(
        "Get Company Error:",
        error
    );

    res.status(500).json({

        success: false,

        message:
            "Unable to fetch company."

    });

}


};

/* ==================================================
CREATE COMPANY
================================================== */

export const createCompany = async (req, res) => {


try {

    const {

        company_name,

        company_code,

        email,

        mobile,

        address,

        city,

        state,

        country,

        pincode,

        website,

        logo,

        status

    } = req.body;


    /* ------------------------------
       REQUIRED FIELD VALIDATION
    ------------------------------ */

    if (

        !company_name?.trim() ||

        !company_code?.trim()

    ) {

        return res.status(400).json({

            success: false,

            message:
                "Company name and company code are required."

        });

    }


    /* ------------------------------
       CHECK DUPLICATE COMPANY CODE
    ------------------------------ */

    const [existingCompany] =
    await pool.execute(

        `
        SELECT id
        FROM companies
        WHERE company_code = ?
        `,

        [

            company_code
                .trim()
                .toUpperCase()

        ]

    );


    if (existingCompany.length > 0) {

        return res.status(409).json({

            success: false,

            message:
                "Company code already exists."

        });

    }


    /* ------------------------------
       INSERT COMPANY
    ------------------------------ */

    const [result] =
    await pool.execute(

        `
        INSERT INTO companies (

            company_name,

            company_code,

            email,

            mobile,

            address,

            city,

            state,

            country,

            pincode,

            website,

            logo,

            status

        )

        VALUES (

            ?, ?, ?, ?, ?, ?,
            ?, ?, ?, ?, ?, ?

        )
        `,

        [

            company_name.trim(),

            company_code
                .trim()
                .toUpperCase(),

            email?.trim() || null,

            mobile?.trim() || null,

            address?.trim() || null,

            city?.trim() || null,

            state?.trim() || null,

            country?.trim() || null,

            pincode?.trim() || null,

            website?.trim() || null,

            logo || null,

            status || "ACTIVE"

        ]

    );


    res.status(201).json({

        success: true,

        message:
            "Company created successfully.",

        companyId:
            result.insertId

    });

}
catch (error) {

    console.error(
        "Create Company Error:",
        error
    );


    /* MySQL duplicate error */

    if (

        error.code === "23505" ||
        error.code === "ER_DUP_ENTRY"

    ) {

        return res.status(409).json({

            success: false,

            message:
                "Company code already exists."

        });

    }


    res.status(500).json({

        success: false,

        message:
            "Unable to create company."

    });

}


};

/* ==================================================
UPDATE COMPANY
================================================== */

export const updateCompany = async (req, res) => {


try {

    const { id } = req.params;

    const {

        company_name,

        company_code,

        email,

        mobile,

        address,

        city,

        state,

        country,

        pincode,

        website,

        logo,

        status

    } = req.body;


    /* ------------------------------
       VALIDATE REQUIRED FIELDS
    ------------------------------ */

    if (

        !company_name?.trim() ||

        !company_code?.trim()

    ) {

        return res.status(400).json({

            success: false,

            message:
                "Company name and company code are required."

        });

    }


    /* ------------------------------
       CHECK COMPANY EXISTS
    ------------------------------ */

    const [companyExists] =
    await pool.execute(

        `
        SELECT id
        FROM companies
        WHERE id = ?
        `,

        [id]

    );


    if (

        companyExists.length === 0

    ) {

        return res.status(404).json({

            success: false,

            message:
                "Company not found."

        });

    }


    /* ------------------------------
       CHECK DUPLICATE CODE
    ------------------------------ */

    const [duplicateCode] =
    await pool.execute(

        `
        SELECT id
        FROM companies
        WHERE company_code = ?
        AND id != ?
        `,

        [

            company_code
                .trim()
                .toUpperCase(),

            id

        ]

    );


    if (

        duplicateCode.length > 0

    ) {

        return res.status(409).json({

            success: false,

            message:
                "Company code already belongs to another company."

        });

    }


    /* ------------------------------
       UPDATE COMPANY
    ------------------------------ */

    await pool.execute(

        `
        UPDATE companies

        SET

            company_name = ?,

            company_code = ?,

            email = ?,

            mobile = ?,

            address = ?,

            city = ?,

            state = ?,

            country = ?,

            pincode = ?,

            website = ?,

            logo = ?,

            status = ?

        WHERE id = ?
        `,

        [

            company_name.trim(),

            company_code
                .trim()
                .toUpperCase(),

            email?.trim() || null,

            mobile?.trim() || null,

            address?.trim() || null,

            city?.trim() || null,

            state?.trim() || null,

            country?.trim() || null,

            pincode?.trim() || null,

            website?.trim() || null,

            logo || null,

            status || "ACTIVE",

            id

        ]

    );


    res.status(200).json({

        success: true,

        message:
            "Company updated successfully."

    });

}
catch (error) {

    console.error(
        "Update Company Error:",
        error
    );


    if (

        error.code === "23505" ||
        error.code === "ER_DUP_ENTRY"

    ) {

        return res.status(409).json({

            success: false,

            message:
                "Company code already exists."

        });

    }


    res.status(500).json({

        success: false,

        message:
            "Unable to update company."

    });

}


};

/* ==================================================
DELETE COMPANY
================================================== */

export const deleteCompany = async (req, res) => {


try {

    const { id } = req.params;


    /* Do not allow deleting the first company */

    if (Number(id) === 1) {

        return res.status(400).json({

            success: false,

            message:
                "The primary company cannot be deleted."

        });

    }


    const [result] =
    await pool.execute(

        `
        DELETE FROM companies
        WHERE id = ?
        `,

        [id]

    );


    if (

        result.affectedRows === 0

    ) {

        return res.status(404).json({

            success: false,

            message:
                "Company not found."

        });

    }


    res.status(200).json({

        success: true,

        message:
            "Company deleted successfully."

    });

}
catch (error) {

    console.error(
        "Delete Company Error:",
        error
    );

    res.status(500).json({

        success: false,

        message:
            "Unable to delete company."

    });

}

};
