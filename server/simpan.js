const https = require('https');
/**
 * @param {string} url
 * @param {string} method
 * @param {object} headers
 * @param {object|null} bodyData
 */
const supabaseRequest = (url, method, headers, bodyData = null) => {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    
    const options = {
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      method: method,
      headers: {
        ...headers,
        'Content-Type': 'application/json',
      }
    };

    const req = https.request(options, (res) => {
      let data = '';

      // Mengumpulkan potongan data (chunks)
      res.on('data', (chunk) => {
        data += chunk;
      });

      // Proses saat data selesai diterima
      res.on('end', () => {
        let parsedData;
        try {
          // Parse JSON jika data tidak kosong, jika kosong return objek kosong
          parsedData = data ? JSON.parse(data) : {};
        } catch (e) {
          // Jika gagal parse (bukan format JSON), kirim teks mentah
          parsedData = data;
        }

        resolve({
          ok: res.statusCode >= 200 && res.statusCode < 300,
          statusCode: res.statusCode,
          data: parsedData
        });
      });
    });

    // Menangani error jaringan atau request
    req.on('error', (err) => {
      reject(err);
    });

    // Kirim body data jika ada (untuk POST/PATCH)
    if (bodyData) {
      req.write(JSON.stringify(bodyData));
    }

    req.end();
  });
};

module.exports = supabaseRequest;

const supabaseRequest = (url, method, headers, bodyData = null) => {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      method: method,
      headers: headers
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          // Hanya parse jika ada data yang diterima
          const parsedData = data ? JSON.parse(data) : {};
          resolve({
            ok: res.statusCode >= 200 && res.statusCode < 300,
            statusCode: res.statusCode,
            data: parsedData
          });
        } catch (e) {
          resolve({
            ok: res.statusCode >= 200 && res.statusCode < 300,
            statusCode: res.statusCode,
            data: data
          });
        }
      });
    });

    req.on('error', (err) => reject(err));
    if (bodyData) req.write(JSON.stringify(bodyData));
    req.end();
  });
};

exports.handler = async (event) => {
  // 1. KONFIGURASI
  const SUPABASE_URL = "https://ozvhbaychsopmbamnxyh.supabase.co";
  const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96dmhiYXljaHNvcG1iYW1ueHloIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTIxMDcyNCwiZXhwIjoyMDk0Nzg2NzI0fQ.1CK5bY-LJgPKvHeqJ0DUgjt7m4-hSBFPr8KNbX1NgSI";

  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  const authHeaders = {
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${SUPABASE_KEY}`
  };

  // Handle browser preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders };
  }

  try {
    const reqBody = JSON.parse(event.body);

    // 2. MAPPING DATA (Sesuai kolom tabel public.pendaftar)
    const dataSiswa = {
      sekolah:          reqBody.sekolah || null,
      tahun_pelajaran:  reqBody.tahun_pelajaran || null,
      nama:             reqBody.nama || null,
      jk:               reqBody.jk || null,
      nisn:             reqBody.nisn || null,
      tempat_lahir:     reqBody.tempat_lahir || null,
      tanggal_lahir:    reqBody.tanggal_lahir || null,
      nik:              reqBody.nik || null,
      kk:               reqBody.kk || null,
      akta:             reqBody.akta || null,
      agama:            reqBody.agama || null,
      kip:              reqBody.kip || null,
      alamat:           reqBody.alamat || null,
      desa:             reqBody.desa || null,
      kecamatan:        reqBody.kecamatan || null,
      kabupaten:        reqBody.kabupaten || null,
      provinsi:         reqBody.provinsi || null,
      kode_pos:         reqBody.kode_pos || null,
      anak_ke:          reqBody.anak_ke || null,
      tinggal:          reqBody.tinggal || null,
      transportasi:     reqBody.transportasi || null,
      hp:               reqBody.hp || null,
      maps:             reqBody.maps || null,
      ayah_nama:        reqBody.ayah_nama || null,
      ayah_nik:         reqBody.ayah_nik || null,
      ayah_tahun:       reqBody.ayah_tahun || null,
      ayah_pendidikan:  reqBody.ayah_pendidikan || null,
      ayah_pekerjaan:   reqBody.ayah_pekerjaan || null,
      ayah_penghasilan: reqBody.ayah_penghasilan || null,
      ibu_nama:         reqBody.ibu_nama || null,
      ibu_nik:          reqBody.ibu_nik || null,
      ibu_tahun:        reqBody.ibu_tahun || null,
      ibu_pendidikan:   reqBody.ibu_pendidikan || null,
      ibu_pekerjaan:    reqBody.ibu_pekerjaan || null,
      ibu_penghasilan:  reqBody.ibu_penghasilan || null,
      berat:            reqBody.berat ? parseInt(reqBody.berat) : null,
      tinggi:           reqBody.tinggi ? parseInt(reqBody.tinggi) : null,
      lingkar:          reqBody.lingkar ? parseInt(reqBody.lingkar) : null,
      saudara:          reqBody.saudara ? parseInt(reqBody.saudara) : null,
      hobi:             reqBody.hobi || null,
      cita:             reqBody.cita || null,
      jarak:            reqBody.jarak || null,
      waktu:            reqBody.waktu || null,
      kota_ttd:         reqBody.kota_ttd || null,
      tanggal_ttd:      reqBody.tanggal_ttd || null
    };

    // 3. VALIDASI NIK UNIK
    if (dataSiswa.nik) {
      const checkRes = await supabaseRequest(
        `${SUPABASE_URL}/rest/v1/pendaftar?nik=eq.${dataSiswa.nik}&select=nik`,
        'GET',
        authHeaders
      );

      if (checkRes.data && checkRes.data.length > 0) {
        return {
          statusCode: 400,
          headers: corsHeaders,
          body: JSON.stringify({ 
            success: false, 
            message: `NIK ${dataSiswa.nik} sudah terdaftar!` 
          })
        };
      }
    }

    // 4. INSERT DATA
    const insertRes = await supabaseRequest(
      `${SUPABASE_URL}/rest/v1/pendaftar`,
      'POST',
      { 
        ...authHeaders, 
        'Content-Type': 'application/json', 
        'Prefer': 'return=representation' 
      },
      dataSiswa
    );

    if (!insertRes.ok) {
      throw new Error(insertRes.data?.message || 'Gagal menyimpan ke database');
    }

    // 5. RESPONSE SUKSES
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ 
        success: true, 
        message: 'Pendaftaran Berhasil!', 
        id: insertRes.data[0]?.id 
      })
    };

  } catch (error) {
    console.error("Error pendaftaran:", error.message);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ 
        success: false, 
        error: error.message 
      })
    };
  }
};