import { useEffect, useState } from "react";
import axios from "axios";
import { Map } from "lucide-react";
import RuteDashboardStats from "../components/organisms/RuteDashboardStats";
import RuteDashboardTable from "../components/organisms/RuteDashboardTable";

export default function RuteDashboard() {
  const [rutes, setRutes] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8088/api/rutes")
      .then(res => setRutes(res.data))
      .catch(err => console.error("Gagal ambil data rute:", err));
  }, []);

  return (
    <div className="space-y-6 px-4 sm:px-6 md:px-8 pt-6 pb-9">
      <div className="flex items-center gap-3">
        <Map size={28} className="text-blue-600" />
        <h2 className="text-2xl font-bold text-blue-800">Dashboard Rute</h2>
      </div>

      <div className="min-w-[220px]">
        <RuteDashboardStats rutes={rutes} />
      </div>

      <RuteDashboardTable ruteList={rutes} />
    </div>
  );
}
