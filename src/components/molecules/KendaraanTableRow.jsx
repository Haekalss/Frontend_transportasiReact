import LinkDetail from "../atoms/LinkDetail";

export default function KendaraanTableRow({ kendaraan }) {
  return (
    <tr className="border-t hover:bg-gray-50">
      <td className="px-2 py-2 md:px-4">
        <div className="font-medium">{kendaraan.nomor_polisi}</div>
        <div className="text-sm text-gray-500 md:hidden">
          {kendaraan.jenis} • {kendaraan.status}
        </div>
      </td>
      <td className="hidden md:table-cell px-4 py-2">{kendaraan.jenis}</td>
      <td className="hidden md:table-cell px-4 py-2">
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            kendaraan.status === "Aktif"
              ? "bg-green-100 text-green-800"
              : kendaraan.status === "Maintenance"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {kendaraan.status}
        </span>
      </td>
      <td className="px-2 md:px-4 py-2 text-right">
        <span className="inline-flex items-center bg-blue-50 text-blue-700 px-2 py-1 rounded-lg text-sm">
          {kendaraan.kapasitas} Kursi
        </span>
      </td>
    </tr>
  );
}
