import { useEffect, useState } from "react";
import { getAllJadwal, getAllRutes, getAllKendaraan } from "../services/api";
import Swal from 'sweetalert2';
import { Calendar, Search } from "lucide-react"; 
import JadwalDashboardStats from "../components/organisms/JadwalDashboardStats";
import JadwalDashboardTable from "../components/organisms/JadwalDashboardTable";

export default function JadwalDashboard() {
  const [jadwals, setJadwals] = useState([]);
  const [rutes, setRutes] = useState([]);
  const [filteredJadwals, setFilteredJadwals] = useState([]);
  
  // State untuk filter
  const [ruteInput, setRuteInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jadwalData, ruteData, kendaraanData] = await Promise.all([
          getAllJadwal(),
          getAllRutes(),
          getAllKendaraan(),
        ]);

        setRutes(ruteData);

        const ruteMap = ruteData.reduce((acc, r) => {
          acc[r._id] = r;
          return acc;
        }, {});
        
        const kendaraanMap = kendaraanData.reduce((acc, k) => {
          acc[k._id] = k;
          return acc;
        }, {});

        const jadwalGabung = jadwalData.map(j => {
            const ruteDetail = ruteMap[j.rute_id] || {};
            return {
                ...j,
                nama_rute: ruteDetail.nama_rute || "-",
                jenis_kendaraan: (kendaraanMap[j.kendaraan_id] || {}).jenis || "-",
                kode_rute: ruteDetail.kode_rute || "-",       
                jarak_km: ruteDetail.jarak_km || "-",
            }
        });

        setJadwals(jadwalGabung);
        setFilteredJadwals(jadwalGabung); // Inisialisasi data yang ditampilkan
      } catch (err) {
        console.error("Gagal ambil data jadwal:", err);
        Swal.fire({
          icon: 'error',
          title: 'Gagal Memuat Data',
          text: 'Tidak dapat mengambil data dari server. Pastikan Anda sudah login.',
        });
      }
    };

    fetchData();
  }, []);


  useEffect(() => {
    let dataTersaring = [...jadwals];

    // Filter berdasarkan rute yang dipilih
    if (ruteInput) {
      dataTersaring = dataTersaring.filter(j => j.nama_rute === ruteInput);
    }

    // Filter berdasarkan query pencarian teks
    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase();
      dataTersaring = dataTersaring.filter(j => 
        Object.values(j).some(val =>
          String(val).toLowerCase().includes(lowercasedQuery)
        )
      );
    }

    setFilteredJadwals(dataTersaring);
  }, [ruteInput, searchQuery, jadwals]);

  return (
    <div className="space-y-6 px-4 sm:px-6 md:px-8 pt-6 pb-9">
      <div className="flex items-center gap-3">
        <Calendar size={28} className="text-emerald-600" />
        <h2 className="text-2xl font-bold text-emerald-700">Dashboard Jadwal</h2>
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-2">
        <div className="min-w-[220px]">
          <JadwalDashboardStats jadwals={jadwals} />
        </div>
        
        {/* Gabungkan filter dan pencarian */}
        <div className="flex flex-col sm:flex-row items-center gap-2">
          {/* Input Pencarian Teks */}
          <div className="relative w-full sm:w-auto">
            <input
              type="text"
              placeholder="Cari jadwal..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border px-3 py-2 rounded-lg pl-10 w-full sm:w-56 bg-white shadow-sm"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          </div>

          {/* Filter Rute */}
          <select
            className="border px-3 py-2 rounded-lg w-full sm:w-auto bg-white shadow-sm"
            value={ruteInput}
            onChange={(e) => setRuteInput(e.target.value)}
          >
            <option value="">Semua Rute</option>
            {[...new Set(rutes.map(r => r.nama_rute))].map((nama, idx) => (
              <option key={idx} value={nama}>
                {nama}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabel sekarang selalu menampilkan `filteredJadwals` */}
      <JadwalDashboardTable jadwalList={filteredJadwals} />
    </div>
  );
}