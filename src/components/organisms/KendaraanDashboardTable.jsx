import KendaraanTableRow from "../molecules/KendaraanTableRow";

export default function KendaraanDashboardTable({ kendaraanList }) {
  return (
    <div className="overflow-x-auto border rounded-xl shadow">
      <table className="w-full text-sm text-left">
        <thead className="bg-green-100 text-green-700">
          <tr>
            <th className="px-4 py-3">Nomor Polisi</th>
            <th className="px-4 py-3">Jenis</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Kapasitas</th>
          </tr>
        </thead>
        <tbody>
          {kendaraanList.map(k => (
            <KendaraanTableRow key={k._id} kendaraan={k} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
