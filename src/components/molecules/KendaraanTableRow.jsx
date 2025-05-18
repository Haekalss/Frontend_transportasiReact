import LinkDetail from "../atoms/LinkDetail";

export default function KendaraanTableRow({ kendaraan }) {
  return (
    <tr className="border-t hover:bg-gray-50">
      <td className="px-4 py-2">{kendaraan.nomor_polisi}</td>
      <td className="px-4 py-2">{kendaraan.jenis}</td>
      <td className="px-4 py-2">{kendaraan.status}</td>
      <td className="px-4 py-2">{kendaraan.kapasitas}</td>
    </tr>
  );
}
