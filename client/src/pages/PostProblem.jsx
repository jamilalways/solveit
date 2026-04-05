import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const PostProblem = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Web Development');
  const [budget, setBudget] = useState('');
  const [deadline, setDeadline] = useState('');
  const [uploading, setUploading] = useState(false);
  const [attachments, setAttachments] = useState([]);

  if (!user || user.role !== 'Client') {
    return (
      <div className="text-center py-20 text-gray-500">
        Access Denied. Only Clients can post problems.
      </div>
    );
  }

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    setUploading(true);

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };

      const { data } = await axios.post('/api/upload', formData, config);
      setAttachments([...attachments, data.fileUrl]);
      setUploading(false);
    } catch (error) {
      console.error(error);
      setUploading(false);
      alert('File upload failed!');
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem('userInfo')).token}`,
        },
      };

      await axios.post(
        '/api/problems',
        {
          title,
          description,
          category,
          budget: { exact: Number(budget) },
          deadline,
          attachments,
        },
        config
      );

      alert('Problem posted successfully!');
      navigate('/dashboard');
    } catch (error) {
      alert(error.response?.data?.message || 'Error posting problem');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">
          Post a Problem
        </h1>
        <form onSubmit={submitHandler} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              required
              className="w-full border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              placeholder="e.g., Integrate Stripe into React Web App"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              required
              rows="5"
              className="w-full border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              placeholder="Provide a detailed description of your problem..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                className="w-full border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option>Web Development</option>
                <option>Data Science</option>
                <option>Graphic Design</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Budget (USD)
              </label>
              <input
                type="number"
                required
                className="w-full border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                placeholder="250"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Deadline
            </label>
            <input
              type="date"
              required
              className="w-full border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
          </div>

          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Attach Support Files (Optional)
            </label>
            <input
              type="file"
              onChange={uploadFileHandler}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 transition"
            />
            {uploading && <div className="text-sm mt-2 text-primary-600">Uploading...</div>}
            
            {attachments.length > 0 && (
               <div className="mt-4">
                 <p className="text-xs font-semibold uppercase text-gray-500 mb-2">Attached:</p>
                 <ul className="text-sm border rounded bg-white divide-y">
                   {attachments.map((file, idx) => (
                      <li key={idx} className="p-2 break-all text-primary-600">{file}</li>
                   ))}
                 </ul>
               </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-primary-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-700 transition shadow-md"
          >
            Post Problem to Marketplace
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostProblem;
