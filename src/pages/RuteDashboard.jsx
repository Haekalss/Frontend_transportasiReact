import { useEffect, useState } from "react";
import { getAllRutes } from "../services/api";
import { Map as MapIcon } from "lucide-react";
import RuteDashboardStats from "../components/organisms/RuteDashboardStats";
import RuteDashboardTable from "../components/organisms/RuteDashboardTable";
import Swal from 'sweetalert2';

export default function RuteDashboard() {
  const [rutes, setRutes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllRutes();
        setRutes(data);
      } catch (err) {
        console.error("Gagal ambil data rute:", err);
        // Tampilkan notifikasi error menggunakan SweetAlert
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

  return (
    <div className="space-y-6 px-4 sm:px-6 md:px-8 pt-6 pb-9">
      <div className="flex items-center gap-3">
        <MapIcon size={28} className="text-blue-600" />
        <h2 className="text-2xl font-bold text-blue-800">Dashboard Rute</h2>
      </div>

      {/* Elemen untuk menampilkan error sudah tidak diperlukan lagi */}

      <div className="min-w-[220px]">
        <RuteDashboardStats rutes={rutes} />
      </div>

      <RuteDashboardTable ruteList={rutes} />
    </div>
  );
}