export default function RuteDashboardStats({ rutes }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
      <div className="bg-blue-100 p-5 rounded-2xl shadow-md">
        <p className="text-sm text-blue-800">Total Rute</p>
        <h2 className="text-3xl font-bold text-blue-900">{rutes.length}</h2>
      </div>
      {/* Kamu bisa tambahkan statistik lain seperti rute asal atau tujuan */}
    </div>
  );
}
