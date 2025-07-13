import { useEffect, useState, useCallback } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Home, Map as MapIcon, BusFront, Calendar, LogOut, Menu, X } from "lucide-react";
import Swal from 'sweetalert2';
import { getAllRutes, getAllKendaraan, getAllJadwal } from "../services/api";

const menuItems = [
  { name: "Dashboard", path: "/", icon: <Home size={18} /> },
  { name: "Rute", path: "/rutes", icon: <MapIcon size={18} /> },
  { name: "Kendaraan", path: "/kendaraans", icon: <BusFront size={18} /> },
  { name: "Jadwal", path: "/jadwals", icon: <Calendar size={18} /> },
];

export default function UserDashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // State untuk sidebar responsif
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const currentPage = menuItems.find((m) => location.pathname.startsWith(m.path))?.name || "Dashboard Pengguna";

  const [ruteCount, setRuteCount] = useState(0);
  const [kendaraanCount, setKendaraanCount] = useState(0);
  const [jadwalCount, setJadwalCount] = useState(0);

  const handleLogout = () => {
    Swal.fire({
      title: 'Anda yakin ingin keluar?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, keluar!',
      cancelButtonText: 'Batal'
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/login');
      }
    });
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [ruteData, kendaraanData, jadwalData] = await Promise.all([
          getAllRutes(),
          getAllKendaraan(),
          getAllJadwal(),
        ]);
        setRuteCount(Array.isArray(ruteData) ? ruteData.length : 0);
        const arrKendaraan = Array.isArray(kendaraanData) ? kendaraanData : [];
        const aktif = arrKendaraan.filter(k => (k.status || "").toLowerCase() === "aktif");
        setKendaraanCount(aktif.length);
        setJadwalCount(Array.isArray(jadwalData) ? jadwalData.length : 0);
      } catch (error) {
        console.error("Gagal memuat data dashboard:", error);
        setRuteCount(0);
        setKendaraanCount(0);
        setJadwalCount(0);
      }
    };
    if (location.pathname === "/") {
        fetchDashboardData();
    }
  }, [location.pathname]);

  // Efek untuk menutup sidebar saat berpindah halaman di mode mobile
  useEffect(() => {
    if (isSidebarOpen) {
      setIsSidebarOpen(false);
    }
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Overlay untuk latar belakang gelap saat sidebar mobile terbuka */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-xl p-4 flex flex-col transform transition-transform duration-300 md:relative md:translate-x-0 
                   ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-blue-600">🚍 TransGo</h2>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-gray-500 hover:text-gray-800">
            <X size={24} />
          </button>
        </div>
        
        <div className="flex-grow">
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-blue-50 transition ${
                  location.pathname === item.path ? "bg-blue-100 text-blue-700 font-semibold" : "text-gray-700"
                }`}
              >
                {item.icon} {item.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-auto">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-2 rounded-xl text-red-700 hover:bg-red-50 transition font-semibold"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* Konten Utama */}
      <main className="flex-1 p-6">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">{currentPage}</h1>
          {/* Tombol Hamburger untuk Mobile */}
          <button onClick={() => setIsSidebarOpen(true)} className="md:hidden p-2 rounded-md hover:bg-gray-100">
            <Menu size={24} className="text-gray-700" />
          </button>
        </header>
        
        {location.pathname === "/" ? (
          <div>
            <section className="mb-8">
              <div className="bg-blue-100 rounded-xl p-6 flex items-center gap-4">
                <div className="text-4xl">👋</div>
                <div>
                  <h2 className="text-xl font-bold text-blue-700 mb-1">Selamat Datang di TransGo!</h2>
                  <p className="text-gray-700">Nikmati kemudahan akses informasi rute, kendaraan, dan jadwal transportasi umum di kota Anda.</p>
                </div>
              </div>
            </section>
            <section className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow p-5 flex flex-col items-center">
                <div className="bg-blue-200 rounded-full p-3 mb-2"><MapIcon size={28} className="text-blue-600" /></div>
                <div className="text-2xl font-bold text-blue-700">{ruteCount}</div>
                <div className="text-gray-600">Total Rute</div>
              </div>
              <div className="bg-white rounded-xl shadow p-5 flex flex-col items-center">
                <div className="bg-green-200 rounded-full p-3 mb-2"><BusFront size={28} className="text-green-600" /></div>
                <div className="text-2xl font-bold text-green-700">{kendaraanCount}</div>
                <div className="text-gray-600">Kendaraan Aktif</div>
              </div>
              <div className="bg-white rounded-xl shadow p-5 flex flex-col items-center">
                <div className="bg-yellow-200 rounded-full p-3 mb-2"><Calendar size={28} className="text-yellow-600" /></div>
                <div className="text-2xl font-bold text-yellow-700">{jadwalCount}</div>
                <div className="text-gray-600">Total Jadwal</div>
              </div>
            </section>
            <section>
              <h3 className="text-lg font-semibold mb-2 text-gray-800">Info Layanan</h3>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>Update rute dan jadwal setiap hari.</li>
                <li>Layanan pelanggan 24 jam melalui aplikasi.</li>
                <li>Ikuti kami di media sosial untuk info terbaru.</li>
              </ul>
            </section>
          </div>
        ) : (
          <Outlet />
        )}
      </main>
    </div>
  );
}