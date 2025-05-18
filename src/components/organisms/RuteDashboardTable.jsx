import RuteTableRow from "../molecules/RuteTableRow";

export default function RuteDashboardTable({ ruteList }) {
  return (
    <div className="overflow-x-auto border rounded-xl shadow">
      <table className="w-full text-sm text-left">
        <thead className="bg-blue-100 text-blue-700">
          <tr>
            <th className="px-4 py-3">Kode</th>
            <th className="px-4 py-3">Nama</th>
            <th className="px-4 py-3">Asal</th>
            <th className="px-4 py-3">Tujuan</th>
            <th className="px-4 py-3">Jarak (km)</th>
          </tr>
        </thead>
        <tbody>
          {ruteList.map(r => (
            <RuteTableRow key={r._id} rute={r} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
