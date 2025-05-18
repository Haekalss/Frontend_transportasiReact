export default function JadwalDashboardStats({ jadwals }) {
  return (
    <div className="bg-emerald-100 p-5 rounded-2xl shadow-md max-w-md">
      <p className="text-sm text-emerald-800">Total Jadwal</p>
      <h2 className="text-3xl font-bold text-emerald-900">{jadwals.length}</h2>
    </div>
  );
}
