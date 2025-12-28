import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import HRDashboard from "./pages/hr/HRDashboard";
import EmployeeDashboard from "./pages/employee/EmployeeDashboard";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* HR Dashboard */}
        <Route
          path="/hr"
          element={
            <ProtectedRoute role="HR">
              <HRDashboard />
            </ProtectedRoute>
          }
        />

        {/* Employee Dashboard */}
        <Route
          path="/employee"
          element={
            <ProtectedRoute role="EMPLOYEE">
              <EmployeeDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
