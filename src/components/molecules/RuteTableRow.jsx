import LinkDetail from "../atoms/LinkDetail";

export default function RuteTableRow({ rute }) {
  return (
    <tr className="border-t hover:bg-gray-50">
      <td className="px-4 py-2">{rute.kode_rute}</td>
      <td className="px-4 py-2 font-medium">{rute.nama_rute}</td>
      <td className="px-4 py-2">{rute.asal}</td>
      <td className="px-4 py-2">{rute.tujuan}</td>
      <td className="px-4 py-2">{rute.jarak_km}</td>
    </tr>
  );
}
