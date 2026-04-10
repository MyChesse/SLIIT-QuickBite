import { Link } from "react-router";

const SDFooter = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-16">
      <div className="max-w-7xl mx-auto px-8 grid grid-cols-2 md:grid-cols-4 gap-10">
        {/* Brand Column */}
        <div>
          <span className="text-2xl font-black text-white tracking-tighter">
            QuickBite
          </span>
          <p className="mt-3 text-sm text-gray-400">
            Smart canteen ordering for SLIIT students. Skip the queue, save
            time.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <p className="font-medium mb-4 text-white">Quick Links</p>
          <div className="space-y-2 text-sm">
            <Link to="/menu" className="block hover:text-blue-400 transition">
              Home
            </Link>
            <Link to="/orders" className="block hover:text-blue-400 transition">
              My Orders
            </Link>
            <Link to="/menu" className="block hover:text-blue-400 transition">
              Menu
            </Link>
            <Link
              to="/feedback"
              className="block hover:text-blue-400 transition"
            >
              Feedback
            </Link>
          </div>
        </div>

        {/* Canteens */}
        <div>
          <p className="font-medium mb-4 text-white">Canteens</p>
          <div className="space-y-2 text-sm">
            <p>Main Canteen - 0112573912</p>
            <p>Mini Canteen - 0112973913</p>
            <p>New Canteen - 0112513914</p>
          </div>
        </div>

        {/* Contact & Social */}
        <div>
          <p className="font-medium mb-4 text-white">Contact</p>
          <p className="text-sm">+94 11 234 5678</p>
          <p className="text-sm mt-1">quickbite@sliit.lk</p>

          {/* Social Media Icons */}
          <div className="flex gap-6 mt-6">
            {/* Facebook */}
            <a
              href="#"
              className="text-blue-400 hover:text-blue-600 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </a>

            {/* Instagram */}
            <a
              href="#"
              className="text-pink-400 hover:text-pink-600 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.645.069-4.849.069-3.204 0-3.584-.012-4.849-.069-3.255-.148-4.771-1.691-4.919-4.919-.058-1.265-.069-1.645-.069-4.849 0-3.204.012-3.584.069-4.849.149-3.225 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 4.775.2 2.8 2.175 2.672 4.453.014 5.733 0 6.14 0 12s.014 6.268.072 7.447c.128 2.278 2.103 4.253 4.381 4.381 1.28.058 1.688.072 4.947.072s3.667-.014 4.947-.072c2.278-.128 4.253-2.103 4.381-4.381.058-1.28.072-1.688.072-7.447s-.014-6.268-.072-7.447c-.128-2.278-2.103-4.253-4.381-4.381C15.667.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a3.999 3.999 0 1 1 0-7.998 3.999 3.999 0 0 1 0 7.998zm6.406-11.845a1.44 1.44 0 1 1-2.88 0 1.44 1.44 0 0 1 2.88 0z" />
              </svg>
            </a>

            {/* X / Twitter */}
            <a
              href="#"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.796-7.57-6.638 7.57H.474l8.6-9.82L0 1.153h7.74l5.345 7.07L18.901 1.153z" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center text-xs text-gray-500 mt-16 border-t border-gray-800 pt-8">
        © 2026 SLIIT QuickBite • IT3040 ITPM Semester Project
      </div>
    </footer>
  );
};

export default SDFooter;
