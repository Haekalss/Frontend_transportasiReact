import { useEffect, useState } from "react";
import { getAllKendaraan } from "../services/api";
import Swal from 'sweetalert2';
import { BusFront, Search } from "lucide-react";
import KendaraanDashboardStats from "../components/organisms/KendaraanDashboardStats";
import KendaraanDashboardTable from "../components/organisms/KendaraanDashboardTable";

export default function KendaraanDashboard() {
  const [kendaraan, setKendaraan] = useState([]);
  const [filteredKendaraan, setFilteredKendaraan] = useState([]); 
  const [searchQuery, setSearchQuery] = useState(""); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllKendaraan();
        const kendaraanDenganKapasitas = data.map(k => ({
          ...k,
          kapasitas: k.kapasitas || "Tidak diketahui",
        }));
        setKendaraan(kendaraanDenganKapasitas);
        setFilteredKendaraan(kendaraanDenganKapasitas); 
      } catch (err) {
        console.error("Gagal ambil data:", err);
        Swal.fire({
            icon: 'error',
            title: 'Gagal Memuat Data',
            text: 'Tidak dapat mengambil data kendaraan. Pastikan Anda sudah login.',
        });
      }
    };

    fetchData();
  }, []);

  
  useEffect(() => {
    const lowercasedQuery = searchQuery.toLowerCase();
    const filtered = kendaraan.filter(k => {
      // Mencocokkan query dengan setiap properti dalam objek kendaraan
      return Object.values(k).some(val =>
        String(val).toLowerCase().includes(lowercasedQuery)
      );
    });
    setFilteredKendaraan(filtered);
  }, [searchQuery, kendaraan]);

  return (
    <div className="space-y-6 px-4 sm:px-6 md:px-8 pt-6 pb-9">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <BusFront size={28} className="text-green-600" />
          <h2 className="text-2xl font-bold text-green-800">Dashboard Kendaraan</h2>
        </div>
        {/* Input Pencarian */}
        <div className="relative">
          <input
            type="text"
            placeholder="Cari kendaraan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border px-3 py-2 rounded-lg pl-10 w-full sm:w-64 bg-white shadow-sm"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        </div>
      </div>

      <KendaraanDashboardStats kendaraan={kendaraan} />
      {/* Gunakan filteredKendaraan untuk menampilkan data */}
      <KendaraanDashboardTable kendaraanList={filteredKendaraan} />
    </div>
  );
}