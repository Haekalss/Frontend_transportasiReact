import JadwalTableRow from "../molecules/JadwalTableRow";

export default function JadwalDashboardTable({ jadwalList }) {
  return (
    <div className="overflow-x-auto border rounded-xl shadow">
      <table className="w-full text-sm text-left">
        <thead className="bg-emerald-100 text-emerald-700">
          <tr>
            <th className="px-4 py-3">Tanggal</th>
            <th className="px-4 py-3">Waktu Berangkat</th>
            <th className="px-4 py-3">Estimasi Tiba</th>
            <th className="px-4 py-3">Kode Rute</th>
            <th className="px-4 py-3">Rute</th>
            <th className="px-4 py-3">Jarak</th>
            <th className="px-4 py-3 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {jadwalList.map(j => (
            <JadwalTableRow key={j._id} jadwal={j} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
