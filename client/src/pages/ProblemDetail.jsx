import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const ProblemDetail = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [problem, setProblem] = useState(null);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bidForm, setBidForm] = useState({ price: '', time: '', message: '' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const problemRes = await axios.get(`/api/problems/${id}`);
        setProblem(problemRes.data);
        
        // Fetch bids only if user is logged in
        if (user) {
          try {
            const config = { headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('userInfo')).token}` } };
            const bidsRes = await axios.get(`/api/bids/problem/${id}`, config);
            setBids(bidsRes.data);
          } catch(err) {
             console.log("Could not fetch bids", err);
          }
        }
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    fetchData();
  }, [id, user]);

  const submitBid = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('userInfo')).token}` } };
      await axios.post('/api/bids', {
        problemId: id,
        proposedPrice: bidForm.price,
        deliveryTime: bidForm.time,
        message: bidForm.message
      }, config);
      alert('Bid submitted successfully!');
      // reload page or state
      window.location.reload();
    } catch (error) {
      alert(error.response?.data?.message || 'Error submitting bid');
    }
  };

  if (loading) return <div className="text-center py-20">Loading details...</div>;
  if (!problem) return <div className="text-center py-20">Problem not found.</div>;

  const isClientOwner = user && user._id === problem.clientId._id;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Main Content */}
        <div className="w-full md:w-2/3">
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{problem.title}</h1>
            <div className="flex space-x-4 mb-8 text-sm">
              <span className="bg-primary-50 text-primary-700 px-3 py-1 rounded-full font-medium">{problem.category}</span>
              <span className="text-gray-500 self-center">Posted {new Date(problem.createdAt).toLocaleDateString()}</span>
            </div>
            
            <h3 className="text-xl font-bold mb-4">Description</h3>
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed mb-8">{problem.description}</p>
            
            <h3 className="text-xl font-bold mb-4">Client Info</h3>
            <div className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-bold text-xl">
                {problem.clientId.name.charAt(0)}
              </div>
              <div>
                <p className="font-semibold">{problem.clientId.name}</p>
                <p className="text-sm text-gray-500">Rating: {problem.clientId.rating || 'New Member'}</p>
              </div>
            </div>
          </div>

          {/* Bids Section for Client */}
          {isClientOwner && (
            <div className="mt-8 bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold mb-6">Proposals ({bids.length})</h3>
              {bids.length === 0 ? (
                <p className="text-gray-500">No bids yet.</p>
              ) : (
                bids.map(bid => (
                  <div key={bid._id} className="border-b last:border-0 pb-6 mb-6">
                    <div className="flex justify-between mb-2">
                       <p className="font-bold">{bid.solverId.name} <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">{bid.solverId.level}</span></p>
                       <p className="font-bold text-primary-600">${bid.proposedPrice}</p>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{bid.message}</p>
                    <p className="text-xs text-gray-500 mb-4">Delivery: {bid.deliveryTime} days</p>
                    {problem.status === 'Open' && (
                       <button className="bg-primary-600 text-white px-4 py-2 rounded text-sm hover:bg-primary-700 transition">Accept Bid & Escrow</button>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="w-full md:w-1/3 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-gray-500 uppercase tracking-wide text-xs font-bold mb-2">Budget</h3>
            <p className="text-3xl font-bold text-gray-900 mb-6">
               ${problem.budget?.exact || `${problem.budget?.min} - $${problem.budget?.max}`}
            </p>
            <h3 className="text-gray-500 uppercase tracking-wide text-xs font-bold mb-2">Deadline</h3>
            <p className="font-medium text-gray-900 mb-6">{new Date(problem.deadline).toLocaleDateString()}</p>
            
            {user && user.role === 'Solver' && problem.status === 'Open' ? (
              <form onSubmit={submitBid} className="border-t border-gray-100 pt-6 mt-2">
                <h3 className="font-bold mb-4 text-center">Submit a Proposal</h3>
                <div className="space-y-4">
                  <input type="number" required placeholder="Price ($)" className="w-full border-gray-300 rounded focus:ring-primary-500" onChange={e => setBidForm({...bidForm, price: e.target.value})} />
                  <input type="number" required placeholder="Delivery time (Days)" className="w-full border-gray-300 rounded focus:ring-primary-500" onChange={e => setBidForm({...bidForm, time: e.target.value})} />
                  <textarea required placeholder="Why should they hire you?" className="w-full border-gray-300 rounded focus:ring-primary-500" rows="3" onChange={e => setBidForm({...bidForm, message: e.target.value})}></textarea>
                  <button type="submit" className="w-full bg-primary-600 text-white py-3 rounded-lg font-bold hover:bg-primary-700 transition shadow-sm">Place Bid</button>
                </div>
              </form>
            ) : user && user.role === 'Solver' ? (
                <div className="text-center bg-gray-50 p-4 rounded text-gray-600">Problem is no longer open for bidding.</div>
            ) : !user ? (
                <div className="text-center bg-gray-50 p-4 rounded text-gray-600">Please login as a Solver to bid.</div>
            ) : null}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProblemDetail;
