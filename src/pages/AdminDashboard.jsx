import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllRutes, getAllKendaraan, getAllJadwal, logout } from "../services/api";

import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

import { Wrench, BusFront, Map as MapIcon, Calendar, LogOut } from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function AdminDashboard() {
  // State untuk data statistik dan chart
  const [stats, setStats] = useState({
    ruteCount: 0,
    kendaraanCount: 0,
    jadwalCount: 0,
  });
  const [vehicleStatusData, setVehicleStatusData] = useState(null);
  const [routeOriginData, setRouteOriginData] = useState(null);

  const menu = [
    {
      icon: <BusFront size={32} className="text-green-600" />,
      label: "Manajemen Kendaraan",
      to: "/admin/kendaraans",
      bg: "bg-green-50",
    },
    {
      icon: <MapIcon size={32} className="text-blue-600" />,
      label: "Manajemen Rute",
      to: "/admin/rutes",
      bg: "bg-blue-50",
    },
    {
      icon: <Calendar size={32} className="text-emerald-600" />,
      label: "Manajemen Jadwal",
      to: "/admin/jadwals",
      bg: "bg-emerald-50",
    },
  ];

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [ruteData, kendaraanData, jadwalData] = await Promise.all([
          getAllRutes(),
          getAllKendaraan(),
          getAllJadwal(),
        ]);

        // --- Proses Data untuk Statistik Angka ---
        const aktifKendaraan = kendaraanData.filter(
          (k) => k.status === "Aktif"
        ).length;
        setStats({
          ruteCount: ruteData.length,
          kendaraanCount: aktifKendaraan,
          jadwalCount: jadwalData.length,
        });

        // --- Proses Data untuk Chart Status Kendaraan (Doughnut Chart) ---
        const nonaktifCount = kendaraanData.length - aktifKendaraan;
        setVehicleStatusData({
          labels: ["Aktif", "Nonaktif"],
          datasets: [
            {
              label: "Jumlah Kendaraan",
              data: [aktifKendaraan, nonaktifCount],
              backgroundColor: [
                "rgba(34, 197, 94, 0.6)",
                "rgba(239, 68, 68, 0.6)",
              ],
              borderColor: ["rgba(22, 163, 74, 1)", "rgba(220, 38, 38, 1)"],
              borderWidth: 1,
            },
          ],
        });

        // --- Proses Data untuk Chart Asal Rute (Bar Chart) ---
        const origins = ruteData.reduce((acc, rute) => {
          acc[rute.asal] = (acc[rute.asal] || 0) + 1;
          return acc;
        }, {});
        setRouteOriginData({
          labels: Object.keys(origins),
          datasets: [
            {
              label: "Jumlah Rute per Kota Asal",
              data: Object.values(origins),
              backgroundColor: "rgba(59, 130, 246, 0.6)",
              borderColor: "rgba(59, 130, 246, 1)",
              borderWidth: 1,
            },
          ],
        });
      } catch (error) {
        console.error("Gagal memuat data statistik admin:", error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-8 px-4 sm:px-6 md:px-8 pt-6 pb-8">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <Wrench size={28} className="text-gray-700" />
          <h2 className="text-2xl font-bold text-gray-800">Admin Panel</h2>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>

      <div className="bg-gray-100 rounded-xl p-5 flex items-center gap-4 mb-4">
        <div className="text-4xl">🛠️</div>
        <div>
          <h3 className="text-lg font-bold text-gray-700 mb-1">
            Selamat datang, Admin!
          </h3>
          <p className="text-gray-600">
            Kelola data transportasi kota dengan mudah. Pantau statistik, update
            data, dan pastikan layanan berjalan lancar.
          </p>
        </div>
      </div>
      

      {/* Statistik Angka */}
      <section className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow p-5 flex flex-col items-center border-t-4 border-blue-500">
          <div className="bg-blue-200 rounded-full p-3 mb-2">
            <MapIcon size={28} className="text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-blue-700">
            {stats.ruteCount}
          </div>
          <div className="text-gray-600">Total Rute</div>
        </div>
        <div className="bg-white rounded-xl shadow p-5 flex flex-col items-center border-t-4 border-green-500">
          <div className="bg-green-200 rounded-full p-3 mb-2">
            <BusFront size={28} className="text-green-600" />
          </div>
          <div className="text-2xl font-bold text-green-700">
            {stats.kendaraanCount}
          </div>
          <div className="text-gray-600">Kendaraan Aktif</div>
        </div>
        <div className="bg-white rounded-xl shadow p-5 flex flex-col items-center border-t-4 border-yellow-400">
          <div className="bg-yellow-200 rounded-full p-3 mb-2">
            <Calendar size={28} className="text-yellow-600" />
          </div>
          <div className="text-2xl font-bold text-yellow-700">
            {stats.jadwalCount}
          </div>
          <div className="text-gray-600">Total Jadwal</div>
        </div>
      </section>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8">
        {menu.map((item, index) => (
          <Link
            key={index}
            to={item.to}
            className={`rounded-2xl shadow-md p-6 transition hover:shadow-lg ${item.bg}`}
          >
            <div className="flex items-center gap-4">
              {item.icon}
              <div>
                <p className="text-lg font-semibold text-gray-700">
                  {item.label}
                </p>
                <p className="text-sm text-gray-500">
                  Kelola data {item.label.toLowerCase()}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Menampilkan Visualisasi Data */}
      <section className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Chart Status Kendaraan */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow p-6">
          <h3 className="font-semibold text-gray-700 mb-4">Status Kendaraan</h3>
          {vehicleStatusData ? (
            <Doughnut
              data={vehicleStatusData}
              options={{
                responsive: true,
                plugins: { legend: { position: "bottom" } },
              }}
            />
          ) : (
            <p>Memuat data chart...</p>
          )}
        </div>

        {/* Chart Asal Rute */}
        <div className="lg:col-span-3 bg-white rounded-xl shadow p-6">
          <h3 className="font-semibold text-gray-700 mb-4">
            Distribusi Rute Berdasarkan Asal
          </h3>
          {routeOriginData ? (
            <Bar
              data={routeOriginData}
              options={{
                responsive: true,
                plugins: { legend: { display: false } },
              }}
            />
          ) : (
            <p>Memuat data chart...</p>
          )}
        </div>
      </section>
    </div>
  );
}
