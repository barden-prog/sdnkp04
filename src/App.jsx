import React from "react";

export default function App() {
  const pendidikanList = [
    "SD/Sederajat",
    "SMP/Sederajat",
    "SMA/Sederajat",
    "D1",
    "D2",
    "D3",
    "D4/S1",
    "S2",
    "S3",
  ];

  const pekerjaanList = [
    "Tidak Bekerja",
    "Petani",
    "Nelayan",
    "Wiraswasta",
    "Karyawan Swasta",
    "PNS",
    "TNI/POLRI",
    "Guru",
    "Pedagang",
    "Lainnya",
  ];

  const penghasilanList = [
    "< Rp500.000",
    "Rp500.000 - Rp999.999",
    "Rp1.000.000 - Rp1.999.999",
    "Rp2.000.000 - Rp4.999.999",
    "> Rp5.000.000",
  ];
  const [showLogin, setShowLogin] = React.useState(false);


const [loginData, setLoginData] = React.useState({
  username: "",
  password: "",
});


const handleLoginChange = (e) => {
  setLoginData({
    ...loginData,
    [e.target.name]: e.target.value,
  });
};


const loginAdmin = () => {


  // contoh login sederhana
  if (
    loginData.username === "admin" &&
    loginData.password === "12345"
  ) {
    alert("Login berhasil");


    // arahkan ke halaman data pendaftar
    window.location.href="/pendaftar";


  } else {
    alert("Username atau password salah");
  }
  
};
localStorage.setItem(
"login",
"true"
);
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
  const [sudahSimpan,setSudahSimpan] =
  React.useState(false);
const handleChange = (e) => {

let {name,value}=e.target;

/* VALIDASI NIK & KK */
if(name==="nik" || name==="kk"){

// hanya angka
value=value.replace(/\D/g,"");

// maksimal 16 digit
value=value.slice(0,16);

}


const updatedForm={

...form,
[name]:value

};

setForm(updatedForm);


/* VALIDASI USIA */
if(name==="tanggalLahir"){

setTimeout(()=>{

const usia=hitungUsia();

if(
usia.status==="Tidak Memenuhi Syarat"
){

alert(
"Usia calon peserta didik belum memenuhi syarat PPDB."
);

}

},100);

}

};
  const hitungUsia = () => {

  if (!form.tanggalLahir)
    return {
      tahun:0,
      bulan:0,
      status:""
    };

  const lahir = new Date(form.tanggalLahir);

  // acuan PPDB
  const batas = new Date("2026-07-01");

  let tahun =
    batas.getFullYear() -
    lahir.getFullYear();

  let bulan =
    batas.getMonth() -
    lahir.getMonth();

  if (bulan < 0) {
    tahun--;
    bulan += 12;
  }

  let status = "";

  // prioritas usia 7 tahun
  if(tahun >= 7){

    status =
    "Prioritas (Usia 7 Tahun)";

  }

  // memenuhi syarat normal
  else if(tahun >= 6){

    status =
    "Memenuhi Syarat";

  }

  // usia 5 tahun 6 bulan
  else if(
    tahun === 5 &&
    bulan >= 6
  ){

    status =
    "Perlu surat psikolog";

  }

  // tidak memenuhi
  else{

    status =
    "Tidak Memenuhi Syarat";

  }

  return {
    tahun,
    bulan,
    status
  };
};


const getKelas=()=>{

const usia=hitungUsia();

if(
usia.status==="Memenuhi Syarat" ||
usia.status==="Prioritas (Usia 7 Tahun)" ||
usia.status==="Perlu surat psikolog"
){

return "Kelas 1";

}

return "Belum Memenuhi";
};
const ambilLokasi = () => {

  navigator.geolocation.getCurrentPosition((position) => {

    const latSiswa = position.coords.latitude;
    const lngSiswa = position.coords.longitude;

    /* LOKASI SEKOLAH */
    const latSekolah = -6.157834992333592;
    const lngSekolah = 107.04103909701671;

    const jarak = hitungJarak(
      latSiswa,
      lngSiswa,
      latSekolah,
      lngSekolah
    );

    setForm({
      ...form,
      maps: `${latSiswa},${lngSiswa}`,
      jarak: `${jarak} KM`
    });
  });
};
const validasiForm = ()=>{

if(!form.nama.trim()){

alert(
"Nama peserta didik wajib diisi"
);

return false;

}

if(
form.nik.length !== 16
){

alert(
"NIK harus 16 digit"
);

return false;

}

if(
form.kk.length !== 16
){

alert(
"Nomor KK harus 16 digit"
);

return false;

}

return true;

};
const hitungJarak = (lat1, lon1, lat2, lon2) => {

  const R = 6371;

  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;

  const a =
    Math.sin(dLat / 2) *
    Math.sin(dLat / 2) +

    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *

    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);

  const c = 2 * Math.atan2(
    Math.sqrt(a),
    Math.sqrt(1 - a)
  );

  return (R * c).toFixed(2);
};
const cetakPDF = ()=>{

if(!validasiForm()){
return;
}

if(!sudahSimpan){

alert(
"Simpan data terlebih dahulu sebelum mencetak"
);

return;

}

window.print();

};
const simpanData = async ()=>{

if(!validasiForm()){
return;
}

const konfirmasi = window.confirm(
"Apakah data pendaftaran ingin disimpan?"
);

if(!konfirmasi){
return;
}

try{

const response = await fetch(
"http://localhost:8080/ppdb-api/simpan.php",
{
method:"POST",

headers:{
Accept:"application/json",
"Content-Type":"application/json",
},

body:JSON.stringify(form)

}
);

const text =
await response.text();

const result =
JSON.parse(text);

if(
result.status==="success"
){

setSudahSimpan(true);

alert(
"✅ Data berhasil disimpan"
);

}else{

alert(
result.message
);

}

}catch(error){

console.log(error);

alert(
"❌ Server gagal terhubung"
);

}

};
  return (
    <div className="min-h-screen bg-slate-100 p-3 md:p-5">
      <div className="print-container max-w-7xl mx-auto bg-white rounded-3xl overflow-hidden shadow-2xl border">
      <div className="section-title bg-gradient-to-r from-blue-700 to-blue-600 text-white rounded-2xl px-5 py-4 shadow"></div>
        {/* HEADER */}
        <div className="header-print bg-gradient-to-r from-blue-800 via-blue-700 to-emerald-600 text-white p-6 relative">
          {/* LOGIN POJOK KANAN */}
          <div className="absolute top-5 right-5">

          <button
          onClick={() => setShowLogin(true)}
          className="
          bg-white
          text-blue-700
          font-bold
          px-5
          py-2
          rounded-full
          shadow-lg
          hover:bg-blue-50
          "
          >
          👤 Login Admin
          </button>

          </div>
          <div className="flex flex-col md:flex-row gap-3 items-center">
            <div className="bg-white p-4 rounded-3xl shadow-lg">
             <img
              src="/logo.png"
              alt="Logo Sekolah"
              className="
              w-24
              h-24
              object-contain
              print:w-20
              print:h-20
              block
                    "
              /> </div>

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

        <div className="p-2 space-y-2">

          {/* TOP */}
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

                <div className="bg-white border rounded-2xl flex flex-col items-center justify-center">
                  <span className="text-gray-500 text-sm">
                    Usia Anak
                  </span>
                    <h3 className="text-xl font-black text-emerald-600">

                    {hitungUsia().tahun} Tahun
                    {hitungUsia().bulan} Bulan

                    </h3>

                    <p className="text-sm mt-2">

                    {hitungUsia().status}

                    </p>
                   </div>
              </div>

            </CardSection>

            <CardSection title="PANDUAN PENGISIAN FORMULIR" icon="🟡" color="yellow">

              <ul className="list-decimal pl-5 space-y-2 text-sm leading-relaxed">
                <li>Siapkan dokumen KK, Akta dan KTP.</li>
                <li>Lakukan validasi usia terlebih dahulu.</li>
                <li>NIK dan KK wajib 16 digit.</li>
                <li>NISN dapat dikosongkan.</li>
                <li>Isi data dengan lengkap.</li>
                <li>Gunakan tombol CETAK / SIMPAN.</li>
              </ul>

            </CardSection>
          </div>

          {/* IDENTITAS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

  {/* KOLOM KIRI */}
  <div>

    <SectionTitle title="I. IDENTITAS PESERTA DIDIK" />

    <div className="space-y-2">

        <Input
        label="Nama Lengkap"
        name="nama"
        value={form.nama}
        onChange={handleChange}

        disabled={
        hitungUsia().status==="Tidak Memenuhi Syarat"
        }
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
        type="date"
        label="Tanggal Lahir"
        name="tanggalLahir"
        value={form.tanggalLahir}
        onChange={handleChange}
      />
      <Input
      label="NIK Siswa"
      name="nik"
      value={form.nik}
      onChange={handleChange}
      maxLength={16}
      inputMode="numeric"
            
      className={`${
      form.nik &&
      form.nik.length < 16
      ? "border-red-500 border-2"
      : ""
      }`}
      />
      
      {
      form.nik &&
      form.nik.length < 16 && (
      <p className="text-red-500 text-sm mt-1">
      NIK harus 16 digit
      </p>
      )
      }
      
      
      <Input
      label="No. KK"
      name="kk"
      value={form.kk}
      onChange={handleChange}
      maxLength={16}
      inputMode="numeric"
      
      className={`${
      form.kk &&
      form.kk.length < 16
      ? "border-red-500 border-2"
      : ""
      }`}
      />
      
      {
      form.kk &&
      form.kk.length < 16 && (
      <p className="text-red-500 text-sm mt-1">
      Nomor KK harus 16 digit
      </p>
      )
      }
                                    
      <Input
        label="No. Akta"
        name="akta"
        value={form.akta}
        onChange={handleChange}
      />
       <Input label="Anak Ke-" name="anakKe" value={form.anakKe} onChange={handleChange} />
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
      <Input label="Provinsi" name="provinsi" value={form.provinsi} onChange={handleChange} />
    </div>
  </div>

  {/* KOLOM KANAN */}
  <div>

    <SectionTitle title="II. DATA PERIODIK PESERTA DIDIK" />

    <div className="space-y-2">

      <Input
        label="Masuk Di Kelas"
        value={getKelas()}
        readOnly
      />

      <Input type="number" label="Berat Badan" />

      <Input type="number" label="Tinggi Badan" />

      <Input type="number" label="Lingkar Kepala" />

      <Input type="number" label="Jumlah Saudara" />

      <Input label="Hobi" />

      <Input label="Cita-Cita" />
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
  <div className="space-y-2 mt-3">
   <Input label="Desa" name="desa" value={form.desa} onChange={handleChange} />
   <Input label="Kecamatan" name="kecamatan" value={form.kecamatan} onChange={handleChange} />
   <Input label="Kabupaten" name="kabupaten" value={form.kabupaten} onChange={handleChange} />
   
   <Input label="Kode Pos" name="kodePos" value={form.kodePos} onChange={handleChange} />
              <Select
  label="Waktu Tempuh"
  options={[
    "5 Menit",
    "10 Menit",
    "30 Menit",
    "1 Jam",
  ]}
/>
    </div>
  </div>

</div>
            <Select
              label="Alat Transportasi"
              name="transportasi"
              value={form.transportasi}
              onChange={handleChange}
              options={["Jalan Kaki", "Sepeda", "Motor", "Mobil"]}
            />
              <Select
              label="Jarak"
              options={[
                "< 1 KM",
                "1 - 3 KM",
                "3 - 5 KM",
                "> 5 KM",
              ]}
            />
          </div>

          {/* MAPS */}
          <div className="no-print">
          <CardSection
            title="LOKASI RUMAH SISWA"
            icon="📍"
            color="emerald"
          >

            <div className="flex flex-col md:flex-row gap-4">
              <Input
                label="Jarak Rumah ke Sekolah"
                name="jarak"
                value={form.jarak}
                readOnly
              />
              <input
                type="text"
                name="maps"
                value={form.maps}
                onChange={handleChange}
                placeholder="Latitude,Longitude"
                className="flex-1 rounded-2xl border border-slate-300 px-4 py-3"
              />

              <button
                type="button"
                onClick={ambilLokasi}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-2xl font-bold shadow"
              >
                📍 Ambil Titik Lokasi
              </button>
            </div>

            {form.maps && (
              <iframe
                title="maps"
                src={`https://maps.google.com/maps?q=${form.maps}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                className="w-full h-[350px] rounded-3xl mt-5 border"
                loading="lazy"
              />
            )}

          </CardSection>
            </div>
          {/* ORANG TUA */}
          <SectionTitle title="III. IDENTITAS ORANG TUA" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            <ParentCard title="DATA AYAH" color="blue">

              <div className="space-y-2">
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
                  label="Tahun Lahir"
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

              <div className="space-y-2">
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
                label="Tahun Lahir"
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
                <div className="ttd-print">

              <p>
                Babelan, {form.tanggalTtd}
              </p>

              <br /><br /><br />

              <p>
                ( {form.ayahNama || "................................"} )
              </p>

              <p>Orang Tua / Wali Murid</p>

              </div>
         {/* BUTTON */}
          <div className="flex flex-col md:flex-row gap-5 justify-center pt-8">

            <button
              onClick={cetakPDF}
              className="bg-blue-700 hover:bg-blue-800 text-white px-8 py-4 rounded-2xl font-black shadow-lg"
            >
              🖨 CETAK / SAVE PDF
            </button>

            <button
              onClick={simpanData}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-2xl font-black shadow-lg"
            >
              💾 SIMPAN DATA
            </button>
          </div>
        </div>
{/* MODAL LOGIN */}

{showLogin && (

<div className="
fixed
inset-0
bg-black/50
flex
items-center
justify-center
z-50
">

<div className="
bg-white
rounded-3xl
p-6
w-[350px]
shadow-2xl
">

<h2 className="
text-2xl
font-black
text-center
mb-5
">
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
label="Password"
name="password"
value={loginData.password}
onChange={handleLoginChange}
/>

<div className="flex gap-3 pt-3">

<button
onClick={loginAdmin}
className="
flex-1
bg-blue-700
text-white
py-3
rounded-2xl
font-bold
"
>
Masuk
</button>

<button
onClick={() => setShowLogin(false)}
className="
flex-1
bg-gray-200
py-3
rounded-2xl
font-bold
"
>
Batal
</button>

</div>

</div>

</div>

</div>

)}
        <footer className="bg-blue-900 text-white text-center py-4">
          © 2026 SDN KEDUNG PENGAWAS 04. All Rights Reserved.
        </footer>
      </div>
    </div>
  );
}

/* ================= COMPONENT ================= */
function SectionTitle({ title }) {
  return (
    <div
      className="
        section-title
        bg-gradient-to-r
        from-blue-700
        to-blue-600
        text-white
        rounded-2xl
        px-5
        py-3
        shadow
      "
    >
      <h2 className="text-xl font-black tracking-wide">
        {title}
      </h2>
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

      <div className="flex items-center gap-3 mb-5">

        <div className="w-10 h-10 rounded-xl bg-white shadow flex items-center justify-center">
          {icon}
        </div>

        <h3 className="text-xl font-black">
          {title}
        </h3>
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
    <div className={`${colors[color]} border rounded-3xl p-5`}>

      <h3 className="font-black text-xl mb-5">
        {title}
      </h3>

      {children}
    </div>
  );
}
function TextArea({ label, ...props }) {
  return (
    <div>

      <label className="block font-bold text-sm mb-2">
        {label}
      </label>

      <textarea
        {...props}
        rows={4}
        className="
          w-full
          rounded-2xl
          border
          border-slate-300
          bg-white
          px-4
          py-3
          outline-none
          focus:ring-4
          focus:ring-blue-200

          print:border-none
          print:border-b
          print:border-dotted
          print:border-black
          print:bg-transparent
          print:rounded-none
          print:ring-0
        "
      />
    </div>
  );
}
function Input({ label, className="", ...props }) {
  return (
    <div className="flex items-center md:block print:flex">

      <label
        className="
        w-56
        font-bold
        text-sm
        mb-2
        block
        print:w-56
      "
      >
        {label}
      </label>

      <span className="hidden print:block mx-2">:</span>

      <input
        {...props}
        className={`
          w-full
          rounded-2xl
          border
          border-slate-300
          bg-white
          px-4
          py-3
          outline-none
          focus:ring-4
          focus:ring-blue-200

          print:flex-1
          print:border-none
          print:border-b
          print:border-dotted
          print:border-black
          print:bg-transparent
          print:rounded-none
          print:px-2
          print:py-1
          print:ring-0

          ${className}
        `}
      />
    </div>
  );
}
function Select({ label, options, ...props }) {
  return (
    <div className="flex items-center md:block print:flex">

      <label className="
        w-56
        font-bold
        text-sm
        mb-2
        block
        print:w-56
      ">
        {label}
      </label>

      <span className="hidden print:block mx-2">:</span>

      <select
        {...props}
        className="
          w-full
          rounded-2xl
          border
          border-slate-300
          bg-white
          px-4
          py-3
          outline-none
          focus:ring-4
          focus:ring-blue-200

          print:flex-1
          print:border-none
          print:border-b
          print:border-dotted
          print:border-black
          print:bg-transparent
          print:rounded-none
          print:px-2
          print:py-1
          print:ring-0
        "
      >

        {options.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}

      </select>
    </div>
  );
}