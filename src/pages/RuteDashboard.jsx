import { useEffect, useState } from "react";
import { getAllRutes } from "../services/api";
import { Map as MapIcon, Search } from "lucide-react";
import RuteDashboardStats from "../components/organisms/RuteDashboardStats";
import RuteDashboardTable from "../components/organisms/RuteDashboardTable";
import Swal from 'sweetalert2';

export default function RuteDashboard() {
  const [rutes, setRutes] = useState([]);
  const [filteredRutes, setFilteredRutes] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllRutes();
        setRutes(data);
        setFilteredRutes(data);
      } catch (err) {
        console.error("Gagal ambil data rute:", err);
        Swal.fire({
          icon: 'error',
          title: 'Gagal Memuat Data',
          text: 'Tidak dapat mengambil data rute. Pastikan Anda sudah login.',
          confirmButtonText: 'OK'
        });
      }
    };

    fetchData();
  }, []);

  // Hook untuk filter data secara real-time
  useEffect(() => {
    const lowercasedQuery = searchQuery.toLowerCase();
    const filtered = rutes.filter(rute => {
      // Mencocokkan query dengan semua nilai dalam objek rute
      return Object.values(rute).some(val =>
        String(val).toLowerCase().includes(lowercasedQuery)
      );
    });
    setFilteredRutes(filtered);
  }, [searchQuery, rutes]);

  return (
    <div className="space-y-6 px-4 sm:px-6 md:px-8 pt-6 pb-9">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <MapIcon size={28} className="text-blue-600" />
          <h2 className="text-2xl font-bold text-blue-800">Dashboard Rute</h2>
        </div>
        {/* Input Pencarian */}
        <div className="relative">
          <input
            type="text"
            placeholder="Cari rute..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border px-3 py-2 rounded-lg pl-10 w-full sm:w-64 bg-white shadow-sm"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        </div>
      </div>

      <div className="min-w-[220px]">
        <RuteDashboardStats rutes={rutes} />
      </div>

      {/* Gunakan filteredRutes untuk menampilkan data */}
      <RuteDashboardTable ruteList={filteredRutes} />
    </div>
  );
}