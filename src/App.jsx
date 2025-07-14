import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute, AdminRoute } from "./routes/AuthRoutes";

import LandingPage from "./pages/LandingPage";
import UserDashboard from "./pages/UserDashboard";
import RuteDashboard from "./pages/RuteDashboard";
import KendaraanDashboard from "./pages/KendaraanDashboard";
import JadwalDashboard from "./pages/JadwalDashboard";
import JadwalDetail from "./pages/JadwalDetail";
import AdminDashboard from "./pages/AdminDashboard";
import KendaraanCRUD from "./pages/admin/MinKendaraan";
import RuteCRUD from "./pages/admin/MinRute";
import JadwalCRUD from "./pages/admin/MinJadwal";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

function App() {
  const isAuthenticated = localStorage.getItem('token');

  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Routes>
           {/* == RUTE PUBLIK == */}
          <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

           {/* == RUTE PENGGUNA TERDAFTAR == */}
          <Route path="/dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
          <Route path="/rutes" element={<ProtectedRoute><RuteDashboard /></ProtectedRoute>} />
          <Route path="/kendaraans" element={<ProtectedRoute><KendaraanDashboard /></ProtectedRoute>} />
          <Route path="/jadwals" element={<ProtectedRoute><JadwalDashboard /></ProtectedRoute>} />
          <Route path="/jadwals/:id" element={<ProtectedRoute><JadwalDetail /></ProtectedRoute>} />

          {/* == RUTE KHUSUS ADMIN == */}
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/Kendaraans" element={<AdminRoute><KendaraanCRUD /></AdminRoute>} />
          <Route path="/admin/Rutes" element={<AdminRoute><RuteCRUD /></AdminRoute>} />
          <Route path="/admin/Jadwals" element={<AdminRoute><JadwalCRUD /></AdminRoute>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
