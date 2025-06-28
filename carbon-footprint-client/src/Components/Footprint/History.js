import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageWrapper from 'common/PageWrapper';
import { useLocation } from 'react-router-dom';

const History = () => {
  const [history, setHistory] = useState([]);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
 const location = useLocation();
  useEffect(() => {
  fetchHistory();
}, [location.state && location.state.updated]);

  const fetchHistory = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/footprint/history', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (response.ok) {
        setHistory(data.history || data); // handle both formats
      } else {
        setError(data.error || 'Failed to fetch history');
      }
    } catch (err) {
      setError('An error occurred while fetching history');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this entry?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/footprint/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (res.ok) {
        alert('Entry deleted');
        setHistory(history.filter(entry => entry._id !== id));
      } else {
        alert(data.error || 'Failed to delete');
      }
    } catch (err) {
      alert('Server error while deleting');
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm("Are you sure you want to clear all history?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/footprint/clear/all`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (res.ok) {
        alert('All entries deleted');
        setHistory([]);
      } else {
        alert(data.error || 'Failed to delete');
      }
    } catch (err) {
      alert('Server error while deleting');
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
    <PageWrapper backgroundImage="/images/history-bk.jpg">
      <div className="max-w-4xl mx-auto p-6 text-green-500 dark:text-white">
        <h2 className="text-3xl font-bold mb-6 text-center">Emission History</h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        {history.length === 0 ? (
          <p className="text-green-500 dark:text-white text-center">No entries found.</p>
        ) : (
          history.map((entry) => (
            <div
              key={entry._id}
              className="bg-white/20 dark:bg-gray-800/40 backdrop-blur-md shadow-md rounded-lg p-4 mb-4"
            >
              <p className="text-green-500 dark:text-white font-semibold">
                Date: {getFormattedDate(entry)}
              </p>
              <p>Total Emissions: {entry.totalEmissionKg || entry.totalEmissions} kg CO₂</p>
              <p className="italic text-green-500 dark:text-gray-100">
                Suggestions: {entry.suggestions}
              </p>
              <div className="mt-3 flex gap-3">
                <button
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded"
                  onClick={() => navigate(`/edit/${entry._id}`)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded"
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
            className="mt-6 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded block mx-auto">
            Clear All History
          </button>
        )}
      </div>
    </PageWrapper>
  );
};

export default History;
