import API from '../../../api/api';

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageWrapper from 'common/PageWrapper';

const EditFootprintForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [form, setForm] = useState({
    food: { type: '', amountKg: '' },
    transport: [],
    electricity: [],
    waste: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEntry = async () => {
      try {
        const res = await API.get(`/footprint/${id}`, {
  headers: { Authorization: `Bearer ${token}` }
});
        const entry = res.data;
        setForm({
          food: entry.food || { type: '', amountKg: '' },
          transport: entry.transport || [],
          electricity: entry.electricity || [],
          waste: entry.waste || []
        });
        setLoading(false);
      } catch (err) {
        alert('Failed to load entry');
      }
    };
    fetchEntry();
  }, [id, token]);

  const handleChange = (section, field, value, index = null) => {
    if (index !== null) {
      const updated = [...form[section]];
      updated[index][field] = value;
      setForm({ ...form, [section]: updated });
    } else {
      setForm({ ...form, [section]: { ...form[section], [field]: value } });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
  const res = await API.put(`/footprint/${id}`, form, {
    headers: { Authorization: `Bearer ${token}` }
  });

  alert('Entry updated successfully');
  navigate('/dashboard', { state: { updated: Date.now() } });
} catch (err) {
  const errorMsg = err.response?.data?.error || 'Update failed';
  alert(errorMsg);
}
  };

  if (loading) return <p className="text-center text-white">Loading entry...</p>;

  return (
    <PageWrapper backgroundImage="/images/edit-bk.jpg">
      <div className="min-h-screen flex justify-center items-center px-4 py-10">
        <div className="w-full max-w-2xl bg-white/20 dark:bg-gray-800/40 backdrop-blur-md rounded-lg shadow-lg p-6 text-green-500 dark:text-white">
          <h2 className="text-2xl font-semibold mb-6 text-center">✏️ Edit Your Carbon Entry</h2>
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* FOOD SECTION */}
            <div>
              <h3 className="font-semibold mb-2 ">🍽️ Food</h3>
              <label className="block mb-1 text-sm ">Type:</label>
              <select
  name="type"
  value={form.food?.type || ''}
  onChange={(e) => setForm({ ...form, food: { ...form.food, type: e.target.value } })}
  className="w-full bg-white/10 dark:bg-black/30 text-emerald-600 dark:text-gray-100 
             border border-emerald-400 focus:outline-none py-2 px-3 rounded-md 
             backdrop-blur-sm transition duration-300 appearance-none 
             focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
>
  <option value="">-- Select --</option>
  <option value="Animal based">Animal based 🍖</option>
  <option value="Plant based">Plant based 🪴</option>
  <option value="Both">Mixed 🍔</option>
</select>

              <label className="block mt-2 mb-1 text-sm">Amount (kg):</label>
               <input
      type="number"
      placeholder="Amount (kg)"
      value={form.food.amountKg}
      onChange={(e) => handleChange('food', 'amountKg', e.target.value)}
      className="w-full bg-transparent border-b border-emerald-500 focus:outline-none py-1 
                 text-emerald-600 dark:text-gray-100"
    />
            </div>

           {/* Transport Section */}
<div>
  <label className="block mb-1 text-emerald-500 dark:text-gray-100">Transport 🛸</label>
  {form.transport.map((t, i) => (
    <div key={i} className="space-y-2 mb-2">
      <select
        name="mode"
        value={t.mode}
        onChange={(e) => handleChange('transport', 'mode', e.target.value, i)}
        className="w-full bg-white/10 dark:bg-black/30 text-emerald-500 dark:text-gray-100 
                   border-b border-emerald-500 focus:outline-none py-2 px-3 rounded-md 
                   backdrop-blur-sm transition duration-300 appearance-none 
                   focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400"
      >
        <option value="">-- Mode --</option>
        <option value="Car">Car 🏎️</option>
        <option value="Bike">Bike 🏍️</option>
        <option value="Bus">Bus 🚐</option>
        <option value="Metro">Metro 🚊</option>
        <option value="Train">Train 🚂</option>
        <option value="Flights">Flights ✈️</option>
      </select>
      <input
        type="number"
        placeholder="Distance (km)"
        value={t.distanceKm}
        onChange={(e) => handleChange('transport', 'distanceKm', e.target.value, i)}
        className="w-full bg-transparent border-b border-emerald-500 focus:outline-none py-1 
                   text-emerald-500 dark:text-gray-100"
      />
    </div>
  ))}
</div>


            {/* Electricity Section */}
<div>
  <label className="block mb-1 text-emerald-500 dark:text-gray-100">Electricity ⚡</label>
  {form.electricity.map((el, i) => (
    <div key={i} className="space-y-2 mb-2">
      <select
        name="source"
        value={el.source}
        onChange={(e) => handleChange('electricity', 'source', e.target.value, i)}
        className="w-full bg-white/10 dark:bg-black/30 text-emerald-500 dark:text-gray-100 
                   border-b border-emerald-500 focus:outline-none py-2 px-3 rounded-md 
                   backdrop-blur-sm transition duration-300 appearance-none 
                   focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400"
      >
        <option value="">-- Source --</option>
        <option value="Coal">Coal 🔥</option>
        <option value="Solar">Solar ☀️</option>
        <option value="Wind">Wind ༄</option>
        <option value="Hydro">Hydro 🌊</option>
        <option value="Mixed">Mixed 𓇼</option>
      </select>
      <input
        type="number"
        placeholder="Consumption (kWh)"
        value={el.consumptionKwh}
        onChange={(e) => handleChange('electricity', 'consumptionKwh', e.target.value, i)}
        className="w-full bg-transparent border-b border-emerald-500 focus:outline-none py-1 
                   text-emerald-500 dark:text-gray-100"
      />
    </div>
  ))}
</div>


            {/* WASTE */}
            <div>
              <h3 className="font-semibold mb-2">🗑️ Waste</h3>
              {form.waste.map((w, i) => (
                <div key={i} className="mb-2">
                  <label className="block text-sm">Plastic (kg):</label>
                  <input
        type="number"
        placeholder="Plastic (kg)"
        value={w.plasticKg}
        onChange={(e) => handleChange('waste', 'plasticKg', e.target.value, i)}
        className="w-full bg-transparent border-b border-emerald-500 focus:outline-none py-1 
                   text-emerald-600 dark:text-gray-100"
      />
      <input
        type="number"
        placeholder="Paper (kg)"
        value={w.paperKg}
        onChange={(e) => handleChange('waste', 'paperKg', e.target.value, i)}
        className="w-full bg-transparent border-b border-emerald-500 focus:outline-none py-1 
                   text-emerald-600 dark:text-gray-100"
      />
      <input
        type="number"
        placeholder="Food Waste (kg)"
        value={w.foodWasteKg}
        onChange={(e) => handleChange('waste', 'foodWasteKg', e.target.value, i)}
        className="w-full bg-transparent border-b border-emerald-500 focus:outline-none py-1 
                   text-emerald-600 dark:text-gray-100"
      />
                </div>
              ))}
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded transition"
            >
              💾 Save Changes
            </button>
          </form>
        </div>
      </div>
    </PageWrapper>
  );
};

export default EditFootprintForm;
