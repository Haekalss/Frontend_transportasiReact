import { Link } from 'react-router-dom';
import { BusFront, MapPin, Calendar, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  const features = [
    {
      icon: <BusFront size={40} className="text-blue-500" />,
      title: "Manajemen Kendaraan",
      description: "Kelola armada transportasi dengan mudah dan efisien"
    },
    {
      icon: <MapPin size={40} className="text-green-500" />,
      title: "Informasi Rute",
      description: "Akses informasi rute transportasi yang terperinci"
    },
    {
      icon: <Calendar size={40} className="text-purple-500" />,
      title: "Jadwal Terintegrasi",
      description: "Pantau jadwal perjalanan secara real-time"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header/Navigation */}
      <header className="bg-white shadow-sm">
        <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <BusFront size={32} className="text-blue-600" />
            <span className="text-xl font-bold text-gray-800">TransGo</span>
          </div>
          <div className="flex gap-4">
            <Link
              to="/login"
              className="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Register
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Sistem Manajemen Transportasi Kota
            </h1>
            <p className="text-xl mb-8 text-blue-100">
              Platform modern untuk mengelola dan memantau layanan transportasi kota secara efisien
            </p>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition"
            >
              Mulai Sekarang
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Fitur Utama
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-100 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            Siap Untuk Memulai?
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Bergabunglah dengan kami dan tingkatkan efisiensi manajemen transportasi kota Anda
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              to="/login"
              className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-50 transition border border-blue-600"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Register
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <BusFront size={32} className="text-blue-400" />
              <span className="text-xl font-bold text-white">TransGo</span>
            </div>
            <div className="text-sm">
              © {new Date().getFullYear()} TransGo. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
