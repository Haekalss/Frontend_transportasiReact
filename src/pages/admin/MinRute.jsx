import { useEffect, useState, useCallback } from "react";
import {
  getAllRutes,
  createRute,
  updateRute,
  deleteRute,
} from "../../services/api";
import { Plus, Pencil, Trash2, Save, X, Search, FileDown } from "lucide-react";
import Swal from "sweetalert2";

import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from 'jspdf-autotable'; 

export default function RuteCRUD() {
  const [rutes, setRutes] = useState([]);
  const [filteredRutes, setFilteredRutes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [newData, setNewData] = useState({
    kode_rute: "",
    nama_rute: "",
    asal: "",
    tujuan: "",
    jarak_km: "",
  });
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({
    kode_rute: "",
    nama_rute: "",
    asal: "",
    tujuan: "",
    jarak_km: "",
  });

  const fetchRutes = useCallback(async () => {
    try {
      const data = await getAllRutes();
      setRutes(data);
      setFilteredRutes(data);
    } catch (err) {
      console.error("Gagal ambil data rute:", err);
      Swal.fire({
        title: "Error!",
        text: "Gagal memuat data rute. Pastikan Anda login sebagai admin.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  }, []);

  useEffect(() => {
    fetchRutes();
  }, [fetchRutes]);

  useEffect(() => {
    const lowercasedQuery = searchQuery.toLowerCase();
    const filtered = rutes.filter((rute) =>
      Object.values(rute).some((val) =>
        String(val).toLowerCase().includes(lowercasedQuery)
      )
    );
    setFilteredRutes(filtered);
  }, [searchQuery, rutes]);

  const handleExportExcel = () => {
    const tableData = filteredRutes.map((rute) => ({
      kode_rute: rute.kode_rute,
      nama_rute: rute.nama_rute,
      asal: rute.asal,
      tujuan: rute.tujuan,
      jarak_km: rute.jarak_km,
    }));
    const worksheet = XLSX.utils.json_to_sheet(tableData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data Rute");
    XLSX.writeFile(workbook, "DataRute.xlsx");
  };

  const handleExportPdf = () => {
    const doc = new jsPDF();
    doc.text("Laporan Data Rute", 14, 16);

    const tableColumn = ["Kode", "Nama Rute", "Asal", "Tujuan", "Jarak (KM)"];
    const tableRows = [];

    filteredRutes.forEach((rute) => {
      const ruteData = [
        rute.kode_rute,
        rute.nama_rute,
        rute.asal,
        rute.tujuan,
        rute.jarak_km,
      ];
      tableRows.push(ruteData);
    });
    
    // Gunakan autoTable yang diimpor secara langsung
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save("DataRute.pdf");
  };

  const handleInput = (e) =>
    setNewData({ ...newData, [e.target.name]: e.target.value });

  const handleCreate = async () => {
    if (
      !newData.kode_rute ||
      !newData.nama_rute ||
      !newData.asal ||
      !newData.tujuan ||
      !newData.jarak_km
    ) {
      Swal.fire("Peringatan", "Semua field harus diisi", "warning");
      return;
    }
    const dataToSend = { ...newData, jarak_km: parseInt(newData.jarak_km, 10) };

    try {
      await createRute(dataToSend);
      setNewData({
        kode_rute: "",
        nama_rute: "",
        asal: "",
        tujuan: "",
        jarak_km: "",
      });
      Swal.fire("Berhasil!", "Data berhasil ditambahkan", "success");
      fetchRutes();
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
          await deleteRute(id);
          Swal.fire("Dihapus!", "Data berhasil dihapus.", "success");
          fetchRutes();
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

  const handleEdit = (r) => {
    setEditId(r._id);
    setEditData({ ...r });
  };

  const handleEditChange = (e) =>
    setEditData({ ...editData, [e.target.name]: e.target.value });

  const handleUpdate = async () => {
    if (
      !editData.kode_rute ||
      !editData.nama_rute ||
      !editData.asal ||
      !editData.tujuan ||
      !editData.jarak_km
    ) {
      Swal.fire("Peringatan", "Semua field harus diisi", "warning");
      return;
    }
    const dataToSend = {
      ...editData,
      jarak_km: parseInt(editData.jarak_km, 10),
    };

    try {
      await updateRute(editId, dataToSend);
      setEditId(null);
      Swal.fire("Berhasil!", "Data berhasil diupdate", "success");
      fetchRutes();
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
      <h2 className="text-2xl font-bold text-blue-800 mb-6">Manajemen Rute</h2>

      {/* Form Tambah Rute */}
      <div className="bg-white rounded-2xl shadow p-6 space-y-5 max-w-3xl mx-auto">
        <h3 className="font-semibold text-gray-700 mb-2">Tambah Rute</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            name="kode_rute"
            placeholder="Kode Rute"
            value={newData.kode_rute}
            onChange={handleInput}
            className="border px-3 py-2 rounded"
          />
          <input
            type="text"
            name="nama_rute"
            placeholder="Nama Rute"
            value={newData.nama_rute}
            onChange={handleInput}
            className="border px-3 py-2 rounded"
          />
          <input
            type="text"
            name="asal"
            placeholder="Asal"
            value={newData.asal}
            onChange={handleInput}
            className="border px-3 py-2 rounded"
          />
          <input
            type="text"
            name="tujuan"
            placeholder="Tujuan"
            value={newData.tujuan}
            onChange={handleInput}
            className="border px-3 py-2 rounded"
          />
          <input
            type="number"
            name="jarak_km"
            placeholder="Jarak KM"
            value={newData.jarak_km}
            onChange={handleInput}
            className="border px-3 py-2 rounded"
          />
        </div>
        <div className="flex justify-end">
          <button
            onClick={handleCreate}
            className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 inline-flex items-center gap-2 mt-2"
          >
            <Plus size={16} /> Tambah
          </button>
        </div>
      </div>

      {/* Bagian Daftar Rute */}
      <div className="bg-white rounded-2xl shadow p-6 max-w-5xl mx-auto mt-8">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
          <h3 className="font-semibold text-gray-700 text-lg">Daftar Rute</h3>
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
                placeholder="Cari rute..."
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
              {filteredRutes.map((r) => (
                <tr key={r._id} className="border-t hover:bg-gray-50">
                  {editId === r._id ? (
                    <>
                      <td className="px-5 py-2">
                        <input
                          name="kode_rute"
                          value={editData.kode_rute}
                          onChange={handleEditChange}
                          className="border px-2 py-1 rounded w-full"
                        />
                      </td>
                      <td className="px-5 py-2">
                        <input
                          name="nama_rute"
                          value={editData.nama_rute}
                          onChange={handleEditChange}
                          className="border px-2 py-1 rounded w-full"
                        />
                      </td>
                      <td className="px-5 py-2">
                        <input
                          name="asal"
                          value={editData.asal}
                          onChange={handleEditChange}
                          className="border px-2 py-1 rounded w-full"
                        />
                      </td>
                      <td className="px-5 py-2">
                        <input
                          name="tujuan"
                          value={editData.tujuan}
                          onChange={handleEditChange}
                          className="border px-2 py-1 rounded w-full"
                        />
                      </td>
                      <td className="px-5 py-2">
                        <input
                          name="jarak_km"
                          type="number"
                          value={editData.jarak_km}
                          onChange={handleEditChange}
                          className="border px-2 py-1 rounded w-full"
                        />
                      </td>
                      <td className="px-5 py-2 text-center">
                        <button
                          onClick={handleUpdate}
                          className="text-green-600 hover:underline mr-3"
                        >
                          <Save size={16} />
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="text-gray-500 hover:underline"
                        >
                          <X size={16} />
                        </button>
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
                        <button
                          onClick={() => handleEdit(r)}
                          className="text-blue-600 hover:underline mr-3"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(r._id)}
                          className="text-red-600 hover:underline"
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