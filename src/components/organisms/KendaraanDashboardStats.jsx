export default function KendaraanDashboardStats({ kendaraan }) {
  const aktifCount = kendaraan.filter(k => k.status === "Aktif").length;
  const nonaktifCount = kendaraan.filter(k => k.status === "Nonaktif").length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-md">
      <div className="bg-green-100 p-5 rounded-2xl shadow-md">
        <p className="text-sm text-green-800">Kendaraan Aktif</p>
        <h2 className="text-3xl font-bold text-green-900">{aktifCount}</h2>
      </div>
      <div className="bg-red-100 p-5 rounded-2xl shadow-md">
        <p className="text-sm text-red-800">Kendaraan Nonaktif</p>
        <h2 className="text-3xl font-bold text-red-900">{nonaktifCount}</h2>
      </div>
    </div>
  );
}
