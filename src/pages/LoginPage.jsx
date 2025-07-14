import { useState } from 'react';
import { login } from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Panggil fungsi login dari api.js
      const responseData = await login({
        username,
        password,
      });

      // Simpan token dan role ke localStorage
      localStorage.setItem('token', responseData.token);
      localStorage.setItem('role', responseData.role);

      // Tampilkan notifikasi sukses sebelum navigasi
      await Swal.fire({
        icon: 'success',
        title: 'Login Berhasil!',
        text: `Selamat datang kembali, ${username}!`,
        timer: 1500,
        showConfirmButton: false,
        timerProgressBar: true,
      });

      // Arahkan berdasarkan role
      if (responseData.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      // Tampilkan notifikasi error
      Swal.fire({
        icon: 'error',
        title: 'Login Gagal',
        text: err.response?.data?.error || 'Silakan periksa kembali username dan password Anda.',
        confirmButtonText: 'Coba Lagi'
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-center text-gray-800">Login ke TransGo</h2>
        
        {/* Pesan error kini ditangani oleh SweetAlert, jadi baris ini bisa dihapus */}
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="username" className="text-sm font-semibold text-gray-600">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="password" className="text-sm font-semibold text-gray-600">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <button type="submit" className="w-full px-4 py-2 font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
              Login
            </button>
          </div>
        </form>
        <p className="text-sm text-center text-gray-600">
          Belum punya akun?{' '}
          <Link to="/register" className="font-semibold text-blue-600 hover:underline">
            Register di sini
          </Link>
        </p>
      </div>
    </div>
  );
}