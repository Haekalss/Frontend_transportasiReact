import { useEffect, useState } from "react";
import { getAllKendaraan } from "../services/api"; 

import { BusFront } from "lucide-react";
import KendaraanDashboardStats from "../components/organisms/KendaraanDashboardStats";
import KendaraanDashboardTable from "../components/organisms/KendaraanDashboardTable";

export default function KendaraanDashboard() {
  const [kendaraan, setKendaraan] = useState([]);
  const [error, setError] = useState(null); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllKendaraan();

        // Pastikan field kapasitas selalu ada
        const kendaraanDenganKapasitas = data.map(k => ({
          ...k,
          kapasitas: k.kapasitas || "Tidak diketahui",
        }));

        setKendaraan(kendaraanDenganKapasitas);
      } catch (err) {
        console.error("Gagal ambil data:", err);
        setError("Gagal memuat data. Pastikan Anda sudah login.");
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-6 px-4 sm:px-6 md:px-8 pt-6 pb-9">
      <div className="flex items-center gap-3">
        <BusFront size={28} className="text-green-600" />
        <h2 className="text-2xl font-bold text-green-800">Dashboard Kendaraan</h2>
      </div>

      {/* Tampilkan pesan error jika ada */}
      {error && <div className="bg-red-100 text-red-700 p-3 rounded">{error}</div>}

      <KendaraanDashboardStats kendaraan={kendaraan} />
      <KendaraanDashboardTable kendaraanList={kendaraan} />
    </div>
  );
}
