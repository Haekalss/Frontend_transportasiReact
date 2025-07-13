import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getJadwalById, getRuteById, getKendaraanById } from "../services/api";
import Swal from "sweetalert2";

export default function JadwalDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [jadwal, setJadwal] = useState(null);
  const [rute, setRute] = useState(null);
  const [kendaraan, setKendaraan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const jadwalData = await getJadwalById(id);
        setJadwal(jadwalData);

        // Pastikan ada rute_id dan kendaraan_id sebelum fetching
        if (jadwalData.rute_id) {
          const ruteData = await getRuteById(jadwalData.rute_id);
          setRute(ruteData);
        }
        if (jadwalData.kendaraan_id) {
          const kendaraanData = await getKendaraanById(jadwalData.kendaraan_id);
          setKendaraan(kendaraanData);
        }
      } catch (err) {
        console.error("Gagal mengambil detail jadwal:", err);
        Swal.fire({
          icon: 'error',
          title: 'Data Tidak Ditemukan',
          text: 'Detail jadwal yang Anda cari tidak dapat ditemukan.',
          confirmButtonText: 'Kembali ke Dashboard'
        }).then(() => {
          navigate('/jadwals'); // Arahkan kembali ke halaman jadwal
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  // Jika loading selesai dan tidak ada data (karena error sudah ditangani Swal)
  if (!jadwal) {
    return null; // Tidak menampilkan apa-apa karena pengguna akan diarahkan
  }

  return (
    <div className="space-y-6 px-4 sm:px-6 md:px-8 pt-6">
      <h1 className="text-2xl font-bold text-emerald-700 mb-4">📅 Detail Jadwal</h1>

      <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 shadow-lg space-y-8 divide-y divide-gray-200">
        {/* Jadwal */}
        <div className="space-y-1">
          <h2 className="text-lg font-semibold text-emerald-600">🗓️ Jadwal</h2>
          <p><strong>Tanggal:</strong> {jadwal.tanggal}</p>
          <p><strong>Waktu Berangkat:</strong> {jadwal.waktu_berangkat}</p>
          <p><strong>Estimasi Tiba:</strong> {jadwal.estimasi_tiba}</p>
        </div>

        {/* Rute */}
        <div className="pt-4 space-y-1">
          <h2 className="text-lg font-semibold text-emerald-600">🛣️ Rute</h2>
          {rute ? (
            <>
              <p><strong>Nama Rute:</strong> {rute.nama_rute}</p>
              <p><strong>Asal:</strong> {rute.asal}</p>
              <p><strong>Tujuan:</strong> {rute.tujuan}</p>
            </>
          ) : <p className="text-gray-500">Informasi rute tidak tersedia.</p>}
        </div>

        {/* Kendaraan */}
        <div className="pt-4 space-y-1">
          <h2 className="text-lg font-semibold text-emerald-600">🚐 Kendaraan</h2>
          {kendaraan ? (
            <>
              <p><strong>Nomor Polisi:</strong> {kendaraan.nomor_polisi}</p>
              <p><strong>Jenis:</strong> {kendaraan.jenis}</p>
              <p><strong>Status:</strong> {kendaraan.status}</p>
            </>
          ) : <p className="text-gray-500">Informasi kendaraan tidak tersedia.</p>}
        </div>
      </div>
    </div>
  );
}