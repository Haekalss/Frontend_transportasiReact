import { useEffect, useState, useCallback } from "react";
import { getAllKendaraan, createKendaraan, updateKendaraan, deleteKendaraan } from "../../services/api";
import { Plus, Pencil, Trash2, Save, X } from "lucide-react";
import Swal from 'sweetalert2';

export default function KendaraanCRUD() {
  const [kendaraan, setKendaraan] = useState([]);
  const [newData, setNewData] = useState({ nomor_polisi: "", jenis: "", status: "Aktif", kapasitas: "" });
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({ nomor_polisi: "", jenis: "", status: "Aktif", kapasitas: "" });

  const fetchKendaraan = useCallback(async () => {
    try {
      const data = await getAllKendaraan();
      setKendaraan(data);
    } catch  {
      Swal.fire('Error!', 'Gagal memuat data kendaraan.', 'error');
    }
  }, []);

  useEffect(() => {
    fetchKendaraan();
  }, [fetchKendaraan]);

  const handleInput = (e) => {
    setNewData({ ...newData, [e.target.name]: e.target.value });
  };

  const handleCreate = async () => {
    const { nomor_polisi, jenis, status, kapasitas: kapStr } = newData;
    if (!nomor_polisi?.trim() || !jenis?.trim() || !status?.trim() || !kapStr) {
      Swal.fire('Peringatan', 'Semua field wajib diisi', 'warning');
      return;
    }
    const kapasitas = parseInt(kapStr, 10);
    if (isNaN(kapasitas) || kapasitas <= 0) {
      Swal.fire('Peringatan', 'Kapasitas harus berupa angka lebih dari 0', 'warning');
      return;
    }

    try {
      await createKendaraan({ nomor_polisi, jenis, status, kapasitas });
      fetchKendaraan();
      setNewData({ nomor_polisi: "", jenis: "", status: "Aktif", kapasitas: "" });
      Swal.fire('Berhasil!', 'Data berhasil ditambahkan', 'success');
    } catch (err) {
      Swal.fire('Gagal!', err.response?.data?.error || "Gagal menambahkan data", 'error');
    }
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Apakah Anda yakin?',
      text: "Data yang dihapus tidak dapat dikembalikan!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteKendaraan(id);
          fetchKendaraan();
          Swal.fire(
            'Dihapus!',
            'Data kendaraan telah dihapus.',
            'success'
          );
        } catch (err) {
          Swal.fire('Gagal!', err.response?.data?.error || "Gagal menghapus data", 'error');
        }
      }
    });
  };

  const handleEdit = (k) => {
    setEditId(k._id);
    setEditData({ ...k });
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    const { nomor_polisi, jenis, status, kapasitas: kapStr } = editData;
    if (!nomor_polisi?.trim() || !jenis?.trim() || !status?.trim() || !kapStr) {
      Swal.fire('Peringatan', 'Semua field wajib diisi', 'warning');
      return;
    }
    const kapasitas = parseInt(kapStr, 10);
    if (isNaN(kapasitas) || kapasitas <= 0) {
      Swal.fire('Peringatan', 'Kapasitas harus berupa angka lebih dari 0', 'warning');
      return;
    }
    
    try {
      await updateKendaraan(editId, { nomor_polisi, jenis, status, kapasitas });
      fetchKendaraan();
      setEditId(null);
      Swal.fire('Berhasil!', 'Data berhasil diupdate', 'success');
    } catch (err) {
      Swal.fire('Gagal!', err.response?.data?.error || "Gagal mengupdate data", 'error');
    }
  };

  const handleCancelEdit = () => {
    setEditId(null);
  };

  return (
    <div className="space-y-8 px-4 sm:px-8 md:px-16 pt-8 pb-12 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Manajemen Kendaraan</h2>

      <div className="bg-white rounded-2xl shadow p-6 space-y-5 max-w-2xl mx-auto">
        <h3 className="font-semibold text-gray-700 mb-2">Tambah Kendaraan</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" name="nomor_polisi" placeholder="Nomor Polisi" value={newData.nomor_polisi} onChange={handleInput} className="border px-3 py-2 rounded" />
          <input type="text" name="jenis" placeholder="Jenis" value={newData.jenis} onChange={handleInput} className="border px-3 py-2 rounded" />
          <input type="number" name="kapasitas" placeholder="Kapasitas" min={1} value={newData.kapasitas} onChange={handleInput} className="border px-3 py-2 rounded" />
          <select name="status" value={newData.status} onChange={handleInput} className="border px-3 py-2 rounded">
            <option value="Aktif">Aktif</option>
            <option value="Nonaktif">Nonaktif</option>
          </select>
        </div>
        <div className="flex justify-end">
          <button onClick={handleCreate} className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700 inline-flex items-center gap-2 mt-2">
            <Plus size={16} /> Tambah
          </button>
        </div>
      </div>

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
                    <td className="px-5 py-2"><input name="nomor_polisi" value={editData.nomor_polisi} onChange={handleEditChange} className="border px-2 py-1 rounded w-full" /></td>
                    <td className="px-5 py-2"><input name="jenis" value={editData.jenis} onChange={handleEditChange} className="border px-2 py-1 rounded w-full" /></td>
                    <td className="px-5 py-2">
                      <select name="status" value={editData.status} onChange={handleEditChange} className="border px-2 py-1 rounded w-full">
                        <option value="Aktif">Aktif</option>
                        <option value="Nonaktif">Nonaktif</option>
                      </select>
                    </td>
                    <td className="px-5 py-2"><input type="number" name="kapasitas" value={editData.kapasitas} onChange={handleEditChange} className="border px-2 py-1 rounded w-full" /></td>
                    <td className="px-5 py-2 text-center">
                      <button onClick={handleUpdate} className="text-green-600 hover:underline mr-3" title="Simpan"><Save size={16} /></button>
                      <button onClick={handleCancelEdit} className="text-gray-500 hover:underline" title="Batal"><X size={16} /></button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-5 py-2">{k.nomor_polisi}</td>
                    <td className="px-5 py-2">{k.jenis}</td>
                    <td className="px-5 py-2">{k.status}</td>
                    <td className="px-5 py-2">{k.kapasitas}</td>
                    <td className="px-5 py-2 text-center">
                      <button onClick={() => handleEdit(k)} className="text-blue-600 hover:underline mr-3" title="Edit"><Pencil size={16} /></button>
                      <button onClick={() => handleDelete(k._id)} className="text-red-600 hover:underline" title="Hapus"><Trash2 size={16} /></button>
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