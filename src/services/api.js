import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:8088/api',
});

// Interceptor untuk menambahkan token ke setiap request secara otomatis
apiClient.interceptors.request.use(
  (config) => {
    // Ambil token dari localStorage
    const token = localStorage.getItem('authToken'); 

    // Jika token ada, tambahkan ke header Authorization
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- AUTHENTICATION ---
export const login = async (credentials) => {
  const response = await apiClient.post('/login', credentials);
  return response.data;
};

export const register = async (userData) => {
  const response = await apiClient.post('/register', userData);
  return response.data;
};


// --- RUTES ---
export const getAllRutes = async () => {
  const response = await apiClient.get('/rutes');
  return response.data;
};

export const getRuteById = async (id) => {
  const response = await apiClient.get(`/rutes/${id}`);
  return response.data;
};

export const createRute = async (ruteData) => {
  const response = await apiClient.post('/rutes', ruteData);
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
    const response = await apiClient.get('/kendaraans');
    return response.data;
};

export const getKendaraanById = async (id) => {
    const response = await apiClient.get(`/kendaraans/${id}`);
    return response.data;
};

export const createKendaraan = async (kendaraanData) => {
    const response = await apiClient.post('/kendaraans', kendaraanData);
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
    const response = await apiClient.get('/jadwals');
    return response.data;
};

export const getJadwalById = async (id) => {
    const response = await apiClient.get(`/jadwals/${id}`);
    return response.data;
};

export const createJadwal = async (jadwalData) => {
    const response = await apiClient.post('/jadwals', jadwalData);
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
