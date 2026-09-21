import pool from "../config/db.js";

export const getDashboardStats =
async (req,res) => {

  try {

    /* EMPLOYEE COUNTS */

    const [totalEmployees] =
      await pool.execute(`
        SELECT COUNT(*) total
        FROM employees
      `);

    const [activeEmployees] =
      await pool.execute(`
        SELECT COUNT(*) total
        FROM employees
        WHERE status='Active'
      `);

    /* VISITOR COUNTS */

    const [checkedInVisitors] =
      await pool.execute(`
        SELECT COUNT(*) total
        FROM visitors
        WHERE status='Checked In'
      `);

    const [todayVisitors] =
      await pool.execute(`
        SELECT COUNT(*) total
        FROM visitors
        WHERE DATE(created_at)=CURDATE()
      `);

    /* RECENT VISITORS */

    const [recentVisitors] =
      await pool.execute(`
        SELECT
        id,
          visitor_name,
          visitor_photo,
          company_name,
          purpose,
          status
        FROM visitors
        ORDER BY id DESC
        LIMIT 5
      `);

    /* PURPOSE CHART */

    const [purposeStats] =
      await pool.execute(`
        SELECT
          purpose,
          COUNT(*) AS total
        FROM visitors
        GROUP BY purpose
      `);

    /* MONTHLY VISITORS CHART */
    /* STATUS CHART */

    const [statusStats] =
      await pool.execute(`
        SELECT
          status,
          COUNT(*) AS total
        FROM visitors
        GROUP BY status
      `);
    const [monthlyVisitors] =
      await pool.execute(`
        SELECT
          DATE_FORMAT(created_at,'%b') AS month,
          COUNT(*) AS total
        FROM visitors
        GROUP BY
          YEAR(created_at),
          MONTH(created_at),
          DATE_FORMAT(created_at,'%b')
        ORDER BY
          YEAR(created_at),
          MONTH(created_at)
      `);

    res.json({

      success:true,

      stats:{

        totalEmployees:
          totalEmployees[0].total,

        activeEmployees:
          activeEmployees[0].total,

        checkedInVisitors:
          checkedInVisitors[0].total,

        todayVisitors:
          todayVisitors[0].total

      },

      recentVisitors,

      purposeStats,
      statusStats,

      monthlyVisitors

    });

  }
  catch(error){

    console.log(error);

    res.status(500).json({

      success:false,

      message:
        "Failed to load dashboard"

    });

  }

};