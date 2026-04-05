import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

// Same helpers as Navbar
const getInitials = (name = '') =>
  name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();

const avatarColors = [
  'bg-blue-500', 'bg-green-500', 'bg-purple-500',
  'bg-pink-500', 'bg-yellow-500', 'bg-red-500', 'bg-indigo-500',
];
const getAvatarColor = (name = '') =>
  avatarColors[name.charCodeAt(0) % avatarColors.length];

const roleBadge = {
  Client: 'bg-blue-100 text-blue-700 border border-blue-200',
  Solver: 'bg-green-100 text-green-700 border border-green-200',
  Admin:  'bg-purple-100 text-purple-700 border border-purple-200',
};

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return (
      <div className="text-center py-20 text-gray-500">
        Please <Link to="/login" className="text-blue-600 underline">log in</Link> to view your dashboard.
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* ── Profile Card at Top ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8 flex flex-col sm:flex-row items-center sm:items-start gap-5">
        {/* Avatar */}
        <div className={`w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-bold flex-shrink-0 ${getAvatarColor(user.name)}`}>
          {user.avatar
            ? <img src={user.avatar} alt={user.name} className="w-20 h-20 rounded-full object-cover" />
            : getInitials(user.name)
          }
        </div>

        {/* Info */}
        <div className="flex-1 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
            {/* Role badge */}
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${roleBadge[user.role] || 'bg-gray-100 text-gray-600'}`}>
              {user.role === 'Client' ? '🧑‍💼' : user.role === 'Solver' ? '🛠️' : '⚙️'} {user.role}
            </span>
          </div>
          <p className="text-gray-500 text-sm mt-1">{user.email}</p>
          <p className="text-gray-400 text-xs mt-1">Member since {new Date(user.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
        </div>

        {/* Action button */}
        {user.role === 'Client' && (
          <Link
            to="/post-problem"
            className="bg-blue-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-700 transition flex-shrink-0"
          >
            + Post Problem
          </Link>
        )}
      </div>

      {/* ── Stats Row ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Wallet */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-xl shadow-lg text-white">
          <h3 className="text-gray-300 font-medium text-sm tracking-wide uppercase mb-1">Wallet Balance</h3>
          <p className="text-4xl font-bold mb-4">$0.00</p>
          <div className="flex space-x-3">
            <button className="bg-white text-gray-900 px-4 py-1.5 rounded text-sm font-medium hover:bg-gray-100 transition">Deposit</button>
            <button className="border border-gray-600 px-4 py-1.5 rounded text-sm font-medium hover:bg-gray-800 transition">Withdraw</button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-center">
          <h3 className="text-gray-500 font-medium text-sm tracking-wide uppercase mb-2">Active Jobs</h3>
          <p className="text-4xl font-bold text-blue-600">0</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-center">
          <h3 className="text-gray-500 font-medium text-sm tracking-wide uppercase mb-2">Rating</h3>
          <p className="text-4xl font-bold text-yellow-500">New ⭐</p>
        </div>
      </div>

      {/* ── Recent Activity ── */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-bold">Recent Activity</h2>
        </div>
        <div className="p-6 text-center text-gray-500">
          No recent activity to show.
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

