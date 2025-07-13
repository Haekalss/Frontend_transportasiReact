import { Navigate } from 'react-router-dom';

// Fungsi helper untuk mengambil data otentikasi
const useAuth = () => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  return { token, role };
};

// Komponen ini akan melindungi halaman untuk semua pengguna yang sudah login.
export const ProtectedRoute = ({ children }) => {
  const { token } = useAuth();

  if (!token) {
    // Jika tidak ada token, arahkan ke halaman login.
    return <Navigate to="/login" replace />;
  }

  // Jika ada token, tampilkan halaman yang diminta.
  return children;
};

// Komponen ini akan melindungi halaman hanya untuk Aadmin.
export const AdminRoute = ({ children }) => {
  const { token, role } = useAuth();
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  if (role !== 'admin') {
    // Jika ada token role-nya Bukan admin,
    // arahkan ke dashboard pengguna biasa untuk mencegah akses.
    return <Navigate to="/" replace />;
  }

  // Jika ada token = adalah admin, izinkan akses.
  return children;
};
