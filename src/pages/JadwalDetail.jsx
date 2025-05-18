import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import axios from "axios"

export default function JadwalDetail() {
  const { id } = useParams()
  const [jadwal, setJadwal] = useState(null)
  const [rute, setRute] = useState(null)
  const [kendaraan, setKendaraan] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`http://localhost:8088/api/jadwals/${id}`)
        setJadwal(res.data)

        const ruteRes = await axios.get(`http://localhost:8088/api/rutes/${res.data.rute_id}`)
        setRute(ruteRes.data)

        const kendaraanRes = await axios.get(`http://localhost:8088/api/kendaraans/${res.data.kendaraan_id}`)
        setKendaraan(kendaraanRes.data)

        setLoading(false)
      } catch {
        setError("Data tidak ditemukan")
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  if (loading) return <div className="p-6 text-gray-500">Loading...</div>
  if (error) return <div className="p-6 text-red-500">{error}</div>

  return (
    <div className="space-y-6 px-4 sm:px-6 md:px-8 pt-6">
      <h1 className="text-2xl font-bold text-emerald-700 mb-4">📅 Detail Jadwal</h1>

      <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 shadow-lg space-y-8 divide-y divide-gray-200">
        {/* Jadwal */}
        <div className="space-y-1">
          <h2 className="text-lg font-semibold text-emerald-600">🗓️ Jadwal</h2>
          <p><strong>Tanggal:</strong> {jadwal.tanggal}</p>
          <p><strong>Waktu Berangkat:</strong> {jadwal.waktu_berangkat}</p>
          <p><strong>Estimasi Tiba:</strong> {jadwal.estimasi_tiba}</p>
        </div>

        {/* Rute */}
        <div className="pt-4 space-y-1">
          <h2 className="text-lg font-semibold text-emerald-600">🛣️ Rute</h2>
          {rute ? (
            <>
              <p><strong>Nama Rute:</strong> {rute.nama_rute}</p>
              <p><strong>Asal:</strong> {rute.asal}</p>
              <p><strong>Tujuan:</strong> {rute.tujuan}</p>
            </>
          ) : <p>Rute tidak ditemukan</p>}
        </div>

        {/* Kendaraan */}
        <div className="pt-4 space-y-1">
          <h2 className="text-lg font-semibold text-emerald-600">🚐 Kendaraan</h2>
          {kendaraan ? (
            <>
              <p><strong>Nomor Polisi:</strong> {kendaraan.nomor_polisi}</p>
              <p><strong>Jenis:</strong> {kendaraan.jenis}</p>
              <p><strong>Status:</strong> {kendaraan.status}</p>
            </>
          ) : <p>Kendaraan tidak ditemukan</p>}
        </div>
      </div>
    </div>
  )
}
