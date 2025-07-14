import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Home, Map, BusFront, Calendar, LogOut, Menu, X } from "lucide-react";
import Swal from 'sweetalert2';
import { useState } from 'react';

const menu = [
  { name: "Dashboard", path: "/", icon: <Home size={18} /> },
  { name: "Rute", path: "/rutes", icon: <Map size={18} /> },
  { name: "Kendaraan", path: "/kendaraan", icon: <BusFront size={18} /> },
  { name: "Jadwal", path: "/jadwal", icon: <Calendar size={18} /> },
];

export default function UserLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    Swal.fire({
      title: 'Anda yakin ingin keluar?',
      text: "Anda akan diarahkan ke halaman login.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, keluar!',
      cancelButtonText: 'Batal'
    }).then((result) => {
      if (result.isConfirmed) {
        // Hapus token dan role dari localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        // Arahkan ke halaman login
        navigate('/login');
      }
    });
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white shadow-sm">
        <h2 className="text-xl font-bold text-blue-600">🚍 TransGo</h2>
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-gray-100"
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`
            fixed top-0 left-0 h-full w-64 bg-white shadow-xl p-4 flex flex-col z-30
            transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          `}
        >
          {/* Desktop Logo - hidden on mobile */}
          <div className="hidden md:block">
            <h2 className="text-2xl font-bold text-blue-600 mb-6">🚍 TransGo</h2>
          </div>
          
          <nav className="space-y-2 mt-4 md:mt-0">
            {menu.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-blue-50 transition ${
                  location.pathname === item.path ? "bg-blue-100 text-blue-700 font-semibold" : "text-gray-700"
                }`}
              >
                {item.icon} {item.name}
              </Link>
            ))}
          </nav>

          <div className="mt-auto">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-2 rounded-xl text-red-700 hover:bg-red-50 transition font-semibold"
            >
              <LogOut size={18} /> Logout
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 w-full md:ml-64">
          <header className="mb-6">
            <h1 className="text-xl md:text-2xl font-semibold text-gray-800">Dashboard Pengguna</h1>
          </header>
          <div className="w-full overflow-x-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}