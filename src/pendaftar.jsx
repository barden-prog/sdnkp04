import React from "react";
import { useNavigate } from "react-router-dom";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import kop from "./assets/kop.png";

export default function Pendaftar() {
  const navigate = useNavigate();

  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch("http://localhost:8080/ppdb-api/pendaftar.php")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
        return res.json();
      })
      .then((result) => {
        const daftar = Array.isArray(result) ? result : [];

        const sorted = daftar.sort(
          (a, b) =>
            parseFloat(a.jarak_rumah || 9999) -
            parseFloat(b.jarak_rumah || 9999)
        );

        setData(sorted);
      })
      .catch((err) => console.log("Fetch Error:", err.message))
      .finally(() => setLoading(false));
  }, []);

  /* ================= PDF ================= */
  const exportPDF = () => {
    const doc = new jsPDF();
    const img = new Image();
    img.src = kop;

    img.onload = () => {
      doc.addImage(img, "PNG", 10, 5, 190, 35);

      const pageWidth = doc.internal.pageSize.getWidth();

      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("DATA PENDAFTAR PPDB", pageWidth / 2, 48, {
        align: "center",
      });

      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      doc.text("SDN Kedung Pengawas 04", pageWidth / 2, 54, {
        align: "center",
      });

      autoTable(doc, {
        startY: 62,
        theme: "grid",
        head: [["Rank", "Nama", "NIK", "HP", "Alamat", "Jarak"]],
        body: data.map((item, i) => [
          i + 1,
          item.nama || "-",
          item.nik || "-",
          item.hp || "-",
          item.alamat || "-",
          `${item.jarak_rumah || 0} KM`,
        ]),
      });

      doc.save("Data_Pendaftar_PPDB.pdf");
    };
  };

  /* ================= EXCEL (FIXED + KOTAK + WARNA) ================= */
  const exportExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("PPDB");

    // TITLE
    sheet.mergeCells("A1:V1");
    sheet.getCell("A1").value = "DATA SISWA PENDAFTAR";
    sheet.getCell("A1").font = { bold: true, size: 14 };
    sheet.getCell("A1").alignment = { horizontal: "center" };

    sheet.mergeCells("A2:V2");
    sheet.getCell("A2").value = "SDN KEDUNG PENGAWAS 04";
    sheet.getCell("A2").alignment = { horizontal: "center" };

    sheet.mergeCells("A3:V3");
    sheet.getCell("A3").value = `Total Pendaftar: ${data.length}`;
    sheet.getCell("A3").alignment = { horizontal: "center" };

    sheet.addRow([]);

    // HEADER
    const header = [
      "ID","Nama","JK","NISN","Tempat Lahir","Tanggal Lahir",
      "NIK","KK","Akta","Agama","KIP","Alamat","Desa",
      "Kecamatan","Kabupaten","Provinsi","HP","Ayah","Ibu",
      "Maps","Jarak","Dibuat"
    ];

    const headerRow = sheet.addRow(header);

    headerRow.eachCell((cell) => {
      cell.font = { bold: true, color: { argb: "FFFFFF" } };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "2563EB" },
      };
      cell.alignment = { horizontal: "center" };
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });

    // DATA
    data.forEach((item) => {
      sheet.addRow([
        item.id || "-",
        item.nama || "-",
        item.jk || "-",
        item.nisn || "-",
        item.tempat_lahir || "-",
        item.tanggal_lahir || "-",
        item.nik || "-",
        item.kk || "-",
        item.akta || "-",
        item.agama || "-",
        item.kip || "-",
        item.alamat || "-",
        item.desa || "-",
        item.kecamatan || "-",
        item.kabupaten || "-",
        item.provinsi || "-",
        item.hp || "-",
        item.ayah_nama || "-",
        item.ibu_nama || "-",
        item.maps || "-",
        `${item.jarak_rumah || 0} KM`,
        item.created_at || "-",
      ]);
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(blob, "Data_Pendaftar_PPDB.xlsx");
  };

  /* ================= LOGOUT ================= */
  const logout = () => {
    localStorage.removeItem("login");
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        ⏳ Memuat data...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-6">

      {/* HEADER */}
      <div className="bg-gradient-to-r from-blue-700 to-emerald-600 p-6 text-white rounded-3xl flex justify-between mb-6">
        <div>
          <h1 className="text-3xl font-black">📚 Data Pendaftar PPDB</h1>
          <p>SDN Kedung Pengawas 04</p>
        </div>

        <div className="flex gap-3">
          <button onClick={exportExcel} className="bg-green-600 px-4 py-2 rounded-xl">Excel</button>
          <button onClick={exportPDF} className="bg-orange-500 px-4 py-2 rounded-xl">PDF</button>
          <button onClick={logout} className="bg-red-500 px-4 py-2 rounded-xl">Logout</button>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-3xl shadow overflow-hidden">

        <div className="bg-blue-600 text-white p-4">
          <h2 className="text-xl font-bold">DATA SISWA PENDAFTAR</h2>
        </div>

        <table className="w-full">
          <thead>
            <tr className="bg-blue-700 text-white">
              <th className="p-3">Rank</th>
              <th className="p-3">Nama</th>
              <th className="p-3">NIK</th>
              <th className="p-3">HP</th>
              <th className="p-3">Alamat</th>
              <th className="p-3">Jarak</th>
            </tr>
          </thead>

          <tbody>
            {data.map((item, i) => (
              <tr key={i} className="border-b hover:bg-blue-50">
                <td className="text-center font-bold p-3">
                  {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : i + 1}
                </td>
                <td className="p-3">{item.nama}</td>
                <td className="p-3">{item.nik}</td>
                <td className="p-3">{item.hp}</td>
                <td className="p-3">{item.alamat}</td>
                <td className="p-3 text-green-600 font-bold">
                  {item.jarak_rumah} KM
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}