import { useEffect, useState, useCallback } from "react";
import {
  getAllJadwal,
  getAllRutes,
  createJadwal,
  updateJadwal,
  deleteJadwal,
} from "../../services/api";
import { Plus, Pencil, Trash2, Save, X, Search, FileDown } from "lucide-react"; 
import Swal from "sweetalert2";

import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function JadwalCRUD() {
  const [jadwals, setJadwals] = useState([]);
  const [filteredJadwals, setFilteredJadwals] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [rutes, setRutes] = useState([]);
  const [editId, setEditId] = useState(null);
  const [newData, setNewData] = useState({
    tanggal: "",
    waktu_berangkat: "",
    estimasi_tiba: "",
    kode_rute: "",
  });
  const [editData, setEditData] = useState({
    tanggal: "",
    waktu_berangkat: "",
    estimasi_tiba: "",
    kode_rute: "",
  });

  const fetchAll = useCallback(async () => {
    try {
      const [jadwalData, ruteData] = await Promise.all([
        getAllJadwal(),
        getAllRutes(),
      ]);
      setJadwals(jadwalData);
      setFilteredJadwals(jadwalData);
      setRutes(ruteData);
    } catch {
      Swal.fire("Error!", "Gagal memuat data.", "error");
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  useEffect(() => {
    const lowercasedQuery = searchQuery.toLowerCase();
    const filtered = jadwals.filter((j) => {
      const ruteName = j.rute?.nama_rute || "";
      return (
        j.tanggal.toLowerCase().includes(lowercasedQuery) ||
        j.waktu_berangkat.toLowerCase().includes(lowercasedQuery) ||
        j.estimasi_tiba.toLowerCase().includes(lowercasedQuery) ||
        ruteName.toLowerCase().includes(lowercasedQuery)
      );
    });
    setFilteredJadwals(filtered);
  }, [searchQuery, jadwals]);

  // Fungsi untuk handle export ke Excel
  const handleExportExcel = () => {
    const tableData = filteredJadwals.map((j) => ({
      Tanggal: j.tanggal,
      "Waktu Berangkat": j.waktu_berangkat,
      "Estimasi Tiba": j.estimasi_tiba,
      Rute: j.rute?.nama_rute || "-",
    }));
    const worksheet = XLSX.utils.json_to_sheet(tableData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data Jadwal");
    XLSX.writeFile(workbook, "DataJadwal.xlsx");
  };

  // Fungsi untuk handle export ke PDF
  const handleExportPdf = () => {
    const doc = new jsPDF();
    doc.text("Laporan Data Jadwal", 14, 16);

    autoTable(doc, {
      head: [["Tanggal", "Waktu Berangkat", "Estimasi Tiba", "Rute"]],
      body: filteredJadwals.map((j) => [
        j.tanggal,
        j.waktu_berangkat,
        j.estimasi_tiba,
        j.rute?.nama_rute || "-",
      ]),
      startY: 20,
    });

    doc.save("DataJadwal.pdf");
  };

  const handleInput = (e) =>
    setNewData({ ...newData, [e.target.name]: e.target.value });
  const handleEditChange = (e) =>
    setEditData({ ...editData, [e.target.name]: e.target.value });

  const handleCreate = async () => {
    const { tanggal, waktu_berangkat, estimasi_tiba, kode_rute } = newData;
    if (
      !tanggal?.trim() ||
      !waktu_berangkat?.trim() ||
      !estimasi_tiba?.trim() ||
      !kode_rute?.trim()
    ) {
      Swal.fire("Peringatan", "Semua field wajib diisi", "warning");
      return;
    }
    try {
      await createJadwal(newData);
      fetchAll();
      setNewData({
        tanggal: "",
        waktu_berangkat: "",
        estimasi_tiba: "",
        kode_rute: "",
      });
      Swal.fire("Berhasil!", "Data berhasil ditambahkan", "success");
    } catch (err) {
      Swal.fire(
        "Gagal!",
        err.response?.data?.error || "Gagal menambahkan data",
        "error"
      );
    }
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Data yang dihapus tidak dapat dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteJadwal(id);
          fetchAll();
          Swal.fire("Dihapus!", "Data jadwal telah dihapus.", "success");
        } catch (err) {
          Swal.fire(
            "Gagal!",
            err.response?.data?.error || "Gagal menghapus data",
            "error"
          );
        }
      }
    });
  };

  const handleEdit = (j) => {
    setEditId(j.id);
    setEditData({
      tanggal: j.tanggal,
      waktu_berangkat: j.waktu_berangkat,
      estimasi_tiba: j.estimasi_tiba,
      kode_rute: j.rute?.kode_rute || "",
    });
  };

  const handleUpdate = async () => {
    const { tanggal, waktu_berangkat, estimasi_tiba, kode_rute } = editData;
    if (
      !tanggal?.trim() ||
      !waktu_berangkat?.trim() ||
      !estimasi_tiba?.trim() ||
      !kode_rute?.trim()
    ) {
      Swal.fire("Peringatan", "Semua field wajib diisi", "warning");
      return;
    }
    try {
      await updateJadwal(editId, editData);
      fetchAll();
      setEditId(null);
      Swal.fire("Berhasil!", "Data berhasil diupdate", "success");
    } catch (err) {
      Swal.fire(
        "Gagal!",
        err.response?.data?.error || "Gagal mengupdate data",
        "error"
      );
    }
  };

  const handleCancelEdit = () => setEditId(null);

  return (
    <div className="space-y-8 px-4 sm:px-8 md:px-16 pt-8 pb-12 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold text-emerald-700 mb-6">
        Manajemen Jadwal
      </h2>

      <div className="bg-white rounded-2xl shadow p-6 space-y-5 max-w-2xl mx-auto">
        <h3 className="font-semibold text-gray-700 mb-2">Tambah Jadwal</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label
              className="text-xs text-gray-500 mb-1"
              htmlFor="tanggal"
            >
              Tanggal
            </label>
            <input
              id="tanggal"
              type="date"
              name="tanggal"
              value={newData.tanggal}
              onChange={handleInput}
              className="border px-3 py-2 rounded"
            />
          </div>
          <div className="flex flex-col">
            <label
              className="text-xs text-gray-500 mb-1"
              htmlFor="waktu_berangkat"
            >
              Waktu Berangkat
            </label>
            <input
              id="waktu_berangkat"
              type="time"
              name="waktu_berangkat"
              value={newData.waktu_berangkat}
              onChange={handleInput}
              className="border px-3 py-2 rounded"
              placeholder="hh:mm"
            />
          </div>
          <div className="flex flex-col">
            <label
              className="text-xs text-gray-500 mb-1"
              htmlFor="estimasi_tiba"
            >
              Estimasi Tiba
            </label>
            <input
              id="estimasi_tiba"
              type="time"
              name="estimasi_tiba"
              value={newData.estimasi_tiba}
              onChange={handleInput}
              className="border px-3 py-2 rounded"
              placeholder="hh:mm"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-xs text-gray-500 mb-1" htmlFor="kode_rute">
              Rute
            </label>
            <select
              id="kode_rute"
              name="kode_rute"
              value={newData.kode_rute}
              onChange={handleInput}
              className="border px-3 py-2 rounded"
            >
              <option value="">Pilih Rute</option>
              {rutes.map((r) => (
                <option key={r._id} value={r.kode_rute}>
                  {r.nama_rute}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex justify-end">
          <button
            onClick={handleCreate}
            className="bg-emerald-600 text-white px-5 py-2 rounded hover:bg-emerald-700 inline-flex items-center gap-2 mt-2"
          >
            <Plus size={16} /> Tambah
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow p-6 max-w-5xl mx-auto mt-8">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
          <h3 className="font-semibold text-gray-700 text-lg">Daftar Jadwal</h3>
          <div className="flex items-center gap-2 flex-wrap">
            
            <button
              onClick={handleExportExcel}
              className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2 text-sm"
            >
              <FileDown size={16} /> Excel
            </button>
            <button
              onClick={handleExportPdf}
              className="bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 flex items-center gap-2 text-sm"
            >
              <FileDown size={16} /> PDF
            </button>
            <div className="relative">
              <input
                type="text"
                placeholder="Cari jadwal..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border px-3 py-2 rounded-lg pl-10 w-full sm:w-56"
              />
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto border rounded-2xl">
          <table className="w-full text-sm text-left">
            <thead className="bg-emerald-100 text-emerald-800">
              <tr>
                <th className="px-5 py-3">Tanggal</th>
                <th className="px-5 py-3">Berangkat</th>
                <th className="px-5 py-3">Tiba</th>
                <th className="px-5 py-3">Rute</th>
                <th className="px-5 py-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredJadwals.map((j) => (
                <tr key={j.id} className="border-t hover:bg-gray-50">
                  {editId === j.id ? (
                    <>
                      <td className="px-5 py-2">
                        <input
                          type="date"
                          name="tanggal"
                          value={editData.tanggal}
                          onChange={handleEditChange}
                          className="border px-2 py-1 rounded w-full"
                        />
                      </td>
                      <td className="px-5 py-2">
                        <input
                          type="time"
                          name="waktu_berangkat"
                          value={editData.waktu_berangkat}
                          onChange={handleEditChange}
                          className="border px-2 py-1 rounded w-full"
                        />
                      </td>
                      <td className="px-5 py-2">
                        <input
                          type="time"
                          name="estimasi_tiba"
                          value={editData.estimasi_tiba}
                          onChange={handleEditChange}
                          className="border px-2 py-1 rounded w-full"
                        />
                      </td>
                      <td className="px-5 py-2">
                        <select
                          name="kode_rute"
                          value={editData.kode_rute}
                          onChange={handleEditChange}
                          className="border px-2 py-1 rounded w-full"
                        >
                          <option value="">Pilih Rute</option>
                          {rutes.map((r) => (
                            <option key={r._id} value={r.kode_rute}>
                              {r.nama_rute}
                            </option>
                          ))}
                        </select>
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
                      <td className="px-5 py-2">{j.tanggal}</td>
                      <td className="px-5 py-2">{j.waktu_berangkat}</td>
                      <td className="px-5 py-2">{j.estimasi_tiba}</td>
                      <td className="px-5 py-2">{j.rute?.nama_rute || "-"}</td>
                      <td className="px-5 py-2 text-center">
                        <button
                          onClick={() => handleEdit(j)}
                          className="text-blue-600 hover:underline mr-3"
                          title="Edit"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(j.id)}
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
    </div>
  );
}