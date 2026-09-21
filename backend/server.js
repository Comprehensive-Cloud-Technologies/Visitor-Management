import dotenv from "dotenv";
import app from "./app.js";
import process from "process";
import { fileURLToPath } from "node:url";

import dashboardRoutes from "./routes/dashboardRoutes.js";
import employeeRoutes from "./routes/employeeRoutes.js";
import roleRoutes from "./routes/roleRoutes.js";
import rolePermissionRoutes from "./routes/rolePermissionRoutes.js";
import visitorRoutes from "./routes/visitorRoutes.js";
import companySettingsRoutes from "./routes/companySettingsRoutes.js";
dotenv.config({
  path: fileURLToPath(
    new URL("./.env", import.meta.url)
  )
});

app.use("/api/dashboard", dashboardRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/role-permissions", rolePermissionRoutes);
app.use("/api/visitors", visitorRoutes);
app.use("/api/company-settings", companySettingsRoutes);
import { initializeSocket } from "./socket.js";

const server = app.listen(
  process.env.PORT,
  () => {
    console.log(
      `Server Running on ${process.env.PORT}`
    );
  }
);

initializeSocket(server);



