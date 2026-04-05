import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Explore = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const { data } = await axios.get('/api/problems');
        setProblems(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching problems:', error);
        setLoading(false);
      }
    };
    fetchProblems();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Explore Problems</h1>
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Filters */}
        <div className="w-full md:w-1/4">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24">
            <h3 className="font-semibold text-lg mb-4">Filters</h3>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select className="w-full border-gray-300 rounded-lg shadow-sm focus:border-primary-500 focus:ring-primary-500">
                <option>All Categories</option>
                <option>Web Development</option>
                <option>Data Science</option>
                <option>Graphic Design</option>
              </select>
            </div>
          </div>
        </div>

        {/* Problem Feed */}
        <div className="w-full md:w-3/4">
          {loading ? (
            <div className="text-center py-10">Loading opportunities...</div>
          ) : problems.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-xl border border-gray-100 text-gray-500">
              No open problems found right now.
            </div>
          ) : (
            <div className="space-y-4">
              {problems.map((problem) => (
                <div key={problem._id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-bold text-primary-600 mb-2">{problem.title}</h2>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{problem.description}</p>
                      <div className="flex space-x-4 text-xs text-gray-500">
                        <span className="bg-gray-100 px-2 py-1 rounded">Category: {problem.category}</span>
                        <span className="bg-gray-100 px-2 py-1 rounded">Status: {problem.status}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900">
                        ${problem.budget?.exact || `${problem.budget?.min} - $${problem.budget?.max}`}
                      </div>
                      <div className="text-sm text-gray-500 mb-4">Budget</div>
                      <Link to={`/problem/${problem._id}`} className="bg-primary-50 text-primary-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-100 transition">
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Explore;
