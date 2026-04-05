import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
            Find the perfect solver for your <span className="text-primary-600">complex problems</span>
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-gray-500 mb-8">
            The premium marketplace where ambition meets expertise. Post your technical challenges and let verified experts bid to solve them securely.
          </p>
          <div className="flex justify-center space-x-4">
            <Link to="/login?tab=register&role=Client" className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-primary-700 transition shadow-lg shadow-primary-500/30">
              Post a Problem
            </Link>
            <Link to="/explore" className="bg-white text-gray-900 border border-gray-200 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-gray-50 transition shadow-sm">
              Earn Money Solving
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-xl flex items-center justify-center mb-4 text-2xl">🤝</div>
              <h3 className="text-xl font-bold mb-2">Secure Escrow</h3>
              <p className="text-gray-600">Your money is safe. Payment is only released when you are 100% satisfied with the delivered solution.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-4 text-2xl">⚡</div>
              <h3 className="text-xl font-bold mb-2">Fast Bidding</h3>
              <p className="text-gray-600">Get proposals from top-rated developers within minutes. Compare prices, delivery times, and reviews.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-4 text-2xl">💬</div>
              <h3 className="text-xl font-bold mb-2">Real-time Chat</h3>
              <p className="text-gray-600">Collaborate effortlessly with built-in instant messaging and seamless file sharing capabilities.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
