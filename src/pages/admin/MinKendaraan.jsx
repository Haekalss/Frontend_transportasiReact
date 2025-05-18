import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Plus, Pencil, Trash2, Save, X } from "lucide-react";

export default function KendaraanCRUD() {
  const [kendaraan, setKendaraan] = useState([]);
  const [newData, setNewData] = useState({ nomor_polisi: "", jenis: "", status: "Aktif", kapasitas: "" });
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({ nomor_polisi: "", jenis: "", status: "Aktif", kapasitas: "" });
  const [notif, setNotif] = useState(null);

  // Fetch data kendaraan
  const fetchKendaraan = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:8088/api/kendaraans");
      setKendaraan(res.data);
    } catch {
      showNotif("Gagal memuat data kendaraan", false);
    }
  }, []);

  useEffect(() => {
    fetchKendaraan();
  }, [fetchKendaraan]);

  const showNotif = (msg, success = true) => {
    setNotif({ msg, success });
    setTimeout(() => setNotif(null), 3000);
  };

  const handleInput = (e) => {
    setNewData({ ...newData, [e.target.name]: e.target.value });
  };

  const handleCreate = async () => {
    const nomor_polisi = (newData.nomor_polisi || "").trim();
    const jenis = (newData.jenis || "").trim();
    const status = (newData.status || "").trim();
    const kapasitas = parseInt(newData.kapasitas, 10);

    if (
      nomor_polisi === "" ||
      jenis === "" ||
      status === "" ||
      isNaN(kapasitas) ||
      kapasitas <= 0
    ) {
      showNotif("Semua field wajib diisi dan kapasitas harus lebih dari 0", false);
      return;
    }

    try {
      const dataToSend = {
        nomor_polisi,
        jenis,
        status,
        kapasitas,
      };

      await axios.post(
        "http://localhost:8088/api/kendaraans",
        dataToSend,
        { headers: { "Content-Type": "application/json" } }
      );
      fetchKendaraan();

      setNewData({ nomor_polisi: "", jenis: "", status: "Aktif", kapasitas: "" });
      showNotif("Data berhasil ditambahkan");
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.error || err.message;
      showNotif(`Gagal menambahkan data: ${msg}`, false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8088/api/kendaraans/${id}`);
      fetchKendaraan();
      setKendaraan(kendaraan.filter((k) => k._id !== id));
      showNotif("Data berhasil dihapus");
    } catch {
      showNotif("Gagal menghapus data", false);
    }
  };

  const handleEdit = (k) => {
    setEditId(k._id);
    setEditData({
      nomor_polisi: k.nomor_polisi,
      jenis: k.jenis,
      status: k.status,
      kapasitas: k.kapasitas,
    });
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    if (!editData.nomor_polisi || !editData.jenis || !editData.kapasitas) {
      showNotif("Semua field harus diisi", false);
      return;
    }

    try {
      const dataToSend = {
        nomor_polisi: editData.nomor_polisi,
        jenis: editData.jenis,
        status: editData.status,
        kapasitas: parseInt(editData.kapasitas, 10),
      };

      await axios.put(`http://localhost:8088/api/kendaraans/${editId}`, dataToSend);
      fetchKendaraan();

      setEditId(null);
      showNotif("Data berhasil diupdate");
    } catch {
      showNotif("Gagal mengupdate data", false);
    }
  };

  const handleCancelEdit = () => {
    setEditId(null);
  };

  return (
    <div className="space-y-8 px-4 sm:px-8 md:px-16 pt-8 pb-12 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Manajemen Kendaraan</h2>

      {/* Notifikasi */}
      {notif && (
        <div
          className={`p-4 rounded mb-4 ${
            notif.success ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          {notif.msg}
        </div>
      )}

      {/* Form Tambah */}
      <div className="bg-white rounded-2xl shadow p-6 space-y-5 max-w-2xl mx-auto">
        <h3 className="font-semibold text-gray-700 mb-2">Tambah Kendaraan</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="nomor_polisi"
            placeholder="Nomor Polisi"
            value={newData.nomor_polisi}
            onChange={handleInput}
            className="border px-3 py-2 rounded"
          />
          <input
            type="text"
            name="jenis"
            placeholder="Jenis"
            value={newData.jenis}
            onChange={handleInput}
            className="border px-3 py-2 rounded"
          />
          <input
            type="number"
            name="kapasitas"
            placeholder="Kapasitas"
            min={1}
            value={newData.kapasitas === 0 ? "" : newData.kapasitas}
            onChange={handleInput}
            className="border px-3 py-2 rounded"
          />
          <select
            name="status"
            value={newData.status}
            onChange={handleInput}
            className="border px-3 py-2 rounded"
          >
            <option value="Aktif">Aktif</option>
            <option value="Nonaktif">Nonaktif</option>
          </select>
        </div>
        <div className="flex justify-end">
          <button
            onClick={handleCreate}
            className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700 inline-flex items-center gap-2 mt-2"
          >
            <Plus size={16} /> Tambah
          </button>
        </div>
      </div>

      {/* Tabel Data */}
      <div className="overflow-x-auto border rounded-2xl shadow max-w-4xl mx-auto bg-white mt-8">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-5 py-3">Nomor Polisi</th>
              <th className="px-5 py-3">Jenis</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Kapasitas</th>
              <th className="px-5 py-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {kendaraan.map((k) => (
              <tr key={k._id} className="border-t hover:bg-gray-50">
                {editId === k._id ? (
                  <>
                    <td className="px-5 py-2">
                      <input
                        name="nomor_polisi"
                        value={editData.nomor_polisi}
                        onChange={handleEditChange}
                        className="border px-2 py-1 rounded w-full"
                      />
                    </td>
                    <td className="px-5 py-2">
                      <input
                        name="jenis"
                        value={editData.jenis}
                        onChange={handleEditChange}
                        className="border px-2 py-1 rounded w-full"
                      />
                    </td>
                    <td className="px-5 py-2">
                      <select
                        name="status"
                        value={editData.status}
                        onChange={handleEditChange}
                        className="border px-2 py-1 rounded w-full"
                      >
                        <option value="Aktif">Aktif</option>
                        <option value="Nonaktif">Nonaktif</option>
                      </select>
                    </td>
                    <td className="px-5 py-2">
                      <input
                        type="number"
                        name="kapasitas"
                        value={editData.kapasitas}
                        onChange={handleEditChange}
                        className="border px-2 py-1 rounded w-full"
                      />
                    </td>
                    <td className="px-5 py-2 text-center">
                      <button
                        onClick={handleUpdate}
                        className="text-green-600 hover:underline mr-3"
                        title="Simpan"
                      >
                        <Save size={16} />
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="text-gray-500 hover:underline"
                        title="Batal"
                      >
                        <X size={16} />
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-5 py-2">{k.nomor_polisi}</td>
                    <td className="px-5 py-2">{k.jenis}</td>
                    <td className="px-5 py-2">{k.status}</td>
                    <td className="px-5 py-2">{k.kapasitas}</td>
                    <td className="px-5 py-2 text-center">
                      <button
                        onClick={() => handleEdit(k)}
                        className="text-blue-600 hover:underline mr-3"
                        title="Edit"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(k._id)}
                        className="text-red-600 hover:underline"
                        title="Hapus"
                      >
                        <Trash2 size={16} />
                      </button>
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