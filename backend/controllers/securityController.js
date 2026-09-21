import pool from "../config/db.js";

/*
==========================================
SEARCH VISITOR
==========================================
Supports:
1. Visitor ID
2. VIS-00025
3. Mobile Number
4. Visitor Name
==========================================
*/

export const searchVisitor = async (req, res) => {

    try {

        let { keyword } = req.params;

        keyword = keyword.trim();

        // Convert VIS-00025 -> 25
        if (keyword.toUpperCase().startsWith("VIS-")) {

            keyword = parseInt(
                keyword.replace("VIS-", ""),
                10
            );

        }

       const [visitor] =
await pool.execute(

    `
    SELECT

        v.*,

        e.employee_name,
        e.department,
        e.designation

    FROM visitors v

    LEFT JOIN employees e

        ON v.employee_id = e.id

    WHERE

        (
            v.id = ?
            OR v.mobile = ?
            OR v.visitor_name LIKE ?
        )

        AND
        (
            v.status = 'APPROVED'
            OR v.status = 'CHECKED IN'
            OR v.status = 'CHECKED OUT'
        )

    LIMIT 1
    `,
    [

        keyword,

        keyword,

        `%${keyword}%`

    ]

);
        if (visitor.length === 0) {

    return res.status(404).json({

        success: false,

        message: "Visitor not approved or does not exist."

    });

}

        res.json({

            success: true,

            visitor: visitor[0]

        });

    }

    catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,

            message: "Server Error"

        });

    }

};