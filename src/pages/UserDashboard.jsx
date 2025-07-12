import { Link, Outlet, useLocation } from "react-router-dom";
import { Home, Map as MapIcon, BusFront, Calendar } from "lucide-react"; 
import { useEffect, useState } from "react";

import { getAllRutes, getAllKendaraan, getAllJadwal } from "../services/api";

const menu = [
  { name: "Dashboard", path: "/", icon: <Home size={18} /> },
  { name: "Rute", path: "/rutes", icon: <MapIcon size={18} /> },
  { name: "Kendaraan", path: "/kendaraans", icon: <BusFront size={18} /> },
  { name: "Jadwal", path: "/jadwals", icon: <Calendar size={18} /> },
];

export default function UserLayout() {
  const location = useLocation();
  const currentPage = menu.find((m) => location.pathname.startsWith(m.path))?.name || "Dashboard Pengguna";

  const [ruteCount, setRuteCount] = useState(0);
  const [kendaraanCount, setKendaraanCount] = useState(0);
  const [jadwalCount, setJadwalCount] = useState(0);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Gunakan Promise.all dengan fungsi dari api.js
        const [ruteData, kendaraanData, jadwalData] = await Promise.all([
          getAllRutes(),
          getAllKendaraan(),
          getAllJadwal(),
        ]);

        // Hitung total rute
        setRuteCount(Array.isArray(ruteData) ? ruteData.length : 0);

        // Hitung kendaraan aktif
        const arrKendaraan = Array.isArray(kendaraanData) ? kendaraanData : [];
        const aktif = arrKendaraan.filter(k => (k.status || "").toLowerCase() === "aktif");
        setKendaraanCount(aktif.length);

        // Hitung total jadwal
        setJadwalCount(Array.isArray(jadwalData) ? jadwalData.length : 0);

      } catch (error) {
        console.error("Gagal memuat data dashboard:", error);
        // Set semua count ke 0 jika ada error
        setRuteCount(0);
        setKendaraanCount(0);
        setJadwalCount(0);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-64 bg-white shadow-xl p-4">
        <h2 className="text-2xl font-bold text-blue-600 mb-6">🚍 TransGo</h2>
        <nav className="space-y-2">
          {menu.map((item) => (
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
      </aside>

      <main className="flex-1 p-6">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">{currentPage}</h1>
        </header>
        
        {/* Tampilkan konten dashboard hanya jika di path "/" */}
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
          // Jika bukan di path "/", tampilkan konten dari rute anak
          <Outlet />
        )}
      </main>
    </div>
  );
}
