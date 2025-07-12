import { Wrench, BusFront, Map as MapIcon, Calendar } from "lucide-react"; 
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAllRutes, getAllKendaraan, getAllJadwal } from "../services/api";

export default function AdminDashboard() {
  const menu = [
    {
      icon: <BusFront size={32} className="text-green-600" />,
      label: "Manajemen Kendaraan",
      to: "/admin/kendaraans",
      bg: "bg-green-50"
    },
    {
      icon: <MapIcon size={32} className="text-blue-600" />,
      label: "Manajemen Rute",
      to: "/admin/rutes",
      bg: "bg-blue-50"
    },
    {
      icon: <Calendar size={32} className="text-emerald-600" />,
      label: "Manajemen Jadwal",
      to: "/admin/jadwals",
      bg: "bg-emerald-50"
    }
  ];

  const [ruteCount, setRuteCount] = useState(0);
  const [kendaraanCount, setKendaraanCount] = useState(0);
  const [jadwalCount, setJadwalCount] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
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
        console.error("Gagal memuat data statistik admin:", error);
        // Set semua count ke 0 jika ada error
        setRuteCount(0);
        setKendaraanCount(0);
        setJadwalCount(0);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-6 px-4 sm:px-6 md:px-8 pt-6 pb-8">
      <div className="flex items-center gap-3 mb-2">
        <Wrench size={28} className="text-gray-700" />
        <h2 className="text-2xl font-bold text-gray-800">Admin Panel</h2>
      </div>
      <div className="bg-gray-100 rounded-xl p-5 flex items-center gap-4 mb-4">
        <div className="text-4xl">🛠️</div>
        <div>
          <h3 className="text-lg font-bold text-gray-700 mb-1">Selamat datang, Admin!</h3>
          <p className="text-gray-600">
            Kelola data transportasi kota dengan mudah. Pantau statistik, update data, dan pastikan layanan berjalan lancar.
          </p>
        </div>
      </div>

      {/* Statistik */}
      <section className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow p-5 flex flex-col items-center border-t-4 border-blue-500">
          <div className="bg-blue-200 rounded-full p-3 mb-2"><MapIcon size={28} className="text-blue-600" /></div>
          <div className="text-2xl font-bold text-blue-700">{ruteCount}</div>
          <div className="text-gray-600">Total Rute</div>
        </div>
        <div className="bg-white rounded-xl shadow p-5 flex flex-col items-center border-t-4 border-green-500">
          <div className="bg-green-200 rounded-full p-3 mb-2"><BusFront size={28} className="text-green-600" /></div>
          <div className="text-2xl font-bold text-green-700">{kendaraanCount}</div>
          <div className="text-gray-600">Kendaraan Aktif</div>
        </div>
        <div className="bg-white rounded-xl shadow p-5 flex flex-col items-center border-t-4 border-yellow-400">
          <div className="bg-yellow-200 rounded-full p-3 mb-2"><Calendar size={28} className="text-yellow-600" /></div>
          <div className="text-2xl font-bold text-yellow-700">{jadwalCount}</div>
          <div className="text-gray-600">Total Jadwal</div>
        </div>
      </section>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {menu.map((item, index) => (
          <Link
            key={index}
            to={item.to}
            className={`rounded-2xl shadow-md p-6 transition hover:shadow-lg ${item.bg}`}
          >
            <div className="flex items-center gap-4">
              {item.icon}
              <div>
                <p className="text-lg font-semibold text-gray-700">{item.label}</p>
                <p className="text-sm text-gray-500">Kelola data {item.label.toLowerCase()}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <section className="mt-8">
        <h4 className="font-semibold text-gray-700 mb-2">Tips Admin</h4>
        <ul className="list-disc pl-6 text-gray-600 space-y-1 text-sm">
          <li>Pastikan data kendaraan dan rute selalu terupdate.</li>
          <li>Periksa jadwal secara berkala untuk menghindari bentrok.</li>
          <li>Gunakan fitur pencarian untuk mempercepat manajemen data.</li>
        </ul>
      </section>
    </div>
  );
}
