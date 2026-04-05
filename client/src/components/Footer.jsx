import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <h2 className="text-2xl font-extrabold text-white mb-2">
              Solve<span className="text-blue-400">It</span>
            </h2>
            <p className="text-sm text-gray-400 max-w-sm">
              The premium marketplace where ambition meets expertise. Post your
              technical challenges and let verified experts bid to solve them
              securely.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Platform
            </h3>
            <ul className="space-y-2">
              <li><Link to="/explore" className="text-sm hover:text-white transition">Browse Problems</Link></li>
              <li><Link to="/post-problem" className="text-sm hover:text-white transition">Post a Problem</Link></li>
              <li><Link to="/dashboard" className="text-sm hover:text-white transition">Dashboard</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Account
            </h3>
            <ul className="space-y-2">
              <li><Link to="/login" className="text-sm hover:text-white transition">Sign In</Link></li>
              <li><Link to="/login?tab=register" className="text-sm hover:text-white transition">Register</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-gray-700 pt-6 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-xs text-gray-500">&copy; {year} SolveIt. All rights reserved.</p>
          <p className="text-xs text-gray-500 mt-2 sm:mt-0">Built with ❤️ using the MERN Stack</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
