import API from 'api/api';
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PageWrapper from 'common/PageWrapper';
import { AnimatePresence, motion } from 'framer-motion';

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
  if (!token) {
    navigate('/login');
    return;
  }

  try {
    const response = await API.get('/footprint/history', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setHistory(response.data);
  } catch (err) {
    console.error(err);
    setError('An error occurred while fetching history');
  }
};


  const handleDelete = async (id) => {
  setLoadingId(id);
    const deletedEntry = history.find((e) => e._id === id);
    const emission = deletedEntry?.totalEmissionKg || deletedEntry?.totalEmissions || "N/A";
  try {
    await API.delete(`/footprint/${id}`);
    setSuccess(`Entry (${emission} kg CO₂) deleted successfully 🌱 `);
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
    await API.delete('/footprint/clear/all', {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

    setCleared(true); 
    await fetchHistory(); 
    setSuccess('All entries successfully deleted 🧹');
    setTimeout(() => {
      setCleared(false); 
    }, 1500);
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
    initial={{ x: 100, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.2, ease: 'easeInOut' }}
    className="w-full  h-full"
  >
    <PageWrapper backgroundImage="/images/history-bk.webp">
      <div className="w-full max-w-7xl flex flex-col px-6 py-6 overflow-y-auto overflow-x-hidden overflow-visible text-emerald-500 dark:text-white transition-colors duration-500">
        <h2 className="text-3xl font-bold mb-6 text-center">Emission History</h2>

        <AnimatePresence>
          {success && (
            <motion.p
              key="success"
              className="text-green-500 text-sm text-center mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {success}
            </motion.p>
          )}
          {error && (
            <motion.p
              key="error"
              className="text-red-600 text-sm text-center mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {history.length === 0 ? (
            <motion.p
  key="no-entries"
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
  className="text-center"
>
              No entries found.
            </motion.p>
          ) : (
             <motion.div
      variants={{
        visible: { transition: { staggerChildren: 0.1 } },
        hidden: {},
      }}
      initial="hidden"
      animate="visible"
    >
           { history.map((entry) => (
              <motion.div
                key={entry._id}
                layout
                 initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  whileHover={{ scale: 1.05, boxShadow: "0px 8px 20px rgba(0,0,0,0.2)" }}
                  whileTap={{ scale: 0.85, transition: { duration: 0.05 } }}
                className="bg-white/20 dark:bg-gray-800/40 backdrop-blur-md shadow-md rounded-lg p-4 mb-4 origin-center transition-colors duration-300"
              >
                <p className="font-semibold ">📅 Date: {getFormattedDate(entry)}</p>
                <p>🌍 Total Emissions: {entry.totalEmissionKg || entry.totalEmissions} kg CO₂</p>
                <p className="italic">💡 Suggestions: {entry.suggestions}</p>
                <div className="mt-3 flex gap-3">
                  <button
                    className="bg-blue-500 hover:bg-blue-800 text-emerald-500 dark:text-white px-4 py-1 rounded active:scale-75 transition duration-300"
                    onClick={() => navigate(`/edit/${entry._id}`)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-800 text-emerald-500 dark:text-white px-4 py-1 rounded flex items-center gap-2 active:scale-75 transition duration-300"
                    onClick={() => handleDelete(entry._id)}
                    disabled={loadingId === entry._id}
                  >
                    {loadingId === entry._id ? (
                      <>
                        <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                          <circle
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            className="opacity-25"
                          />
                          <path
                            fill="currentColor"
                            className="opacity-75"
                            d="M4 12a8 8 0 018-8v8H4z"
                          />
                        </svg>
                        Deleting...
                      </>
                    ) : deletedId === entry._id ? (
                      <span>✅ Deleted</span>
                    ) : (
                      <span>🗑️ Delete</span>
                    )}
                  </button>
                </div>
              </motion.div>
            ))}
            </motion.div>
          )}
        </AnimatePresence>

        {history.length > 0 && (
          <button
            onClick={handleClearAll}
            disabled={clearingAll}
            className="mt-6 bg-red-500 hover:bg-red-800 text-emerald-500 dark:text-white px-6 py-2 rounded mx-auto flex items-center justify-center gap-2 active:scale-75 transition duration-300"
          >
            {clearingAll ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    className="opacity-25"
                  />
                  <path
                    fill="currentColor"
                    className="opacity-75"
                    d="M4 12a8 8 0 018-8v8H4z"
                  />
                </svg>
                Clearing...
              </>
            ) : cleared ? (
              <span>✅ Cleared</span>
            ) : (
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
