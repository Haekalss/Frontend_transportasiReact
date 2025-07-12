import axios from 'axios';
import Swal from 'sweetalert2';

const apiClient = axios.create({
  baseURL: 'http://localhost:8088/api',
});

// --- INTERCEPTOR UNTUK REQUEST ---
apiClient.interceptors.request.use(
  (config) => {
    console.log(`[Interceptor] Running for request to: ${config.url}`);

    // Cek apakah request BUKAN untuk login atau register
    const isAuthRoute = config.url.endsWith('/login') || config.url.endsWith('/register');

    // Hanya tambahkan token jika BUKAN rute otentikasi
    if (!isAuthRoute) {
      const token = localStorage.getItem('token');
      if (token) {
        console.log('[Interceptor] Token DITEMUKAN. Menambahkan ke header.');
        config.headers['Authorization'] = `Bearer ${token}`;
      } else {
        console.warn('[Interceptor] PERINGATAN: Token TIDAK ditemukan untuk rute yang dilindungi.');
      }
    } else {
      console.log('[Interceptor] Rute otentikasi, token tidak ditambahkan.');
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- INTERCEPTOR UNTUK RESPONSE ---
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 400 || error.response.status === 401 || error.response.status === 403)) {
      const isAuthRoute = error.config.url.endsWith('/login') || error.config.url.endsWith('/register');
      // Hanya jalankan logout paksa jika error BUKAN dari halaman login/register itu sendiri
      if (!isAuthRoute) {
        localStorage.removeItem('token');
        localStorage.removeItem('role');

        if (window.location.pathname !== '/login') {
            Swal.fire({
              title: 'Sesi Tidak Valid',
              text: 'Token Anda tidak valid atau sesi telah berakhir. Silakan login kembali.',
              icon: 'error',
              confirmButtonText: 'Login',
            }).then(() => {
              window.location.href = '/login'; 
            });
        }
      }
    }
    return Promise.reject(error);
  }
);

// --- AUTHENTICATION ---
export const login = async (credentials) => {
  const response = await apiClient.post("/login", credentials);
  return response.data;
};

export const register = async (userData) => {
  const response = await apiClient.post("/register", userData);
  return response.data;
};

// --- RUTES ---
export const getAllRutes = async () => {
  const response = await apiClient.get("/rutes");
  return response.data;
};

export const getRuteById = async (id) => {
  const response = await apiClient.get(`/rutes/${id}`);
  return response.data;
};

export const createRute = async (ruteData) => {
  const response = await apiClient.post("/rutes", ruteData);
  return response.data;
};

export const updateRute = async (id, ruteData) => {
  const response = await apiClient.put(`/rutes/${id}`, ruteData);
  return response.data;
};

export const deleteRute = async (id) => {
  const response = await apiClient.delete(`/rutes/${id}`);
  return response.data;
};

// --- KENDARAAN ---
export const getAllKendaraan = async () => {
  const response = await apiClient.get("/kendaraans");
  return response.data;
};

export const getKendaraanById = async (id) => {
  const response = await apiClient.get(`/kendaraans/${id}`);
  return response.data;
};

export const createKendaraan = async (kendaraanData) => {
  const response = await apiClient.post("/kendaraans", kendaraanData);
  return response.data;
};

export const updateKendaraan = async (id, kendaraanData) => {
  const response = await apiClient.put(`/kendaraans/${id}`, kendaraanData);
  return response.data;
};

export const deleteKendaraan = async (id) => {
  const response = await apiClient.delete(`/kendaraans/${id}`);
  return response.data;
};

// --- JADWAL ---
export const getAllJadwal = async () => {
  const response = await apiClient.get("/jadwals");
  return response.data;
};

export const getJadwalById = async (id) => {
  const response = await apiClient.get(`/jadwals/${id}`);
  return response.data;
};

export const createJadwal = async (jadwalData) => {
  const response = await apiClient.post("/jadwals", jadwalData);
  return response.data;
};

export const updateJadwal = async (id, jadwalData) => {
  const response = await apiClient.put(`/jadwals/${id}`, jadwalData);
  return response.data;
};

export const deleteJadwal = async (id) => {
  const response = await apiClient.delete(`/jadwals/${id}`);
  return response.data;
};

export default apiClient;
