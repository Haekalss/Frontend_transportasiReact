import { useEffect, useState } from "react";
import axios from "axios";
import { Plus, Pencil, Trash2, Save, X, CheckCircle, AlertCircle } from "lucide-react";

export default function RuteCRUD() {
  const [rutes, setRutes] = useState([]);
  const [newData, setNewData] = useState({ kode_rute: "", nama_rute: "", asal: "", tujuan: "", jarak_km: "" });
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({ kode_rute: "", nama_rute: "", asal: "", tujuan: "", jarak_km: "" });
  const [notif, setNotif] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    fetchRutes();
  }, [refreshKey]);

  const fetchRutes = async () => {
    try {
      const res = await axios.get("http://localhost:8088/api/rutes");
      setRutes(res.data);
    } catch (err) {
      console.error("Gagal ambil data rute:", err);
    }
  };

  const showNotif = (msg, success = true) => {
    setNotif({ msg, success });
    setTimeout(() => setNotif(null), 3000);
  };

  const triggerRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const handleInput = (e) => {
    setNewData({ ...newData, [e.target.name]: e.target.value });
  };

const handleCreate = async () => {
  if (!newData.kode_rute || !newData.nama_rute || !newData.asal || !newData.tujuan || !newData.jarak_km) {
    showNotif("Semua field harus diisi", false);
    return;
  }

  // Konversi jarak_km menjadi integer
  const dataToSend = {
    ...newData,
    jarak_km: parseInt(newData.jarak_km, 10), // Konversi ke integer
  };

  try {
    console.log("Data yang dikirim:", dataToSend);
    const res = await axios.post("http://localhost:8088/api/rutes", dataToSend);
    console.log("Respons API:", res.data);
    setNewData({ kode_rute: "", nama_rute: "", asal: "", tujuan: "", jarak_km: "" });
    showNotif("Data berhasil ditambahkan");
    triggerRefresh();
  } catch (err) {
    if (err.response) {
      console.error("Error dari API:", err.response.data);
      showNotif(`Gagal: ${err.response.data.message || "Terjadi kesalahan"}`, false);
    } else {
      console.error("Error lainnya:", err);
      showNotif("Gagal menghubungi server", false);
    }
  }
};

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8088/api/rutes/${id}`);
      showNotif("Data berhasil dihapus");
      triggerRefresh();
    } catch (err) {
      console.error("Gagal hapus:", err);
      showNotif("Gagal menghapus data", false);
    }
  };

  const handleEdit = (r) => {
    setEditId(r._id);
    setEditData({
      kode_rute: r.kode_rute,
      nama_rute: r.nama_rute,
      asal: r.asal,
      tujuan: r.tujuan,
      jarak_km: r.jarak_km,
    });
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

const handleUpdate = async () => {
  if (!editData.kode_rute || !editData.nama_rute || !editData.asal || !editData.tujuan || !editData.jarak_km) {
    showNotif("Semua field harus diisi", false);
    return;
  }

  // Konversi jarak_km menjadi integer
  const dataToSend = {
    ...editData,
    jarak_km: parseInt(editData.jarak_km, 10), // Konversi ke integer
  };

  try {
    console.log("Data yang dikirim untuk update:", dataToSend);
    const res = await axios.put(`http://localhost:8088/api/rutes/${editId}`, dataToSend);
    console.log("Respons API:", res.data);
    setEditId(null);
    showNotif("Data berhasil diupdate");
    triggerRefresh();
  } catch (err) {
    if (err.response) {
      console.error("Error dari API:", err.response.data);
      showNotif(`Gagal: ${err.response.data.message || "Terjadi kesalahan"}`, false);
    } else {
      console.error("Error lainnya:", err);
      showNotif("Gagal menghubungi server", false);
    }
  }
};

  const handleCancelEdit = () => {
    setEditId(null);
  };

  return (
    <div className="space-y-8 px-4 sm:px-8 md:px-16 pt-8 pb-12 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold text-blue-800 mb-6">Manajemen Rute</h2>

      {notif && (
        <div className={`flex items-center gap-2 text-sm px-4 py-2 rounded-lg mb-4 ${notif.success ? "bg-blue-100 text-blue-700" : "bg-red-100 text-red-700"}`}>
          {notif.success ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          <span>{notif.msg}</span>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow p-6 space-y-5 max-w-3xl mx-auto">
        <h3 className="font-semibold text-gray-700 mb-2">Tambah Rute</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input type="text" name="kode_rute" placeholder="Kode Rute" value={newData.kode_rute} onChange={handleInput} className="border px-3 py-2 rounded" />
          <input type="text" name="nama_rute" placeholder="Nama Rute" value={newData.nama_rute} onChange={handleInput} className="border px-3 py-2 rounded" />
          <input type="text" name="asal" placeholder="Asal" value={newData.asal} onChange={handleInput} className="border px-3 py-2 rounded" />
          <input type="text" name="tujuan" placeholder="Tujuan" value={newData.tujuan} onChange={handleInput} className="border px-3 py-2 rounded" />
          <input type="number" name="jarak_km" placeholder="Jarak KM" value={newData.jarak_km} onChange={handleInput} className="border px-3 py-2 rounded" />
        </div>
        <div className="flex justify-end">
          <button onClick={handleCreate} className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 inline-flex items-center gap-2 mt-2">
            <Plus size={16} /> Tambah
          </button>
        </div>
      </div>

      <div className="overflow-x-auto border rounded-2xl shadow max-w-5xl mx-auto bg-white mt-8">
        <table className="w-full text-sm text-left">
          <thead className="bg-blue-100 text-blue-800">
            <tr>
              <th className="px-5 py-3">Kode</th>
              <th className="px-5 py-3">Nama</th>
              <th className="px-5 py-3">Asal</th>
              <th className="px-5 py-3">Tujuan</th>
              <th className="px-5 py-3">Jarak (KM)</th>
              <th className="px-5 py-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {rutes.map((r) => (
              <tr key={r._id} className="border-t hover:bg-gray-50">
                {editId === r._id ? (
                  <>
                    <td className="px-5 py-2"><input name="kode_rute" value={editData.kode_rute} onChange={handleEditChange} className="border px-2 py-1 rounded w-full" /></td>
                    <td className="px-5 py-2"><input name="nama_rute" value={editData.nama_rute} onChange={handleEditChange} className="border px-2 py-1 rounded w-full" /></td>
                    <td className="px-5 py-2"><input name="asal" value={editData.asal} onChange={handleEditChange} className="border px-2 py-1 rounded w-full" /></td>
                    <td className="px-5 py-2"><input name="tujuan" value={editData.tujuan} onChange={handleEditChange} className="border px-2 py-1 rounded w-full" /></td>
                    <td className="px-5 py-2"><input name="jarak_km" type="number" value={editData.jarak_km} onChange={handleEditChange} className="border px-2 py-1 rounded w-full" /></td>
                    <td className="px-5 py-2 text-center">
                      <button onClick={handleUpdate} className="text-green-600 hover:underline mr-3"><Save size={16} /></button>
                      <button onClick={handleCancelEdit} className="text-gray-500 hover:underline"><X size={16} /></button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-5 py-2">{r.kode_rute}</td>
                    <td className="px-5 py-2">{r.nama_rute}</td>
                    <td className="px-5 py-2">{r.asal}</td>
                    <td className="px-5 py-2">{r.tujuan}</td>
                    <td className="px-5 py-2">{r.jarak_km}</td>
                    <td className="px-5 py-2 text-center">
                      <button onClick={() => handleEdit(r)} className="text-blue-600 hover:underline mr-3"><Pencil size={16} /></button>
                      <button onClick={() => handleDelete(r._id)} className="text-red-600 hover:underline"><Trash2 size={16} /></button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
