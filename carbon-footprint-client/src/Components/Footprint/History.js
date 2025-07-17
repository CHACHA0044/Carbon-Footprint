import API from 'api/api';
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageWrapper from 'common/PageWrapper';
const History = () => {
  const [history, setHistory] = useState([]);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const location = useLocation();
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchHistory();
  }, [location.state?.updated]);

  const fetchHistory = async () => {
    try {
      const response = await API.get('/footprint/history', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = response.data;
      setHistory(data);
    } catch (err) {
      setError('An error occurred while fetching history');
    }
  };

  const handleDelete = async (id) => {
  try {
    await API.delete(`/footprint/${id}`);
    setSuccess('Entry deleted successfully ✅');
    setError('');
    fetchHistory(); // Refresh list
  } catch (err) {
    console.error(err);
    setError('Failed to delete entry ❌');
    setSuccess('');
  }
};


  const handleClearAll = async () => {
  try {
    await API.delete('/footprint');
    setSuccess('All history cleared 🧹');
    setError('');
    fetchHistory();
  } catch (err) {
    console.error(err);
    setError('Failed to clear history ❌');
    setSuccess('');
  }
};


  const getFormattedDate = (entry) => {
    if (entry.createdAt && !isNaN(Date.parse(entry.createdAt))) {
      return new Date(entry.createdAt).toLocaleString();
    } else if (entry._id) {
      const timestamp = parseInt(entry._id.substring(0, 8), 16) * 1000;
      return new Date(timestamp).toLocaleString();
    }
    return 'Unknown';
  };

  return (
    <motion.div
                initial={{ x:100, opacity: 0}}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -100, opacity: 0 }}
                transition={{ duration: 0.2, ease: 'easeInOut' }}
                className="w-full h-full"
              >
    <PageWrapper backgroundImage="/images/history-bk.webp">
      <div className="w-full flex-1 flex-col px-6 py-6 overflow-y-auto text-emerald-500 dark:text-white">
        <h2 className="text-3xl font-bold mb-6 text-center">Emission History</h2>
        {success && (
  <p className="text-green-500 text-sm text-center animate-pulse mb-2">{success}</p>
)}
{error && (
  <p className="text-red-600 text-sm text-center animate-bounce mb-2">{error}</p>
)}

       

        {history.length === 0 ? (
          <p className="text-center">No entries found.</p>
        ) : (
          history.map((entry) => (
            <div
              key={entry._id}
              className="bg-white/20 dark:bg-gray-800/40 backdrop-blur-md shadow-md rounded-lg p-4 mb-4"
            >
              <p className="font-semibold">📅 Date: {getFormattedDate(entry)}</p>
              <p>🌍 Total Emissions: {entry.totalEmissionKg || entry.totalEmissions} kg CO₂</p>
              <p className="italic">💡 Suggestions: {entry.suggestions}</p>
              <div className="mt-3 flex gap-3">
                <button
                  className="bg-blue-500 hover:bg-blue-800 text-emerald-500 dark:text-white px-4 py-1 rounded active:scale-75"
                  onClick={() => navigate(`/edit/${entry._id}`)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 hover:bg-red-800 text-emerald-500 dark:text-white px-4 py-1 rounded active:scale-75"
                  onClick={() => handleDelete(entry._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}

        {history.length > 0 && (
          <button
            onClick={handleClearAll}
            className="mt-6 bg-red-500 hover:bg-red-800 text-emerald-500 dark:text-white px-6 py-2 rounded block mx-auto active:scale-75"
          >
            🗑️ Clear All History
          </button>
        )}
      </div>
   </PageWrapper>
    </motion.div>
  );
};

export default History;
