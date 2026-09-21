import express from "express";
import cors from "cors";
import pool from "./config/db.js";

import employeeRoutes from "./routes/employeeRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import passwordRoutes from "./routes/passwordRoutes.js";
import roleRoutes from "./routes/roleRoutes.js";
import rolePermissionRoutes from "./routes/rolePermissionRoutes.js";
import visitorRoutes from "./routes/visitorRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import companySettingsRoutes from "./routes/companySettingsRoutes.js";
import securityRoutes from "./routes/securityRoutes.js";
import testRoutes from "./routes/testRoutes.js";
import companyRoutes from "./routes/companyRoutes.js";
const app = express();

app.use(cors());
app.use(
  express.json({
    limit: "30mb"
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "30mb"
  })
);

app.use("/api/auth", authRoutes);

app.use(
  "/api/employees",
  employeeRoutes
);
app.use(
    "/api/companies",
    companyRoutes
);
app.use("/api/users", userRoutes);
app.use("/api/password", passwordRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/role-permissions", rolePermissionRoutes);
app.use("/api/visitors", visitorRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/company-settings", companySettingsRoutes);
app.use("/api/security", securityRoutes);
app.use("/api/test", testRoutes);

app.get("/api/health", async (req, res) => {
  try {
    const [rows] = await pool.execute(
      "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name"
    );
    res.json({ ok: true, tables: rows.map(r => r.table_name) });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

export default app;