import React, { useContext, useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FiLogOut, FiGrid, FiChevronDown } from 'react-icons/fi';

// Role badge colors
const roleBadge = {
  Client: 'bg-blue-100 text-blue-700',
  Solver: 'bg-green-100 text-green-700',
  Admin:  'bg-purple-100 text-purple-700',
};

// Generate avatar initials from name
const getInitials = (name = '') =>
  name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();

// Avatar background colors based on first letter
const avatarColors = [
  'bg-blue-500', 'bg-green-500', 'bg-purple-500',
  'bg-pink-500', 'bg-yellow-500', 'bg-red-500', 'bg-indigo-500',
];
const getAvatarColor = (name = '') =>
  avatarColors[name.charCodeAt(0) % avatarColors.length];

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">

          {/* Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center">
            <span className="text-2xl font-bold text-blue-600">Solve<span className="text-gray-800">It.</span></span>
          </Link>

          {/* Nav Links */}
          <div className="flex items-center space-x-4">
            <Link to="/explore" className="text-gray-600 hover:text-blue-600 font-medium transition">
              Explore Jobs
            </Link>

            {user ? (
              /* ── Logged-in: Avatar + Name + Role + Dropdown ── */
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-full pl-1 pr-3 py-1 transition"
                >
                  {/* Avatar circle with initials */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 ${getAvatarColor(user.name)}`}>
                    {user.avatar
                      ? <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
                      : getInitials(user.name)
                    }
                  </div>

                  {/* Name + Role badge */}
                  <div className="flex flex-col items-start leading-tight">
                    <span className="text-sm font-semibold text-gray-800">{user.name}</span>
                    <span className={`text-xs font-medium px-1.5 py-0.5 rounded-full ${roleBadge[user.role] || 'bg-gray-100 text-gray-600'}`}>
                      {user.role}
                    </span>
                  </div>

                  <FiChevronDown className={`text-gray-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                    <Link
                      to="/dashboard"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                    >
                      <FiGrid className="text-blue-500" /> Dashboard
                    </Link>
                    <hr className="my-1 border-gray-100" />
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
                    >
                      <FiLogOut /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* ── Logged-out: Login + Sign up ── */
              <div className="flex items-center space-x-3">
                <Link to="/login" className="text-gray-600 hover:text-blue-600 font-medium transition">
                  Log in
                </Link>
                <Link
                  to="/login?tab=register"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition shadow-sm"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

