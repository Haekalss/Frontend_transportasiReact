import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route path="/" element={<UserDashboard />} />
          <Route path="/rutes" element={<RuteDashboard />} />
          <Route path="/kendaraans" element={<KendaraanDashboard />} />
          <Route path="/jadwals" element={<JadwalDashboard />} />
          <Route path="/jadwals/:id" element={<JadwalDetail />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/Kendaraans" element={<KendaraanCRUD />} />
          <Route path="/admin/Rutes" element={<RuteCRUD />} />
          <Route path="/admin/Jadwals" element={<JadwalCRUD />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
