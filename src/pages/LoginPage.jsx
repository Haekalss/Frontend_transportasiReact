import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://localhost:8088/api/login', {
        username,
        password,
      });

      // Simpan token dan role ke localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('role', response.data.role);

      // Arahkan berdasarkan role
      if (response.data.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
      window.location.reload(); // Reload untuk update state di seluruh aplikasi
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-center text-gray-800">Login ke TransGo</h2>
        
        {error && <p className="text-red-500 text-center">{error}</p>}

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
          <a href="/register" className="font-semibold text-blue-600 hover:underline">
            Register di sini
          </a>
        </p>
      </div>
    </div>
  );
}