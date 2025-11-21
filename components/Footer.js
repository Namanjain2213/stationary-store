export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white mt-12" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">SheopurStationaryHub</h3>
            <p className="text-gray-400">Your trusted source for quality office supplies and stationery in Sheopur. Premium products, best prices, fast delivery.</p>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/" className="hover:text-white">Home</a></li>
              <li><a href="/products" className="hover:text-white">Products</a></li>
              <li><a href="/login" className="hover:text-white">Login</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Contact</h3>
            <p className="text-gray-400">Email: [email]</p>
            <p className="text-gray-400">Phone: [phone_number]</p>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
          <p className="text-sm sm:text-base">&copy; 2025 SheopurStationaryHub. All rights reserved.</p>
          <a href="/admin/login" className="text-xs text-gray-600 hover:text-gray-400 mt-2 inline-block">
            Admin
          </a>
        </div>
      </div>
    </footer>
  );
}
