import React from "react";
import { supabase } from "./supabaseClient";

/* ================= COMPONENT REUSABLE ================= */
// Diletakkan di luar agar tidak di-render ulang saat state App berubah
const SectionTitle = ({ title }) => (
  <div className="bg-gradient-to-r from-blue-700 to-blue-600 text-white rounded-2xl px-5 py-3 shadow mb-6">
    <h2 className="text-base font-black tracking-wide uppercase">{title}</h2>
  </div>
);

const CardSection = ({ title, icon, color, children }) => {
  const colors = {
    blue: "bg-blue-50 border-blue-200",
    emerald: "bg-emerald-50 border-emerald-200",
    yellow: "bg-yellow-50 border-yellow-200",
  };
  return (
    <section className={`${colors[color] || colors.blue} border rounded-3xl p-5 shadow-sm`}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-xl bg-white shadow flex items-center justify-center text-sm">{icon}</div>
        <h3 className="text-base font-black">{title}</h3>
      </div>
      {children}
    </section>
  );
};

const InputField = ({ label, type = "text", className = "", ...props }) => (
  <div className="flex flex-col md:flex-row md:items-center print:flex-row mb-3">
    <label className="w-full md:w-52 font-bold text-sm text-slate-700 print:w-52">{label}</label>
    <span className="hidden print:block mx-2">:</span>
    {type === "textarea" ? (
      <textarea {...props} className="w-full flex-1 rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm outline-none focus:ring-4 focus:ring-blue-200 print:border-none print:border-b print:border-dotted print:border-black print:bg-transparent print:rounded-none print:ring-0 resize-none" rows={3} />
    ) : (
      <input type={type} {...props} className={`w-full md:flex-1 rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm outline-none focus:ring-4 focus:ring-blue-200 print:border-none print:border-b print:border-dotted print:border-black print:bg-transparent print:rounded-none print:ring-0 ${className}`} />
    )}
  </div>
);

const SelectField = ({ label, options, ...props }) => (
  <div className="flex flex-col md:flex-row md:items-center print:flex-row mb-3">
    <label className="w-full md:w-52 font-bold text-sm text-slate-700 print:w-52">{label}</label>
    <span className="hidden print:block mx-2">:</span>
    <select {...props} className="w-full md:flex-1 rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm outline-none focus:ring-4 focus:ring-blue-200 print:border-none print:border-b print:border-dotted print:border-black print:bg-transparent print:rounded-none print:ring-0 appearance-none">
      <option value="">-- Pilih --</option>
      {options.map((item) => <option key={item} value={item}>{item}</option>)}
    </select>
  </div>
);

/* ================= MAIN APPLICATION ================= */
export default function App() {
  const pendidikanList = ["SD/Sederajat", "SMP/Sederajat", "SMA/Sederajat", "D1", "D2", "D3", "D4/S1", "S2", "S3"];
  const pekerjaanList = ["Tidak Bekerja", "Petani", "Nelayan", "Wiraswasta", "Karyawan Swasta", "PNS", "TNI/POLRI", "Guru", "Pedagang", "Lainnya"];
  const penghasilanList = ["< Rp500.000", "Rp500.000 - Rp999.999", "Rp1.000.000 - Rp1.999.999", "Rp2.000.000 - Rp4.999.999", "> Rp5.000.000"];

  const [showLogin, setShowLogin] = React.useState(false);
  const [sudahSimpan, setSudahSimpan] = React.useState(false);
  const [sedangMenyimpan, setSedangMenyimpan] = React.useState(false);
  const [loginData, setLoginData] = React.useState({ username: "", password: "" });

  const [form, setForm] = React.useState({
    sekolah: "SDN KEDUNG PENGAWAS 04",
    tahunPelajaran: "2026/2027",
    nama: "", jk: "Laki-laki", nisn: "", tempatLahir: "", tanggalLahir: "",
    nik: "", kk: "", akta: "", agama: "Islam", kip: "Tidak", alamat: "",
    desa: "", kecamatan: "", kabupaten: "", provinsi: "", kodePos: "",
    anakKe: "", tinggal: "Orang Tua", transportasi: "Jalan Kaki", hp: "", maps: "",
    ayahNama: "", ayahNik: "", ayahTahun: "", ayahPendidikan: "", ayahPekerjaan: "", ayahPenghasilan: "",
    ibuNama: "", ibuNik: "", ibuTahun: "", ibuPendidikan: "", ibuPekerjaan: "", ibuPenghasilan: "",
    berat: 0, tinggi: 0, lingkar: 0, saudara: 0, hobi: "", cita: "", jarak: "", waktu: "",
    kotaTtd: "Babelan", tanggalTtd: ""
  });

  // --- LOGIC FUNCTIONS ---
  const hitungUsia = React.useCallback(() => {
    if (!form.tanggalLahir) return { tahun: 0, bulan: 0, status: "" };
    const lahir = new Date(form.tanggalLahir);
    const batas = new Date("2026-07-01");
    let tahun = batas.getFullYear() - lahir.getFullYear();
    let bulan = batas.getMonth() - lahir.getMonth();
    if (bulan < 0) { tahun--; bulan += 12; }

    let status = (tahun >= 7) ? "Prioritas (Usia 7 Tahun)" : 
                 (tahun >= 6) ? "Memenuhi Syarat" : 
                 (tahun === 5 && bulan >= 6) ? "Perlu surat psikolog" : "Tidak Memenuhi Syarat";
    return { tahun, bulan, status };
  }, [form.tanggalLahir]);

  const usiaSiswa = hitungUsia();

  const handleChange = (e) => {
    let { name, value } = e.target;
    if (["nik", "kk", "ayahNik", "ibuNik"].includes(name)) {
      value = value.replace(/\D/g, "").slice(0, 16);
    }
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const ambilLokasi = () => {
    if (!navigator.geolocation) return alert("Geolokasi tidak didukung browser");
    navigator.geolocation.getCurrentPosition((pos) => {
      const { latitude, longitude } = pos.coords;
      const latSekolah = -6.157834992333592, lngSekolah = 107.04103909701671;
      
      const R = 6371; // km
      const dLat = (latitude - latSekolah) * Math.PI / 180;
      const dLon = (longitude - lngSekolah) * Math.PI / 180;
      const a = Math.sin(dLat/2)**2 + Math.cos(latSekolah*Math.PI/180) * Math.cos(latitude*Math.PI/180) * Math.sin(dLon/2)**2;
      const jarak = (R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))).toFixed(2);

      setForm(prev => ({ ...prev, maps: `${latitude},${longitude}`, jarak }));
    }, () => alert("Gagal mengambil lokasi. Aktifkan GPS."));
  };

  const validasiForm = () => {
    if (!form.nama.trim()) return alert("Nama wajib diisi"), false;
    if (form.nik.length !== 16 || form.kk.length !== 16) return alert("NIK & KK harus 16 digit"), false;
    if (!form.jarak) return alert("Wajib ambil lokasi GPS"), false;
    if (usiaSiswa.status === "Tidak Memenuhi Syarat") return alert("Usia belum memenuhi syarat"), false;
    return true;
  };

  const simpanData = async () => {
    if (!validasiForm() || sedangMenyimpan) return;
    if (!window.confirm("Simpan data ke database?")) return;

    setSedangMenyimpan(true);
    try {
      const { error } = await supabase.from('pendaftar').insert([{
        ...form,
        nama: form.nama.trim(),
        berat: parseInt(form.berat),
        tinggi: parseInt(form.tinggi),
        jarak_rumah: parseFloat(form.jarak)
      }]);

      if (error) throw error;
      setSudahSimpan(true);
      alert("✅ Data Berhasil Tersimpan!");
    } catch (err) {
      alert(err.code === '23505' ? "⚠️ NIK sudah terdaftar!" : "❌ Error: " + err.message);
    } finally {
      setSedangMenyimpan(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-3 md:p-5 font-sans">
      <div className="max-w-7xl mx-auto bg-white rounded-3xl overflow-hidden shadow-2xl border print:shadow-none print:border-none">
        
        {/* HEADER */}
        <header className="bg-gradient-to-r from-blue-800 to-emerald-600 text-white p-6 relative">
          <button onClick={() => setShowLogin(true)} className="absolute top-5 right-5 bg-white text-blue-700 font-bold px-5 py-2 rounded-full shadow no-print">👤 Admin</button>
          <div className="flex flex-col md:flex-row gap-5 items-center">
            <div className="bg-white p-3 rounded-2xl shadow-lg"><img src="/logo.png" alt="Logo" className="w-20 h-20 object-contain" /></div>
            <div className="text-center md:text-left">
              <h1 className="text-2xl md:text-4xl font-black">PPDB ONLINE 2026/2027</h1>
              <div className="inline-block mt-2 bg-yellow-400 text-slate-900 px-4 py-1 rounded-full font-bold">SDN KEDUNG PENGAWAS 04</div>
            </div>
          </div>
        </header>

        <div className="p-6 space-y-8">
          {/* INFO UTAMA */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <CardSection title="Data Umum" icon="📘" color="blue">
              <InputField label="Sekolah Tujuan" name="sekolah" value={form.sekolah} readOnly />
              <InputField label="Tahun Pelajaran" name="tahunPelajaran" value={form.tahunPelajaran} readOnly />
            </CardSection>

            <CardSection title="Validasi Usia" icon="🟢" color="emerald">
              <InputField type="date" label="Tgl Lahir" name="tanggalLahir" value={form.tanggalLahir} onChange={handleChange} />
              <div className="mt-2 p-3 bg-white rounded-xl border text-center">
                <p className="text-xs text-gray-500 uppercase font-bold">Hasil Perhitungan</p>
                <h3 className="text-xl font-black text-emerald-600">{usiaSiswa.tahun} Thn {usiaSiswa.bulan} Bln</h3>
                <span className="text-xs font-bold px-2 py-1 bg-emerald-100 rounded text-emerald-700">{usiaSiswa.status || "---"}</span>
              </div>
            </CardSection>

            <CardSection title="Panduan" icon="🟡" color="yellow">
              <ul className="text-xs space-y-1 list-disc pl-4 font-medium text-slate-600">
                <li>Siapkan KK & Akta Kelahiran.</li>
                <li>Gunakan GPS untuk ukur jarak Zonasi.</li>
                <li>Simpan data sebelum mencetak.</li>
              </ul>
            </CardSection>
          </div>

          {/* FORM INPUT */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <SectionTitle title="I. Identitas Siswa" />
              <InputField label="Nama Lengkap" name="nama" value={form.nama} onChange={handleChange} placeholder="Sesuai Akta" />
              <SelectField label="Gender" name="jk" value={form.jk} options={["Laki-laki", "Perempuan"]} onChange={handleChange} />
              <InputField label="NIK (16 Digit)" name="nik" value={form.nik} onChange={handleChange} maxLength={16} />
              <InputField label="Nomor KK" name="kk" value={form.kk} onChange={handleChange} maxLength={16} />
              <InputField label="Alamat" type="textarea" name="alamat" value={form.alamat} onChange={handleChange} />
            </div>

            <div className="space-y-4">
              <SectionTitle title="II. Data Periodik" />
              <div className="grid grid-cols-2 gap-3">
                <InputField type="number" label="Tinggi (cm)" name="tinggi" value={form.tinggi} onChange={handleChange} />
                <InputField type="number" label="Berat (kg)" name="berat" value={form.berat} onChange={handleChange} />
              </div>
              <InputField label="Jarak Zonasi" name="jarak" value={form.jarak ? `${form.jarak} KM` : ""} readOnly placeholder="Klik tombol GPS di bawah" className="bg-blue-50 font-bold" />
              <button type="button" onClick={ambilLokasi} className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold shadow-md hover:bg-emerald-700 no-print">📍 Ambil Lokasi Otomatis</button>
            </div>
          </div>

          {/* ORANG TUA */}
          <SectionTitle title="III. Orang Tua" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 bg-blue-50 rounded-3xl border border-blue-100">
              <h4 className="font-black mb-4 text-blue-800">DATA AYAH</h4>
              <InputField label="Nama Ayah" name="ayahNama" value={form.ayahNama} onChange={handleChange} />
              <SelectField label="Pekerjaan" name="ayahPekerjaan" options={pekerjaanList} value={form.ayahPekerjaan} onChange={handleChange} />
            </div>
            <div className="p-5 bg-pink-50 rounded-3xl border border-pink-100">
              <h4 className="font-black mb-4 text-pink-800">DATA IBU</h4>
              <InputField label="Nama Ibu" name="ibuNama" value={form.ibuNama} onChange={handleChange} />
              <SelectField label="Pekerjaan" name="ibuPekerjaan" options={pekerjaanList} value={form.ibuPekerjaan} onChange={handleChange} />
            </div>
          </div>

          {/* TANDA TANGAN */}
          <div className="flex justify-end p-10">
            <div className="text-center w-64">
              <p className="mb-20">Babelan, {new Date().toLocaleDateString('id-ID')}</p>
              <p className="font-bold underline uppercase">{form.ayahNama || "(....................)"}</p>
              <p className="text-xs text-gray-500">Orang Tua / Wali Murid</p>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex gap-4 justify-center py-10 no-print">
            <button onClick={() => window.print()} className="bg-blue-700 text-white px-10 py-4 rounded-2xl font-black shadow-lg">🖨 CETAK PDF</button>
            <button onClick={simpanData} disabled={sedangMenyimpan} className={`${sedangMenyimpan ? 'bg-gray-400' : 'bg-emerald-600'} text-white px-10 py-4 rounded-2xl font-black shadow-lg`}>
              {sedangMenyimpan ? "⏳ MEMPROSES..." : "💾 SIMPAN DATA"}
            </button>
          </div>
        </div>

        <footer className="bg-blue-900 text-white text-center py-4 text-xs">
          © 2026 SDN KEDUNG PENGAWAS 04 - Sistem Pendaftaran Digital
        </footer>
      </div>

      {/* LOGIN MODAL (Simple) */}
      {showLogin && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl">
            <h2 className="text-2xl font-black mb-6 text-center">Admin Login</h2>
            <input type="text" placeholder="Username" className="w-full mb-4 p-3 border rounded-xl" onChange={(e) => setLoginData({...loginData, username: e.target.value})} />
            <input type="password" placeholder="Password" className="w-full mb-6 p-3 border rounded-xl" onChange={(e) => setLoginData({...loginData, password: e.target.value})} />
            <div className="flex gap-3">
              <button className="flex-1 bg-blue-700 text-white py-3 rounded-xl font-bold" onClick={() => loginData.password === "12345" ? window.location.href="/pendaftar" : alert("Salah!")}>Login</button>
              <button className="flex-1 bg-gray-200 py-3 rounded-xl font-bold" onClick={() => setShowLogin(false)}>Batal</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}