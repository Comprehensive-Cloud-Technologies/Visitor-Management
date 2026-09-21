import {
BrowserRouter,
Routes,
Route
}
from "react-router-dom";
import AddEmployee from "./pages/AddEmployee";
import EditEmployee from "./pages/employee/EditEmployee";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import EmployeeList from "./pages/employee/EmployeeList";
import MainLayout from "./layouts/MainLayout";
import ChangePassword from "./pages/ChangePassword";
import Profile from "./pages/Profile";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyOtp from "./pages/VerifyOtp";
import ResetPassword from "./pages/ResetPassword";
import EditRole from "./pages/roles/EditRole";
import AddRole from "./pages/roles/AddRole";
import RoleList from "./pages/roles/RoleList";
import RolePermission from "./pages/RolePermission";
import VisitorList from "./pages/visitors/VisitorList";
import AddVisitor from "./pages/visitors/AddVisitor";
import AddVisitorUiDemo from "./pages/visitors/AddVisitorUiDemo";
import ViewVisitor from "./pages/visitors/ViewVisitor";
import EditVisitor from "./pages/visitors/EditVisitor";
import PrintVisitorPass from "./pages/visitors/PrintVisitorPass";
import PublicHome from "./pages/public/PublicHome";
import VisitorRequest from "./pages/public/VisitorRequest";
import VisitorThankYou from "./pages/visitors/VisitorThankYou";
import SecurityScan from "./pages/security/components/SecurityScan";
import Settings from "./pages/Settings";
import CompanySettings from "./pages/CompanySettings";
import VisitorSettings from "./pages/VisitorSettings";
import SecurityDashboard from "./pages/security/SecurityDashboard";

function App(){

 return(

  <BrowserRouter>

   <Routes>

    <Route
      path="/"
      element={<Login />}
    />
  <Route
      path="/signup"
      element={<Signup />}
    />  
    <Route element={<MainLayout />}>

      <Route
       path="/dashboard"
       element={<Dashboard />}
      />

      <Route
       path="/employees"
       element={<EmployeeList />}
      />

      <Route
       path="/add-employee"
       element={<AddEmployee />}
      />

     
  <Route
      path="/visitors"
      element={<VisitorList/>}
    />
    </Route>
    <Route
      path="/roles"
      element={<RoleList/>}
    />
      <Route
       path="/role-permissions"
       element={<RolePermission />}
      />
    <Route
      path="/profile"
      element={<Profile />}
    />
    <Route
  path="/settings"
  element={<Settings />}
/>
<Route
  path="/company-settings"
  element={<CompanySettings />}
/>
<Route
  path="/visitor-settings"
  element={<VisitorSettings />}
/>
     <Route
      path="/visitor-thank-you"
      element={<VisitorThankYou/>}
    />
    <Route
      path="/change-password"
      element={<ChangePassword />}
    />
    <Route
      path="/forgot-password"
      element={<ForgotPassword />}
    />
    <Route
      path="/verify-otp"
      element={<VerifyOtp />}
    />
    <Route
      path="/reset-password"
      element={<ResetPassword />}
    />
    <Route
      path="/edit-employee/:id"
      element={<EditEmployee />}
    />
    
    <Route
      path="/edit-role/:id"
      element={<EditRole />}
    />
    <Route
      path="/add-role"
      element={<AddRole/>}
    />
  
    <Route
      path="/add-visitor"
      element={<AddVisitor/>}
    />
    <Route
      path="/add-visitor-ui-demo"
      element={<AddVisitorUiDemo/>}
    />
    <Route
      path="/view-visitor/:id"
      element={<ViewVisitor/>}
    />
    <Route
      path="/edit-visitor/:id"
      element={<EditVisitor/>}
    />
    <Route
      path="/print-visitor-pass/:id"
      element={<PrintVisitorPass/>}
    />
    <Route
      path="/public-home"
      element={<PublicHome/>}
    />
    <Route
      path="/visitor-request"
      element={<VisitorRequest/>}
    />
    <Route
  path="/security-scan/:id"
  element={<SecurityScan />}
/>
<Route
  path="/security-dashboard"
  element={<SecurityDashboard />}
/>

   </Routes>
  </BrowserRouter>

 );

}

export default App;