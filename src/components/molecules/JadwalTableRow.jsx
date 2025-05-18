import LinkDetail from "../atoms/LinkDetail";

export default function JadwalTableRow({ jadwal }) {
  return (
    <tr className="border-t hover:bg-gray-50">
      <td className="px-4 py-2">{jadwal.tanggal}</td>
      <td className="px-4 py-2">{jadwal.waktu_berangkat}</td>
      <td className="px-4 py-2">{jadwal.estimasi_tiba}</td>
      <td className="px-4 py-2">{jadwal.kode_rute}</td>
      <td className="px-4 py-2">{jadwal.nama_rute}</td>
      <td className="px-4 py-2">{jadwal.jarak_km}</td>
      <td className="px-4 py-2 text-center">
        <LinkDetail to={`/jadwals/${jadwal._id || jadwal.id}`}>Detail</LinkDetail>
      </td>
    </tr>
  );
}
