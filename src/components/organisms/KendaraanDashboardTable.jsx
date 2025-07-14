import KendaraanTableRow from "../molecules/KendaraanTableRow";

export default function KendaraanDashboardTable({ kendaraanList }) {
  return (
    <div className="overflow-x-auto border rounded-xl shadow bg-white">
      <table className="w-full text-sm text-left">
        <thead className="bg-green-100 text-green-700">
          <tr>
            <th className="px-2 md:px-4 py-3">Nomor Polisi</th>
            <th className="hidden md:table-cell px-4 py-3">Jenis</th>
            <th className="hidden md:table-cell px-4 py-3">Status</th>
            <th className="px-2 md:px-4 py-3 text-right">Kapasitas</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {kendaraanList.length === 0 ? (
            <tr>
              <td colSpan="4" className="px-4 py-8 text-center text-gray-500">
                Tidak ada data kendaraan tersedia
              </td>
            </tr>
          ) : (
            kendaraanList.map(k => (
              <KendaraanTableRow key={k._id} kendaraan={k} />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
