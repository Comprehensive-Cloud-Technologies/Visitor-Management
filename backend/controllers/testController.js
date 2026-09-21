    import pool from "../config/db.js";
import path from "path";
import { generateVisitorPass } from "../services/pdfService.js";
import process from "process";
export const testVisitorPass = async (req, res) => {

    try {

        const { id } = req.params;

        const [[visitor]] = await pool.execute(
            "SELECT * FROM visitors WHERE id=?",
            [id]
        );

        if (!visitor) {
            return res.status(404).json({
                success: false,
                message: "Visitor not found"
            });
        }

        const [[company]] = await pool.execute(
            "SELECT * FROM company_settings LIMIT 1"
        );

        const qrPath = path.join(
            process.cwd(),
            "uploads",
            `visitor-${id}.png`
        );

        const pdfPath = await generateVisitorPass(
            visitor,
            qrPath,
            company
        );

     res.setHeader("Content-Type", "application/pdf");
res.setHeader("Content-Disposition", "inline");

return res.sendFile(pdfPath);

    } catch (error) {

        console.log(error);

        res.status(500).json(error);

    }

};