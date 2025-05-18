// layouts/UserLayout.jsx
import { Link, Outlet, useLocation } from "react-router-dom";
import { Home, Map, BusFront, Calendar } from "lucide-react";

const menu = [
  { name: "Dashboard", path: "/", icon: <Home size={18} /> },
  { name: "Rute", path: "/rutes", icon: <Map size={18} /> },
  { name: "Kendaraan", path: "/kendaraan", icon: <BusFront size={18} /> },
  { name: "Jadwal", path: "/jadwal", icon: <Calendar size={18} /> },
];

export default function UserLayout() {
  const location = useLocation();
  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-64 bg-white shadow-xl p-4">
        <h2 className="text-2xl font-bold text-blue-600 mb-6">🚍 TransGo</h2>
        <nav className="space-y-2">
          {menu.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-blue-50 transition ${
                location.pathname === item.path ? "bg-blue-100 text-blue-700 font-semibold" : "text-gray-700"
              }`}
            >
              {item.icon} {item.name}
            </Link>
          ))}
        </nav>
      </aside>

      <main className="flex-1 p-6">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Dashboard Pengguna</h1>
        </header>
        <Outlet />
      </main>
    </div>
  );
}
