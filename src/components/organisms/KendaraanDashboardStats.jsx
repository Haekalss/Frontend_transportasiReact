import { ActivitySquare, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function KendaraanDashboardStats({ kendaraan }) {
  const aktifCount = kendaraan.filter(k => k.status === "Aktif").length;
  const nonaktifCount = kendaraan.filter(k => k.status === "Nonaktif").length;
  const maintenanceCount = kendaraan.filter(k => k.status === "Maintenance").length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div className="bg-green-100 p-4 rounded-2xl shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-200 rounded-xl">
            <CheckCircle2 className="w-5 h-5 text-green-700" />
          </div>
          <div>
            <p className="text-sm text-green-800">Kendaraan Aktif</p>
            <h2 className="text-2xl font-bold text-green-900">{aktifCount}</h2>
          </div>
        </div>
      </div>

      <div className="bg-yellow-100 p-4 rounded-2xl shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-yellow-200 rounded-xl">
            <ActivitySquare className="w-5 h-5 text-yellow-700" />
          </div>
          <div>
            <p className="text-sm text-yellow-800">Dalam Maintenance</p>
            <h2 className="text-2xl font-bold text-yellow-900">{maintenanceCount}</h2>
          </div>
        </div>
      </div>

      <div className="bg-red-100 p-4 rounded-2xl shadow-sm sm:col-span-2 lg:col-span-1">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-200 rounded-xl">
            <AlertCircle className="w-5 h-5 text-red-700" />
          </div>
          <div>
            <p className="text-sm text-red-800">Kendaraan Nonaktif</p>
            <h2 className="text-2xl font-bold text-red-900">{nonaktifCount}</h2>
          </div>
        </div>
      </div>
    </div>
  );
}
