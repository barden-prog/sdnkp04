import React from "react";
import { supabase } from "./supabaseClient";

export default function App() {
  // ... (Daftar list pendidikan, pekerjaan, dan penghasilan tetap sama)
  const pendidikanList = ["SD/Sederajat", "SMP/Sederajat", "SMA/Sederajat", "D1", "D2", "D3", "D4/S1", "S2", "S3"];
  const pekerjaanList = ["Tidak Bekerja", "Petani", "Nelayan", "Wiraswasta", "Karyawan Swasta", "PNS", "TNI/POLRI", "Guru", "Pedagang", "Lainnya"];
  const penghasilanList = ["< Rp500.000", "Rp500.000 - Rp999.999", "Rp1.000.000 - Rp1.999.999", "Rp2.000.000 - Rp4.999.999", "> Rp5.000.000"];

  const [showLogin, setShowLogin] = React.useState(false);
  const [sudahSimpan, setSudahSimpan] = React.useState(false);
  const [sedangMenyimpan, setSedangMenyimpan] = React.useState(false);

  const [form, setForm] = React.useState({
    sekolah: "SDN KEDUNG PENGAWAS 04",
    tahunPelajaran: "2026/2027",
    nama: "",
    jk: "Laki-laki",
    nisn: "",
    tempatLahir: "",
    tanggalLahir: "",
    nik: "",
    kk: "",
    akta: "",
    agama: "Islam",
    kip: "Tidak",
    alamat: "",
    desa: "",
    kecamatan: "",
    kabupaten: "",
    provinsi: "",
    kodePos: "",
    anakKe: "",
    tinggal: "Orang Tua",
    transportasi: "Jalan Kaki",
    hp: "",
    maps: "",
    ayahNama: "",
    ayahNik: "",
    ayahTahun: "",
    ayahPendidikan: "",
    ayahPekerjaan: "",
    ayahPenghasilan: "",
    ibuNama: "",
    ibuNik: "",
    ibuTahun: "",
    ibuPendidikan: "",
    ibuPekerjaan: "",
    ibuPenghasilan: "",
    berat: 0,
    tinggi: 0,
    lingkar: 0,
    saudara: 0,
    hobi: "",
    cita: "",
    jarak: "",
    waktu: "",
    kotaTtd: "Babelan",
    tanggalTtd: "",
  });

  // State untuk formulir & status penyimpanan
  const simpanData = async () => {
    if (!validasiForm()) return;
    if (sedangMenyimpan) return;

    const konfirmasi = window.confirm("Apakah data pendaftaran ingin disimpan ke database?");
    if (!konfirmasi) return;

    try {
      setSedangMenyimpan(true);

      // Mengambil semua data dari state 'form' dan memetakannya ke kolom database
      const { data, error } = await supabase
        .from('pendaftar')
        .insert([
          {
            sekolah: form.sekolah,
            tahun_pelajaran: form.tahunPelajaran,
            nama: form.nama.trim(),
            jk: form.jk,
            nisn: form.nisn,
            tempat_lahir: form.tempatLahir,
            tanggal_lahir: form.tanggalLahir,
            nik: form.nik,
            kk: form.kk,
            akta: form.akta,
            agama: form.agama,
            kip: form.kip,
            alamat: form.alamat,
            desa: form.desa,
            kecamatan: form.kecamatan,
            kabupaten: form.kabupaten,
            provinsi: form.provinsi,
            kode_pos: form.kodePos,
            anak_ke: form.anakKe,
            tinggal: form.tinggal,
            transportasi: form.transportasi,
            hp: form.hp,
            maps: form.maps,
            ayah_nama: form.ayahNama,
            ayah_nik: form.ayahNik,
            ayah_tahun: form.ayahTahun,
            ayah_pendidikan: form.ayahPendidikan,
            ayah_pekerjaan: form.ayahPekerjaan,
            ayah_penghasilan: form.ayahPenghasilan,
            ibu_nama: form.ibuNama,
            ibu_nik: form.ibuNik,
            ibu_tahun: form.ibuTahun,
            ibu_pendidikan: form.ibuPendidikan,
            ibu_pekerjaan: form.ibuPekerjaan,
            ibu_penghasilan: form.ibuPenghasilan,
            berat: parseInt(form.berat),
            tinggi: parseInt(form.tinggi),
            lingkar: parseInt(form.lingkar),
            saudara: parseInt(form.saudara),
            hobi: form.hobi,
            cita: form.cita,
            jarak: form.jarak,
            waktu: form.waktu,
            kota_ttd: form.kotaTtd,
            tanggal_ttd: form.tanggalTtd
          }
        ]);
if (error) throw error;

      setSudahSimpan(true);
      alert("✅ Data Berhasil Tersimpan! Silakan cetak formulir Anda.");
    } catch (error) {
      console.error("Supabase Error:", error);
      if (error.code === '23505') {
        alert("⚠️ GAGAL: NIK ini sudah terdaftar sebelumnya.");
      } else {
        alert("❌ Terjadi kesalahan: " + error.message);
      }
    } finally {
      setSedangMenyimpan(false);
    }
  };

  const loginAdmin = () => {
    if (loginData.username === "admin" && loginData.password === "12345") {
      alert("Login berhasil");
      localStorage.setItem("login", "true");
      window.location.href = "/pendaftar";
    } else {
      alert("Username atau password salah");
    }
  };

  const hitungUsia = React.useCallback(() => {
    if (!form.tanggalLahir) return { tahun: 0, bulan: 0, status: "" };

    const lahir = new Date(form.tanggalLahir);
    const batas = new Date("2026-07-01");

    let tahun = batas.getFullYear() - lahir.getFullYear();
    let bulan = batas.getMonth() - lahir.getMonth();

    if (bulan < 0) {
      tahun--;
      bulan += 12;
    }

    let status = "";
    if (tahun >= 7) {
      status = "Prioritas (Usia 7 Tahun)";
    } else if (tahun >= 6) {
      status = "Memenuhi Syarat";
    } else if (tahun === 5 && bulan >= 6) {
      status = "Perlu surat psikolog";
    } else {
      status = "Tidak Memenuhi Syarat";
    }

    return { tahun, bulan, status };
  }, [form.tanggalLahir]);

  const usiaSiswa = hitungUsia();

  const handleChange = (e) => {
    let { name, value } = e.target;

    if (name === "nik" || name === "kk") {
      value = value.replace(/\D/g, "");
      value = value.slice(0, 16);
    }

    const updatedForm = {
      ...form,
      [name]: value,
    };

    setForm(updatedForm);

    if (name === "tanggalLahir") {
      setTimeout(() => {
        const usia = hitungUsia();
        if (usia.status === "Tidak Memenuhi Syarat") {
          alert("Usia calon peserta didik belum memenuhi syarat PPDB.");
        }
      }, 100);
    }
  };

  const getKelas = () => {
    if (
      usiaSiswa.status === "Memenuhi Syarat" ||
      usiaSiswa.status === "Prioritas (Usia 7 Tahun)" ||
      usiaSiswa.status === "Perlu surat psikolog"
    ) {
      return "Kelas 1";
    }
    return "Belum Memenuhi";
  };

  const hitungJarak = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(2);
  };

  const ambilLokasi = () => {
    if (!navigator.geolocation) {
      alert("Geolokasi tidak didukung oleh browser Anda");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latSiswa = Number(position.coords.latitude);
        const lngSiswa = Number(position.coords.longitude);

        const latSekolah = -6.157834992333592;
        const lngSekolah = 107.04103909701671;

        const jarakSiswa = hitungJarak(
          latSekolah,
          lngSekolah,
          latSiswa,
          lngSiswa
        );

        setForm((prev) => ({
          ...prev,
          maps: `${latSiswa},${lngSiswa}`,
          jarak: jarakSiswa,
        }));
      },
      (error) => {
        alert(
          "Gagal mengambil lokasi. Pastikan izin lokasi perangkat / browser aktif."
        );
      }
    );
  };

  const validasiForm = () => {
    if (!form.nama.trim()) {
      alert("Nama peserta didik wajib diisi");
      return false;
    }
    if (form.nik.length !== 16) {
      alert("NIK harus 16 digit");
      return false;
    }
    if (form.kk.length !== 16) {
      alert("Nomor KK harus 16 digit");
      return false;
    }
    if (!form.jarak || parseFloat(form.jarak) === 0) {
      alert(
        "Wajib klik tombol 'Ambil Titik Lokasi otomatis' terlebih dahulu untuk menghitung Zonasi Jarak Rumah!"
      );
      return false;
    }
    return true;
  };

  const cetakPDF = () => {
    if (!validasiForm()) return;
    if (!sudahSimpan) {
      alert("Simpan data terlebih dahulu sebelum mencetak");
      return;
    }
    window.print();
  };

  const simpanData = async () => {
    if (!validasiForm()) return;
    if (sedangMenyimpan) return; // Mencegah double klik brutal saat proses sedang jalan

    const konfirmasi = window.confirm("Apakah data pendaftaran ingin disimpan?");
    if (!konfirmasi) return;

    try {
      setSedangMenyimpan(true);
      const jarakMurni = parseFloat(form.jarak) || 0.0;

      const dataDikirim = {
        nama: form.nama.trim(),
        jk: form.jk,
        nisn: form.nisn ? form.nisn.trim() : "",
        tempat_lahir: form.tempatLahir ? form.tempatLahir.trim() : "",
        tanggal_lahir: form.tanggalLahir,
        nik: form.nik,
        kk: form.kk,
        akta: form.akta ? form.akta.trim() : "",
        agama: form.agama,
        kip: form.kip,
        alamat: form.alamat ? form.alamat.trim() : "",
        desa: form.desa ? form.desa.trim() : "",
        kecamatan: form.kecamatan ? form.kecamatan.trim() : "",
        kabupaten: form.kabupaten ? form.kabupaten.trim() : "",
        provinsi: form.provinsi ? form.provinsi.trim() : "",
        hp: form.hp ? form.hp.trim() : "",
        ayah_nama: form.ayahNama ? form.ayahNama.trim() : "",
        ibu_nama: form.ibuNama ? form.ibuNama.trim() : "",
        maps: form.maps,
        jarak_rumah: jarakMurni,
      };

      const baseUrl = window.location.origin;

      const response = await fetch(`${baseUrl}/.netlify/functions/simpan`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataDikirim),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSudahSimpan(true);
        alert("✅ " + result.message);
      } else {
        // Cek jika error bermuara dari data duplikat pendaftar
        if (response.status === 409 || result.code === "DUPLICATE_ENTRY") {
          alert("⚠️ GAGAL: Calon siswa dengan NIK atau identitas tersebut SUDAH TERDAFTAR sebelumnya!");
        } else {
          alert("❌ Gagal menyimpan: " + (result.error || "Terjadi masalah internal pada server."));
        }
      }
    } catch (error) {
      console.error(error);
      alert(
        "❌ Server gagal terhubung. Coba pastikan kembali koneksi internet Anda."
      );
    } finally {
      setSedangMenyimpan(false); // Membuka kembali kunci tombol setelah pengiriman selesai
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-3 md:p-5">
      <div className="print-container max-w-7xl mx-auto bg-white rounded-3xl overflow-hidden shadow-2xl border">
        {/* HEADER */}
        <div className="header-print bg-gradient-to-r from-blue-800 via-blue-700 to-emerald-600 text-white p-6 relative">
          <div className="absolute top-5 right-5 no-print">
            <button
              onClick={() => setShowLogin(true)}
              className="bg-white text-blue-700 font-bold px-5 py-2 rounded-full shadow-lg hover:bg-blue-50"
            >
              👤 Login Admin
            </button>
          </div>
          <div className="flex flex-col md:flex-row gap-3 items-center">
            <div className="bg-white p-4 rounded-3xl shadow-lg">
              <img
                src="/logo.png"
                alt="Logo Sekolah"
                className="w-24 h-24 object-contain print:w-20 print:h-20 block"
              />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-black">
                PENDAFTARAN PESERTA DIDIK BARU
              </h1>
              <p className="text-2xl mt-2 font-semibold">
                Tahun Pelajaran 2026/2027
              </p>
              <div className="inline-block mt-4 bg-yellow-400 text-slate-900 px-6 py-3 rounded-full font-black shadow">
                SDN KEDUNG PENGAWAS 04
              </div>
            </div>
          </div>
        </div>

        <div className="p-5 space-y-6">
          {/* TOP CARDS */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <CardSection title="DATA UMUM" icon="📘" color="blue">
              <div className="space-y-5">
                <Input
                  label="Nama Sekolah Tujuan"
                  name="sekolah"
                  value={form.sekolah}
                  onChange={handleChange}
                />
                <Input
                  label="Tahun Pelajaran"
                  name="tahunPelajaran"
                  value={form.tahunPelajaran}
                  onChange={handleChange}
                />
              </div>
            </CardSection>

            <CardSection title="VALIDASI USIA" icon="🟢" color="emerald">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="date"
                  label="Tanggal Lahir"
                  name="tanggalLahir"
                  value={form.tanggalLahir}
                  onChange={handleChange}
                />
                <div className="bg-white p-3 border rounded-2xl flex flex-col items-center justify-center text-center">
                  <span className="text-gray-500 text-sm">Usia Anak</span>
                  <h3 className="text-lg font-black text-emerald-600">
                    {usiaSiswa.tahun} Thn {usiaSiswa.bulan} Bln
                  </h3>
                  <p className="text-xs font-semibold mt-1 text-gray-700">
                    {usiaSiswa.status || "-"}
                  </p>
                </div>
              </div>
            </CardSection>

            <CardSection title="PANDUAN" icon="🟡" color="yellow">
              <ul className="list-decimal pl-5 space-y-1 text-xs leading-relaxed text-slate-700">
                <li>Siapkan dokumen KK, Akta dan KTP.</li>
                <li>Lakukan validasi usia terlebih dahulu.</li>
                <li>NIK dan KK wajib 16 digit.</li>
                <li>Pendaftar wajib klik tombol GPS di bagian bawah form.</li>
                <li>Isi data dengan lengkap.</li>
                <li>Gunakan tombol CETAK / SIMPAN.</li>
              </ul>
            </CardSection>
          </div>

          {/* IDENTITAS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* KOLOM I / IDENTITAS */}
            <div className="space-y-4">
              <SectionTitle title="I. IDENTITAS PESERTA DIDIK" />
              <div className="space-y-3">
                <Input
                  label="Nama Lengkap"
                  name="nama"
                  value={form.nama}
                  onChange={handleChange}
                  disabled={usiaSiswa.status === "Tidak Memenuhi Syarat"}
                />
                <Select
                  label="Jenis Kelamin"
                  name="jk"
                  value={form.jk}
                  onChange={handleChange}
                  options={["Laki-laki", "Perempuan"]}
                />
                <Input
                  label="NISN"
                  name="nisn"
                  value={form.nisn}
                  onChange={handleChange}
                />
                <Input
                  label="Tempat Lahir"
                  name="tempatLahir"
                  value={form.tempatLahir}
                  onChange={handleChange}
                />
                <Input
                  label="NIK Siswa"
                  name="nik"
                  value={form.nik}
                  onChange={handleChange}
                  maxLength={16}
                  inputMode="numeric"
                  className={
                    form.nik && form.nik.length < 16
                      ? "border-red-500 border-2"
                      : ""
                  }
                />
                {form.nik && form.nik.length < 16 && (
                  <p className="text-red-500 text-xs -mt-2 pl-2">
                    NIK harus 16 digit
                  </p>
                )}

                <Input
                  label="No. KK"
                  name="kk"
                  value={form.kk}
                  onChange={handleChange}
                  maxLength={16}
                  inputMode="numeric"
                  className={
                    form.kk && form.kk.length < 16
                      ? "border-red-500 border-2"
                      : ""
                  }
                />
                {form.kk && form.kk.length < 16 && (
                  <p className="text-red-500 text-xs -mt-2 pl-2">
                    Nomor KK harus 16 digit
                  </p>
                )}

                <Input
                  label="No. Akta"
                  name="akta"
                  value={form.akta}
                  onChange={handleChange}
                />
                <Input
                  label="Anak Ke-"
                  name="anakKe"
                  value={form.anakKe}
                  onChange={handleChange}
                />
                <Select
                  label="Agama"
                  name="agama"
                  value={form.agama}
                  onChange={handleChange}
                  options={[
                    "Islam",
                    "Kristen",
                    "Katolik",
                    "Hindu",
                    "Buddha",
                    "Konghucu",
                  ]}
                />
                <Select
                  label="Penerima KIP"
                  name="kip"
                  value={form.kip}
                  onChange={handleChange}
                  options={["Ya", "Tidak"]}
                />
                <TextArea
                  label="Alamat Rumah"
                  name="alamat"
                  value={form.alamat}
                  onChange={handleChange}
                />
                <Input
                  label="Provinsi"
                  name="provinsi"
                  value={form.provinsi}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* KOLOM KANAN / PERIODIK */}
            <div className="space-y-4">
              <SectionTitle title="II. DATA PERIODIK PESERTA DIDIK" />
              <div className="space-y-3">
                <Input label="Masuk Di Kelas" value={getKelas()} readOnly />
                <Input
                  type="number"
                  label="Berat Badan (kg)"
                  name="berat"
                  value={form.berat}
                  onChange={handleChange}
                />
                <Input
                  type="number"
                  label="Tinggi Badan (cm)"
                  name="tinggi"
                  value={form.tinggi}
                  onChange={handleChange}
                />
                <Input
                  type="number"
                  label="Lingkar Kepala (cm)"
                  name="lingkar"
                  value={form.lingkar}
                  onChange={handleChange}
                />
                <Input
                  type="number"
                  label="Jumlah Saudara"
                  name="saudara"
                  value={form.saudara}
                  onChange={handleChange}
                />
                <Input
                  label="Hobi"
                  name="hobi"
                  value={form.hobi}
                  onChange={handleChange}
                />
                <Input
                  label="Cita-Cita"
                  name="cita"
                  value={form.cita}
                  onChange={handleChange}
                />
                <Select
                  label="Jenis Tinggal"
                  name="tinggal"
                  value={form.tinggal}
                  onChange={handleChange}
                  options={["Orang Tua", "Wali", "Asrama"]}
                />
                <Input
                  label="No HP Orang Tua"
                  name="hp"
                  value={form.hp}
                  onChange={handleChange}
                />
                <Input
                  label="Desa"
                  name="desa"
                  value={form.desa}
                  onChange={handleChange}
                />
                <Input
                  label="Kecamatan"
                  name="kecamatan"
                  value={form.kecamatan}
                  onChange={handleChange}
                />
                <Input
                  label="Kabupaten"
                  name="kabupaten"
                  value={form.kabupaten}
                  onChange={handleChange}
                />
                <Input
                  label="Kode Pos"
                  name="kodePos"
                  value={form.kodePos}
                  onChange={handleChange}
                />
                <Select
                  label="Alat Transportasi"
                  name="transportasi"
                  value={form.transportasi}
                  onChange={handleChange}
                  options={["Jalan Kaki", "Sepeda", "Motor", "Mobil"]}
                />
                <Select
                  label="Waktu Tempuh"
                  name="waktu"
                  value={form.waktu}
                  onChange={handleChange}
                  options={["5 Menit", "10 Menit", "30 Menit", "1 Jam"]}
                />
                <Input
                  label="Jarak Tempuh Ke Sekolah"
                  name="jarak"
                  value={
                    form.jarak
                      ? `${form.jarak} KM`
                      : "Silakan Klik Tombol Ambil Lokasi"
                  }
                  readOnly
                  className="font-bold text-blue-700 bg-slate-50"
                />
              </div>
            </div>
          </div>

          {/* MAPS SECTION */}
          <div className="no-print">
            <CardSection title="LOKASI RUMAH SISWA" icon="📍" color="emerald">
              <div className="flex flex-col md:flex-row gap-4">
                <input
                  type="text"
                  name="maps"
                  value={form.maps}
                  onChange={handleChange}
                  readOnly
                  placeholder="Titik Koordinat otomatis terisi..."
                  className="flex-1 rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm font-mono"
                />
                <button
                  type="button"
                  onClick={ambilLokasi}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-2xl font-bold shadow transition-all duration-150"
                >
                  📍 Ambil Titik Lokasi otomatis
                </button>
              </div>

              {form.maps && (
                <iframe
                  title="maps"
                  src={`https://maps.google.com/maps?q=${form.maps}&z=15&output=embed`}
                  className="w-full h-[300px] rounded-3xl mt-5 border"
                  loading="lazy"
                />
              )}
            </CardSection>
          </div>

          {/* ORANG TUA */}
          <SectionTitle title="III. IDENTITAS ORANG TUA" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <ParentCard title="DATA AYAH" color="blue">
              <div className="space-y-3">
                <Input
                  label="Nama Ayah"
                  name="ayahNama"
                  value={form.ayahNama}
                  onChange={handleChange}
                />
                <Input
                  label="NIK Ayah"
                  name="ayahNik"
                  value={form.ayahNik}
                  onChange={handleChange}
                />
                <Input
                  type="date"
                  label="Tanggal Lahir Ayah"
                  name="ayahTahun"
                  value={form.ayahTahun}
                  onChange={handleChange}
                />
                <Select
                  label="Pendidikan"
                  name="ayahPendidikan"
                  value={form.ayahPendidikan}
                  onChange={handleChange}
                  options={pendidikanList}
                />
                <Select
                  label="Pekerjaan"
                  name="ayahPekerjaan"
                  value={form.ayahPekerjaan}
                  onChange={handleChange}
                  options={pekerjaanList}
                />
                <Select
                  label="Penghasilan"
                  name="ayahPenghasilan"
                  value={form.ayahPenghasilan}
                  onChange={handleChange}
                  options={penghasilanList}
                />
              </div>
            </ParentCard>

            <ParentCard title="DATA IBU" color="pink">
              <div className="space-y-3">
                <Input
                  label="Nama Ibu"
                  name="ibuNama"
                  value={form.ibuNama}
                  onChange={handleChange}
                />
                <Input
                  label="NIK Ibu"
                  name="ibuNik"
                  value={form.ibuNik}
                  onChange={handleChange}
                />
                <Input
                  type="date"
                  label="Tanggal Lahir Ibu"
                  name="ibuTahun"
                  value={form.ibuTahun}
                  onChange={handleChange}
                />
                <Select
                  label="Pendidikan"
                  name="ibuPendidikan"
                  value={form.ibuPendidikan}
                  onChange={handleChange}
                  options={pendidikanList}
                />
                <Select
                  label="Pekerjaan"
                  name="ibuPekerjaan"
                  value={form.ibuPekerjaan}
                  onChange={handleChange}
                  options={pekerjaanList}
                />
                <Select
                  label="Penghasilan"
                  name="ibuPenghasilan"
                  value={form.ibuPenghasilan}
                  onChange={handleChange}
                  options={penghasilanList}
                />
              </div>
            </ParentCard>
          </div>

          {/* TTD */}
          <SectionTitle title="IV. TITIMANGSA (PENGESAHAN)" />
          <div className="flex justify-between items-start p-4">
            <div className="space-y-2">
              <Input
                type="date"
                label="Tanggal Pengesahan"
                name="tanggalTtd"
                value={form.tanggalTtd}
                onChange={handleChange}
                className="no-print"
              />
            </div>
            <div className="text-center w-64 border p-4 bg-slate-50 rounded-2xl shadow-sm">
              <p className="font-semibold text-sm">
                Babelan, {form.tanggalTtd || "..................."}
              </p>
              <br />
              <br />
              <br />
              <p className="font-bold underline text-sm">
                ( {form.ayahNama || "................................"} )
              </p>
              <p className="text-xs text-gray-500">Orang Tua / Wali Murid</p>
            </div>
          </div>

          {/* MEMO CATATAN HASIL CETAK */}
          <div className="mt-6 border-2 border-dashed border-slate-300 bg-amber-50/50 rounded-3xl p-5 print:mt-10 print:border-black print:bg-transparent">
            <h3 className="font-black text-base text-amber-900 border-b border-amber-200 pb-2 mb-3 flex items-center gap-2 print:text-black print:border-black">
              📢 Catatan Kepada Peserta Didik Baru :
            </h3>
            <ol className="list-decimal pl-5 space-y-2 text-xs font-semibold text-slate-700 leading-relaxed print:text-black">
              <li>
                Lampirkan <strong>Fotocopy KK</strong> &{" "}
                <strong>Fotocopy KTP Orang Tua</strong>
              </li>
              <li>
                Lampirkan <strong>Fotocopy Akte Kelahiran</strong> (Jika ada)
              </li>
              <li>
                Tulislah Formulir PPDB ini dengan <strong>TULISAN yang Jelas</strong>{" "}
                <span className="text-slate-500 font-normal italic print:text-black print:not-italic">
                  (untuk memudahkan Penginputan di Aplikasi DAPODIK)
                </span>
              </li>
              <li>
                Jika berasal dari TK / KB agar melampirkan{" "}
                <strong>Fotocopy IJAZAH</strong>
              </li>
              <li>
                Susunlah Berkas-berkas tersebut lalu di{" "}
                <strong>streples dijadikan satu</strong> kemudian masukkan ke dalam{" "}
                <strong>Map Pendaftaran</strong>
              </li>
            </ol>
            <p className="text-xs font-bold text-emerald-700 mt-4 text-right italic print:text-black">
              Terima Kasih.
            </p>
          </div>

          {/* BUTTON ACTIONS */}
          <div className="flex flex-col md:flex-row gap-5 justify-center pt-4 no-print">
            <button
              onClick={cetakPDF}
              className="bg-blue-700 hover:bg-blue-800 text-white px-8 py-4 rounded-2xl font-black shadow-lg"
            >
              🖨 CETAK / SAVE PDF
            </button>
            <button
              onClick={simpanData}
              disabled={sedangMenyimpan}
              className={`${
                sedangMenyimpan
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-emerald-600 hover:bg-emerald-700"
              } text-white px-8 py-4 rounded-2xl font-black shadow-lg transition-all duration-150`}
            >
              {sedangMenyimpan ? "⏳ MEMPROSES..." : "💾 SIMPAN DATA"}
            </button>
          </div>
        </div>

        <footer className="bg-blue-900 text-white text-center py-4 text-sm mt-10">
          © 2026 SDN KEDUNG PENGAWAS 04. All Rights Reserved.
        </footer>

        {/* MODAL LOGIN */}
        {showLogin && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-3xl p-6 w-[350px] shadow-2xl">
              <h2 className="text-2xl font-black text-center mb-5">
                Login Admin
              </h2>
              <div className="space-y-4">
                <Input
                  label="Username"
                  name="username"
                  value={loginData.username}
                  onChange={handleLoginChange}
                />
                <Input
                  type="password"
                  name="password"
                  label="Password"
                  value={loginData.password}
                  onChange={handleLoginChange}
                />
                <div className="flex gap-3 pt-3">
                  <button
                    onClick={loginAdmin}
                    className="flex-1 bg-blue-700 text-white py-3 rounded-2xl font-bold"
                  >
                    Masuk
                  </button>
                  <button
                    onClick={() => setShowLogin(false)}
                    className="flex-1 bg-gray-200 py-3 rounded-2xl font-bold"
                  >
                    Batal
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ================= COMPONENT REUSABLE ================= */
function SectionTitle({ title }) {
  return (
    <div className="section-title bg-gradient-to-r from-blue-700 to-blue-600 text-white rounded-2xl px-5 py-3 shadow">
      <h2 className="text-base font-black tracking-wide">{title}</h2>
    </div>
  );
}

function CardSection({ title, icon, color, children }) {
  const colors = {
    blue: "bg-blue-50 border-blue-200",
    emerald: "bg-emerald-50 border-emerald-200",
    yellow: "bg-yellow-50 border-yellow-200",
  };

  return (
    <section className={`${colors[color]} border rounded-3xl p-5 shadow-sm`}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-xl bg-white shadow flex items-center justify-center text-sm">
          {icon}
        </div>
        <h3 className="text-base font-black">{title}</h3>
      </div>
      {children}
    </section>
  );
}

function ParentCard({ title, color, children }) {
  const colors = {
    blue: "bg-blue-50 border-blue-200",
    pink: "bg-pink-50 border-pink-200",
  };

  return (
    <div className={`${colors[color]} border rounded-3xl p-5 shadow-sm`}>
      <h3 className="font-black text-base mb-4">{title}</h3>
      {children}
    </div>
  );
}

function TextArea({ label, ...props }) {
  return (
    <div className="flex flex-col md:flex-row md:items-start print:flex-row">
      <label className="w-full md:w-52 font-bold text-sm mb-2 block print:w-52 text-slate-700">
        {label}
      </label>
      <span className="hidden print:block mx-2">:</span>
      <textarea
        {...props}
        rows={3}
        className="w-full flex-1 rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm outline-none focus:ring-4 focus:ring-blue-200 print:border-none print:border-b print:border-dotted print:border-black print:bg-transparent print:rounded-none print:ring-0 resize-none"
      />
    </div>
  );
}

function Input({ label, className = "", ...props }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center print:flex-row">
      <label className="w-full md:w-52 font-bold text-sm mb-1 md:mb-0 block print:w-52 text-slate-700">
        {label}
      </label>
      <span className="hidden print:block mx-2">:</span>
      <input
        {...props}
        className={`w-full md:flex-1 rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm outline-none focus:ring-4 focus:ring-blue-200 print:border-none print:border-b print:border-dotted print:border-black print:bg-transparent print:rounded-none print:px-2 print:py-1 print:ring-0 ${className}`}
      />
    </div>
  );
}

function Select({ label, options, ...props }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center print:flex-row">
      <label className="w-full md:w-52 font-bold text-sm mb-1 md:mb-0 block print:w-52 text-slate-700">
        {label}
      </label>
      <span className="hidden print:block mx-2">:</span>
      <select
        {...props}
        className="w-full md:flex-1 rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm outline-none focus:ring-4 focus:ring-blue-200 print:border-none print:border-b print:border-dotted print:border-black print:bg-transparent print:rounded-none print:px-2 print:py-1 print:ring-0"
      >
        <option value="">-- Pilih --</option>
        {options.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
    </div>
  );
}
/* ================= COMPONENT REUSABLE (PLACE OUTSIDE MAIN APP) ================= */

function SectionTitle({ title }) {
  return (
    <div className="section-title bg-gradient-to-r from-blue-700 to-blue-600 text-white rounded-2xl px-5 py-3 shadow mb-6">
      <h2 className="text-base font-black tracking-wide">{title}</h2>
    </div>
  );
}

function CardSection({ title, icon, color, children }) {
  const colors = {
    blue: "bg-blue-50 border-blue-200",
    emerald: "bg-emerald-50 border-emerald-200",
    yellow: "bg-yellow-50 border-yellow-200",
  };

  return (
    <section className={`${colors[color] || colors.blue} border rounded-3xl p-5 shadow-sm mb-6`}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-xl bg-white shadow flex items-center justify-center text-sm">
          {icon}
        </div>
        <h3 className="text-base font-black">{title}</h3>
      </div>
      <div className="space-y-4">
        {children}
      </div>
    </section>
  );
}

function ParentCard({ title, color, children }) {
  const colors = {
    blue: "bg-blue-50 border-blue-200",
    pink: "bg-pink-50 border-pink-200",
  };

  return (
    <div className={`${colors[color] || colors.blue} border rounded-3xl p-5 shadow-sm mb-6`}>
      <h3 className="font-black text-base mb-4">{title}</h3>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
}

function TextArea({ label, ...props }) {
  return (
    <div className="flex flex-col md:flex-row md:items-start print:flex-row mb-3">
      <label className="w-full md:w-52 font-bold text-sm mb-2 block print:w-52 text-slate-700">
        {label}
      </label>
      <span className="hidden print:block mx-2">:</span>
      <textarea
        {...props}
        rows={3}
        className="w-full flex-1 rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm outline-none focus:ring-4 focus:ring-blue-200 print:border-none print:border-b print:border-dotted print:border-black print:bg-transparent print:rounded-none print:px-2 print:py-1 print:ring-0"
      />
    </div>
  );
}

function Input({ label, className = "", ...props }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center print:flex-row mb-3">
      <label className="w-full md:w-52 font-bold text-sm mb-1 md:mb-0 block print:w-52 text-slate-700">
        {label}
      </label>
      <span className="hidden print:block mx-2">:</span>
      <input
        {...props}
        className={`w-full md:flex-1 rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm outline-none focus:ring-4 focus:ring-blue-200 print:border-none print:border-b print:border-dotted print:border-black print:bg-transparent print:rounded-none print:px-2 print:py-1 print:ring-0 ${className}`}
      />
    </div>
  );
}

function Select({ label, options, ...props }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center print:flex-row mb-3">
      <label className="w-full md:w-52 font-bold text-sm mb-1 md:mb-0 block print:w-52 text-slate-700">
        {label}
      </label>
      <span className="hidden print:block mx-2">:</span>
      <select
        {...props}
        className="w-full md:flex-1 rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm outline-none focus:ring-4 focus:ring-blue-200 print:border-none print:border-b print:border-dotted print:border-black print:bg-transparent print:rounded-none print:px-2 print:py-1 print:ring-0 appearance-none"
      >
        <option value="">-- Pilih --</option>
        {options.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
    </div>
  );
}