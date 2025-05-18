import { useEffect, useState } from "react";
import axios from "axios";
import { Calendar } from "lucide-react";
import JadwalDashboardStats from "../components/organisms/JadwalDashboardStats";
import JadwalDashboardTable from "../components/organisms/JadwalDashboardTable";

export default function JadwalDashboard() {
  const [jadwals, setJadwals] = useState([]);
  const [rutes, setRutes] = useState([]); // Tambah state rute
  const [ruteInput, setRuteInput] = useState(""); // State input select
  const [filteredJadwals, setFilteredJadwals] = useState([]); // State hasil filter

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jadwalRes, ruteRes, kendaraanRes] = await Promise.all([
          axios.get("http://localhost:8088/api/jadwals"),
          axios.get("http://localhost:8088/api/rutes"),
          axios.get("http://localhost:8088/api/kendaraans"),
        ]);

        setRutes(ruteRes.data); // Simpan data rute

        const ruteMap = {};
        ruteRes.data.forEach(r => {
          ruteMap[r._id] = r.nama_rute;
        });

        const kendaraanMap = {};
        kendaraanRes.data.forEach(k => {
          kendaraanMap[k._id] = k.jenis;
        });

        const jadwalGabung = jadwalRes.data.map(j => ({
          ...j,
          nama_rute: ruteMap[j.rute_id] || "-",
          jenis_kendaraan: kendaraanMap[j.kendaraan_id] || "-",
          kode_rute: j.rute?.kode_rute || "-",      
          jarak_km: j.rute?.jarak_km || "-",       
        }));

        setJadwals(jadwalGabung);
      } catch (err) {
        console.error("Gagal ambil data jadwal:", err);
      }
    };

    fetchData();
  }, []);

  // Handler select rute
  const handleSelectRute = (e) => {
    setRuteInput(e.target.value);
    setFilteredJadwals([]); // Reset hasil filter saat ganti pilihan
  };

  // Handler tombol cari
  const handleCariJadwal = () => {
    if (!ruteInput) {
      setFilteredJadwals([]);
      return;
    }
    const filtered = jadwals.filter(j => j.nama_rute === ruteInput);
    setFilteredJadwals(filtered);
  };

  return (
    <div className="space-y-6 px-4 sm:px-6 md:px-8 pt-6 pb-9">
      <div className="flex items-center gap-3">
        <Calendar size={28} className="text-emerald-600" />
        <h2 className="text-2xl font-bold text-emerald-700">Dashboard Jadwal</h2>
      </div>

      {/* Baris: Stats & Pencarian */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-2">
        <div className="min-w-[220px]">
          <JadwalDashboardStats jadwals={jadwals} />
        </div>
        <div className="flex items-center gap-2">
          <select
            className="border px-2 py-1 rounded"
            value={ruteInput}
            onChange={handleSelectRute}
          >
            <option value="">Pilih Nama Rute</option>
            {[...new Set(rutes.map(r => r.nama_rute))].map((nama, idx) => (
              <option key={idx} value={nama}>
                {nama}
              </option>
            ))}
          </select>
          <button
            className="px-4 py-2 bg-emerald-500 text-white rounded"
            onClick={handleCariJadwal}
          >
            Cari Jadwal
          </button>
        </div>
      </div>

      {/* Table */}
      <JadwalDashboardTable jadwalList={filteredJadwals.length > 0 ? filteredJadwals : jadwals} />
    </div>
  );
}
