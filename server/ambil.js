exports.handler = async (event) => {
  // 1. KONFIGURASI & HEADERS
  const SUPABASE_URL = "https://ozvhbaychsopmbamnxyh.supabase.co";
  const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96dmhiYXljaHNvcG1iYW1ueHloIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTIxMDcyNCwiZXhwIjoyMDk0Nzg2NzI0fQ.1CK5bY-LJgPKvHeqJ0DUgjt7m4-hSBFPr8KNbX1NgSI";

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle Preflight Request
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers };
  }

  // Tolak jika bukan method GET
  if (event.httpMethod !== 'GET') {
    return { 
      statusCode: 405, 
      headers, 
      body: JSON.stringify({ message: 'Method Not Allowed' }) 
    };
  }

  try {
    // 2. FETCH DATA DARI SUPABASE
    // Menggunakan template literal untuk URL yang lebih bersih
    const endpoint = `${SUPABASE_URL}/rest/v1/pendaftar?select=*&order=jarak.asc`;

    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Gagal mengambil data');
    }

    const data = await response.json();

    // 3. RETURN DATA KE FRONTEND
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(data)
    };

  } catch (error) {
    console.error("Fetch Error:", error.message);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        success: false, 
        error: error.message 
      })
    };
  }
};