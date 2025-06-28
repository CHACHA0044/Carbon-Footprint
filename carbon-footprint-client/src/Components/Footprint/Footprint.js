import API from '../../../api/api';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageWrapper from 'common/PageWrapper';

const Footprint = () => {
  const [formData, setFormData] = useState({
    food: { type: '', amountKg: '' },
    transport: [],
    electricity: [],
    waste: [{ plasticKg: '', paperKg: '', foodWasteKg: '' }]
  });

  const handleFoodChange = (e) => {
    setFormData({
      ...formData,
      food: { ...formData.food, [e.target.name]: e.target.value }
    });
  };

  const handleTransportChange = (index, e) => {
    const updated = [...formData.transport];
    updated[index] = { ...updated[index], [e.target.name]: e.target.value };
    setFormData({ ...formData, transport: updated });
  };

  const addTransport = () => {
    setFormData({
      ...formData,
      transport: [...formData.transport, { mode: '', distanceKm: '' }]
    });
  };

  const handleElectricityChange = (index, e) => {
    const updated = [...formData.electricity];
    updated[index] = { ...updated[index], [e.target.name]: e.target.value };
    setFormData({ ...formData, electricity: updated });
  };

  const addElectricity = () => {
    setFormData({
      ...formData,
      electricity: [...formData.electricity, { source: '', consumptionKwh: '' }]
    });
  };

  const handleWasteChange = (e) => {
    setFormData({
      ...formData,
      waste: [{ ...formData.waste[0], [e.target.name]: e.target.value }]
    });
  };
 // ADD THIS

const navigate = useNavigate(); // INIT

const handleSubmit = async (e) => {
  e.preventDefault();
  const token = localStorage.getItem('token');
  if (!token) {
    alert('❌ Please login first.');
    navigate('/login');
    return;
  }

  try {
    const response = await API.post('/footprint', formData, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    });

    const data = response.data;

    alert(`✅ ${data.message || 'Footprint entry submitted successfully'}`);
    navigate('/dashboard'); // 👈 redirect to Dashboard
  } catch (err) {
    const errorMsg = err.response?.data?.error || 'Something went wrong';
    console.error('❌ Error:', err);
    alert(`❌ ${errorMsg}`);
  }
};

  return (
    <PageWrapper backgroundImage="/images/dashboard-bk.jpg">
      <div className="flex flex-col items-center justify-center min-h-screen w-full px-4">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-xl p-6 bg-white/10 dark:bg-black/30 backdrop-blur-lg rounded-xl text-white space-y-6 shadow-xl transition-all duration-500"
        >
          <h2 className="text-3xl font-bold text-center text-emerald-500 dark:text-gray-100">Carbon Footprint Entry</h2>
            <h3 className="text-1xl font-bold text-center text-emerald-500 dark:text-gray-100">Enter your estimated carbon data for this month 🌍</h3>
          {/* Food Section */}
          <div>
            <label className="block mb-1 text-emerald-500 dark:text-gray-100">Diet Type 𓌉◯𓇋</label>
            <select
              name="type"
              value={formData.food.type}
              onChange={handleFoodChange}
              className="w-full bg-white/10 dark:bg-black/30 text-emerald-500 dark:text-gray-100 border-b border-emerald-500 focus:outline-none py-2 px-3 rounded-md backdrop-blur-sm transition duration-300
             appearance-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400">
              <option value="">-- Select --</option>
              <option value="Animal based">Animal based 🍖</option>
              <option value="Plant based">Plant based 🪴</option>
              <option value="Both">Mixed 🍔</option>
            </select>
            <input
              type="number"
              name="amountKg"
              placeholder="Amount (kg)"
              value={formData.food.amountKg}
              onChange={handleFoodChange}
              className="w-full bg-transparent border-b border-emerald-500 focus:outline-none py-1 mt-2"
            />
          </div>

          {/* Transport Section */}
          <div>
            <label className="block mb-1 text-emerald-500 dark:text-gray-100">Transport 🛸</label>
            {formData.transport.map((t, i) => (
              <div key={i} className="space-y-2 mb-2">
                <select
                  name="mode"
                  value={t.mode}
                  onChange={(e) => handleTransportChange(i, e)}
                  className="w-full bg-white/10 dark:bg-black/30 text-emerald-500 dark:text-gray-100 border-b border-emerald-500 focus:outline-none py-2 px-3 rounded-md backdrop-blur-sm transition duration-300
             appearance-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400">
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
                  name="distanceKm"
                  placeholder="Distance (km)"
                  value={t.distanceKm}
                  onChange={(e) => handleTransportChange(i, e)}
                  className="w-full bg-transparent border-b border-emerald-500 focus:outline-none py-1"
                />
              </div>
            ))}
            <button
              type="button"
              onClick={addTransport}
              className="text-emerald-500 dark:text-gray-100 hover:text-emerald-200 transition"
            >
              + Add Transport Source
            </button>
          </div>

          {/* Electricity Section */}
          <div>
            <label className="block mb-1 text-emerald-500 dark:text-gray-100">Electricity ⚡</label>
            {formData.electricity.map((el, i) => (
              <div key={i} className="space-y-2 mb-2">
                <select
                  name="source"
                  value={el.source}
                  onChange={(e) => handleElectricityChange(i, e)}
                  className="w-full bg-white/10 dark:bg-black/30 text-emerald-500 dark:text-gray-100 border-b border-emerald-500 focus:outline-none py-2 px-3 rounded-md backdrop-blur-sm transition duration-300
             appearance-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400">
                  <option value="">-- Source --</option>
                  <option value="Coal">Coal 🔥</option>
                  <option value="Solar">Solar ☀️</option>
                  <option value="Wind">Wind ༄</option>
                  <option value="Hydro">Hydro 🌊</option>
                  <option value="Mixed">Mixed 𓇼</option>
                </select>
                <input
                  type="number"
                  name="consumptionKwh"
                  placeholder="Consumption (kWh)"
                  value={el.consumptionKwh}
                  onChange={(e) => handleElectricityChange(i, e)}
                  className="w-full bg-transparent border-b border-emerald-500 focus:outline-none py-1"
                />
              </div>
            ))}
            <button
              type="button"
              onClick={addElectricity}
              className="text-emerald-500 dark:text-gray-100 hover:text-emerald-200 transition"
            >
              + Add Electricity Source
            </button>
          </div>

          {/* Waste Section */}
          <div>
            <label className="block mb-1 text-emerald-500 dark:text-gray-100">Waste 🗑️(kg)</label>
            <input
              type="number"
              name="plasticKg"
              placeholder="Plastic"
              value={formData.waste[0].plasticKg}
              onChange={handleWasteChange}
              className="w-full bg-transparent border-b border-emerald-500 focus:outline-none py-1 mb-2"
            />
            <input
              type="number"
              name="paperKg"
              placeholder="Paper"
              value={formData.waste[0].paperKg}
              onChange={handleWasteChange}
              className="w-full bg-transparent border-b border-emerald-500 focus:outline-none py-1 mb-2"
            />
            <input
              type="number"
              name="foodWasteKg"
              placeholder="Food Waste"
              value={formData.waste[0].foodWasteKg}
              onChange={handleWasteChange}
              className="w-full bg-transparent border-b border-emerald-500 focus:outline-none py-1"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 mt-4 font-semibold text-black bg-emerald-100 border border-white rounded hover:bg-emerald-500 hover:text-black transition duration-300"
          >
            Submit
          </button>
        </form>
      </div>
    </PageWrapper>
  );
};

export default Footprint;
