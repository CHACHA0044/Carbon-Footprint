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
  const [loadingId, setLoadingId] = useState(null); 
  const [clearingAll, setClearingAll] = useState(false); // for clear all
  const [deletedId, setDeletedId] = useState(null);
  const [cleared, setCleared] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, [location.state?.updated]);

useEffect(() => {
  if (error || success) {
    const timer = setTimeout(() => {
      setError('');
      setSuccess('');
    }, 1500);
    return () => clearTimeout(timer);
  }
}, [error, success]);


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
  setLoadingId(id);
  try {
    await API.delete(`/footprint/${id}`);
    setSuccess(`🌱 (${id.slice(-4)})`);
    setDeletedId(id); // NEW: Track deleted item
    await fetchHistory();
    setTimeout(() => {
      setDeletedId(null); // Reset after delay
    }, 500);
  } catch (err) {
    console.error(err);
    setError('Failed to delete entry ❌');
  } finally {
    setLoadingId(null);
  }
};


  const handleClearAll = async () => {
  setClearingAll(true);
  try {
    await API.delete('/footprint');
    setSuccess('All history cleared 🧹');
    setCleared(true); // NEW
    await fetchHistory();
    setTimeout(() => setCleared(false), 1500); // Reset after delay
  } catch (err) {
    console.error(err);
    setError('Failed to clear history ❌');
  } finally {
    setClearingAll(false);
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
  className="bg-red-500 hover:bg-red-800 text-emerald-500 dark:text-white px-4 py-1 rounded flex items-center gap-2 active:scale-75"
  onClick={() => handleDelete(entry._id)}
  disabled={loadingId === entry._id}
>
  {loadingId === entry._id ? (
    <>
      <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
        <path fill="currentColor" className="opacity-75" d="M4 12a8 8 0 018-8v8H4z" />
      </svg>
      Deleting...
    </>
  ) : deletedId === entry._id
  ? (
    <span>'✅ Deleted'</span>
  ) : ( <span>🗑️ Delete</span>)}
</button>

              </div>
            </div>
          ))
        )}

        {history.length > 0 && (
          <button
  onClick={handleClearAll}
  disabled={clearingAll}
  className="mt-6 bg-red-500 hover:bg-red-800 text-emerald-500 dark:text-white px-6 py-2 rounded block mx-auto flex items-center justify-center gap-2 active:scale-75"
>
  {clearingAll ? (
    <>
      <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
        <path fill="currentColor" className="opacity-75" d="M4 12a8 8 0 018-8v8H4z" />
      </svg>
      Clearing...
    </>
  ) : cleared
  ? (
    <span>✅ Cleared</span>
  ) :
   (
    <span>🗑️ Clear All History</span>
  )}
</button>

        )}
      </div>
   </PageWrapper>
    </motion.div>
  );
};

export default History;
