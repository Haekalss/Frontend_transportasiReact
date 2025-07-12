import { useEffect, useState } from "react";
import { getAllRutes } from "../services/api";
import { Map as MapIcon } from "lucide-react";
import RuteDashboardStats from "../components/organisms/RuteDashboardStats";
import RuteDashboardTable from "../components/organisms/RuteDashboardTable";

export default function RuteDashboard() {
  const [rutes, setRutes] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllRutes();
        setRutes(data);
      } catch (err) {
        console.error("Gagal ambil data rute:", err);
        setError("Gagal memuat data. Pastikan Anda sudah login.");
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-6 px-4 sm:px-6 md:px-8 pt-6 pb-9">
      <div className="flex items-center gap-3">
        {/* Gunakan nama baru: MapIcon */}
        <MapIcon size={28} className="text-blue-600" />
        <h2 className="text-2xl font-bold text-blue-800">Dashboard Rute</h2>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded">{error}</div>
      )}

      <div className="min-w-[220px]">
        <RuteDashboardStats rutes={rutes} />
      </div>

      <RuteDashboardTable ruteList={rutes} />
    </div>
  );
}
