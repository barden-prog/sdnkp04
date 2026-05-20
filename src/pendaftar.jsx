import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient"; // Pastikan file ini sudah dibuat
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import kop from "./assets/kop.png";

export default function Pendaftar() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch Data dari Supabase
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const { data: pendaftar, error } = await supabase
        .from("pendaftar")
        .select("*")
        .order("jarak", { ascending: true }); // Langsung urutkan dari DB

      if (error) throw error;
      setData(pendaftar || []);
    } catch (err) {
      console.error("Error fetching data:", err.message);
      alert("Gagal mengambil data dari database");
    } finally {
      setLoading(false);
    }
  };

  /* ================= PDF EXPORT ================= */
  const exportPDF = () => {
    const doc = new jsPDF();
    const img = new Image();
    img.src = kop;

    img.onload = () => {
      // Header Kop Surat
      doc.addImage(img, "PNG", 10, 5, 190, 35);
      const pageWidth = doc.internal.pageSize.getWidth();

      doc.setFontSize(14).setFont("helvetica", "bold");
      doc.text("DATA PENDAFTAR PPDB", pageWidth / 2, 48, { align: "center" });
      
      doc.setFontSize(11).setFont("helvetica", "normal");
      doc.text("SDN Kedung Pengawas 04", pageWidth / 2, 54, { align: "center" });

      autoTable(doc, {
        startY: 62,
        theme: "grid",
        headStyles: { fillColor: [37, 99, 235] },
        head: [["Rank", "Nama", "NIK", "HP", "Alamat", "Jarak"]],
        body: data.map((item, i) => [
          i + 1,
          item.nama || "-",
          item.nik || "-",
          item.hp || "-",
          item.desa || "-",
          `${item.jarak || 0} KM`,
        ]),
      });

      doc.save(`PPDB_SDNKP04_${new Date().toLocaleDateString()}.pdf`);
    };
  };

  /* ================= EXCEL EXPORT ================= */
  const exportExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Data Pendaftar");

    // Header Styling
    sheet.mergeCells("A1:H1");
    const title = sheet.getCell("A1");
    title.value = "REKAPITULASI PENDAFTAR PPDB SDN KEDUNG PENGAWAS 04";
    title.font = { bold: true, size: 14 };
    title.alignment = { horizontal: "center" };

    const header = ["Rank", "Nama", "NIK", "NISN", "HP", "Alamat", "Jarak", "Tanggal Daftar"];
    const headerRow = sheet.addRow(header);

    headerRow.eachCell((cell) => {
      cell.font = { bold: true, color: { argb: "FFFFFF" } };
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "2563EB" } };
      cell.border = { top: {style:'thin'}, left: {style:'thin'}, bottom: {style:'thin'}, right: {style:'thin'} };
    });

    // Add Data Rows
    data.forEach((item, i) => {
      sheet.addRow([
        i + 1,
        item.nama,
        item.nik,
        item.nisn,
        item.hp,
        `${item.alamat}, ${item.desa}`,
        `${item.jarak} KM`,
        new Date(item.created_at).toLocaleDateString("id-ID")
      ]);
    });

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), "Data_Pendaftar_PPDB.xlsx");
  };

  const logout = () => {
    localStorage.removeItem("login");
    navigate("/");
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="font-bold text-slate-600">Sinkronisasi Database...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      {/* NAVIGATION / HEADER */}
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-blue-600 p-3 rounded-2xl text-white text-2xl">📚</div>
            <div>
              <h1 className="text-2xl font-black text-slate-800">Panel Admin PPDB</h1>
              <p className="text-slate-500 text-sm">SDN Kedung Pengawas 04</p>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            <button onClick={exportExcel} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-emerald-100">
              <span>📊</span> Excel
            </button>
            <button onClick={exportPDF} className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-rose-100">
              <span>📄</span> PDF
            </button>
            <button onClick={logout} className="ml-2 bg-slate-100 hover:bg-slate-200 text-slate-600 px-5 py-2.5 rounded-xl transition-all font-bold">
              Logout
            </button>
          </div>
        </div>

        {/* STATS QUICK VIEW */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-blue-600 p-6 rounded-3xl text-white shadow-xl shadow-blue-100">
            <p className="opacity-80">Total Pendaftar</p>
            <h3 className="text-4xl font-black">{data.length} <span className="text-lg font-normal">Siswa</span></h3>
          </div>
        </div>

        {/* MAIN TABLE */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="p-4 font-black text-slate-600 w-20">Rank</th>
                  <th className="p-4 font-black text-slate-600">Nama Lengkap</th>
                  <th className="p-4 font-black text-slate-600">NIK / NISN</th>
                  <th className="p-4 font-black text-slate-600">Kontak</th>
                  <th className="p-4 font-black text-slate-600">Wilayah</th>
                  <th className="p-4 font-black text-slate-600 text-right">Jarak Rumah</th>
                </tr>
              </thead>
              <tbody>
                {data.length > 0 ? (
                  data.map((item, i) => (
                    <tr key={item.id || i} className="border-b border-slate-100 hover:bg-blue-50/50 transition-colors">
                      <td className="p-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold 
                          ${i === 0 ? 'bg-yellow-100 text-yellow-700' : 
                            i === 1 ? 'bg-slate-200 text-slate-700' : 
                            i === 2 ? 'bg-orange-100 text-orange-700' : 'text-slate-400'}`}>
                          {i + 1}
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="font-bold text-slate-800 uppercase">{item.nama}</p>
                        <p className="text-xs text-slate-500 italic">{item.jk === 'L' ? 'Laki-laki' : 'Perempuan'}</p>
                      </td>
                      <td className="p-4">
                        <p className="text-sm font-mono text-slate-600">{item.nik}</p>
                        <p className="text-xs text-slate-400">{item.nisn || 'Tidak ada NISN'}</p>
                      </td>
                      <td className="p-4 text-sm text-slate-600">
                        {item.hp}
                      </td>
                      <td className="p-4">
                        <p className="text-sm text-slate-700">{item.desa}</p>
                        <p className="text-xs text-slate-400">{item.kecamatan}</p>
                      </td>
                      <td className="p-4 text-right">
                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-black">
                          {item.jarak} KM
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="p-10 text-center text-slate-400 italic">
                      Belum ada pendaftar yang masuk.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}