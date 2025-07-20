import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; 
import { motion } from 'framer-motion';
import PageWrapper from 'common/PageWrapper';
import { AnimatePresence } from 'framer-motion';

  const Dashboard = () => {
  const [data, setData] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openSection, setOpenSection] = useState(null);
  const [version, setVersion] = useState(0);
  const [showLimitMsg, setShowLimitMsg] = useState(false);
  const sectionRefs = useRef([]);
  const location = useLocation();
  const navigate = useNavigate(); 
  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      const storedUser = JSON.parse(localStorage.getItem('user'));
      if (storedUser && storedUser.name) {
        setUser(storedUser);
      }

      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/footprint/history`, {
  headers: { Authorization: `Bearer ${token}` },
});


      const result = await res.json();
    const allEntries = Array.isArray(result) ? result : result.history || [];
const sortedData = allEntries
  .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))
  .slice(0, 5);
setData(sortedData);
setShowLimitMsg(allEntries.length >= 5);
    } catch (err) {
      console.error('Error fetching data:', err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [version]);

 useEffect(() => {
  if (location.state?.updated) {
    fetchHistory();
    window.history.replaceState({}, document.title);
  }
}, [location.state?.updated]);

 useEffect(() => {
  if (!loading && data.length > 0) {
    window.scrollTo({ top: 0, left:0, behavior: 'instant' });
  }
}, [data, loading]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sectionRefs.current.every(ref => !ref || !ref.contains(event.target))) {
    setOpenSection(null);
}
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/home');
  };

  return (
    <motion.div
            initial={{ x:100, opacity: 0}}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="w-full h-full"
          >
    <PageWrapper backgroundImage="/images/dashboard-bk.webp">
    <div className="relative w-full px-0">
      <div className="absolute top-6 left-0 pl-3 text-base md:text-2xl font-semibold text-emerald-600 dark:text-gray-100 transition-colors duration-500">
      🫡 Welcome, {user?.name || 'User'}
      </div>
    </div>
    <div className="w-full max-w-7xl flex flex-col text-emerald-500 dark:text-gray-100 px-6 py-4 space-y-4 transition-colors duration-500 overflow-visible overflow-x-hidden">
    <div className=" py-4 md:my-6 text-center mx-auto">
      <h1 className="text-4xl md:text-6xl mb:2 font-bold tracking-tight text-emerald-500 dark:text-white transition-colors duration-500">
        Your Climate Dashboard
      </h1>
      {showLimitMsg && (
  <motion.div
    key="limit-msg"
    initial={{ scale: 0.9, opacity: 0 }}
    animate={{ scale: [1.2, 0.9, 1.05, 1], opacity: 1 }}
    transition={{ duration: 0.8, ease: "easeInOut" }}
    className="mt-2 mb-4 text-center p-3 text-sm text-yellow-800 bg-yellow-100 border border-yellow-300 rounded-lg"
  >
    You have reached the limit of 5 entries. Please delete older entries to add new ones.
  </motion.div>
)}


    </div>

        <main className="flex flex-col space-y-6">
          {loading ? (
            <motion.p
  initial={{ opacity: 0 }}
  animate={{ opacity: [0.3, 1, 0.3] }}
  transition={{ repeat: Infinity, duration: 1.5 }}
  className="text-lg text-emerald-600 dark:text-gray-100"
>
  Loading your carbon data...
</motion.p>

          ) : data.length > 0 ? (
            <AnimatePresence>
            <motion.div
            className="flex flex-col gap-6"
              variants={{
                visible: { transition: { staggerChildren: 0.1 } },
                hidden: {},
              }}
              initial="hidden"
              animate="visible"
            >
            {data.map((entry, index) => (
              <motion.div
                key={entry._id || index}
                layout
                initial={{ opacity: 0, y: -30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                whileHover={{ scale: 1.03, boxShadow: "0px 8px 20px rgba(0,0,0,0.2)" }}
                whileTap={{ scale: 0.97, transition: { duration: 0.05 } }}
                className="bg-white/20 dark:bg-gray-800/40 rounded-xl backdrop-blur-md p-4 shadow-md text-sm origin-center transition-colors duration-300 cursor-pointer"
                onClick={() =>
                  setOpenSection((prev) => (prev === `suggestion-${index}` ? null : `suggestion-${index}`))
                }
              >
                <p className="text-2xl md:text-3xl font-semibold text-emerald-500 dark:text-white transition-colors duration-500"><strong>Total Emission:</strong> {entry.totalEmissionKg} kg CO2</p>
                <section
  key={`suggestion-${index}`}
  ref={(el) => (sectionRefs.current[index + data.length] = el)} 
  className="px-1 pb-1 cursor-pointer transition-all duration-500"
>
  <h2 className="text-xl md:text-2xl font-bold text-emerald-500 dark:text-white transition-colors duration-500">
  {openSection === `suggestion-${index}` ? 'Suggestions:' : 'Suggestions...'}
  </h2>
  <motion.div
  layout
    className={`transition-all duration-500 ease-in-out overflow-hidden ${
      openSection === `suggestion-${index}`
        ? 'max-h-[500px] opacity-100 mt-1'
        : 'max-h-0 opacity-0'
    }`}
  >
    <div className="text-sm text-emerald-500 dark:text-gray-100 transition-colors duration-500">
      <p>{entry.suggestions}</p>
    <p className="text-xs italic text-emerald-500 dark:text-white mt-1">
    {entry.updatedAt && entry.updatedAt !== entry.createdAt
      ? `Updated on ${new Date(entry.updatedAt).toLocaleString()}`
      : `Created on ${new Date(entry.createdAt).toLocaleString()}`}
  </p>
  </div>
  </motion.div>
</section>

              </motion.div>
            ))}
              </motion.div>
</AnimatePresence>
          ) : (
            <div className="text-2xl md:text-3xl mt-2 font-semibold text-emerald-600 dark:text-white text-center">
  You haven't submitted any carbon data yet 
  <motion.span
    className="inline-block text-3xl font-semibold"
    animate={{ opacity: [0, 1, 0] }}
    transition={{ duration: 1.2, repeat: Infinity, delay: 0 }}
  >.</motion.span>
  <motion.span
    className="inline-block text-3xl font-semibold"
    animate={{ opacity: [0, 1, 0] }}
    transition={{ duration: 1.2, repeat: Infinity, delay: 0.4 }}
  >.</motion.span>
  <motion.span
    className="inline-block text-3xl font-semibold"
    animate={{ opacity: [0, 1, 0] }}
    transition={{ duration: 1.2, repeat: Infinity, delay: 0.8 }}
  >.</motion.span>
</div>


          )}

          {/* Expandable Sections */}
          <div className="mb-6 pb-4 flex flex-col gap-6 pr-2 will-change-transform">
          {[
  {
    id: 'understanding',
    title: '🌍 Understanding the Air We Share',
    content: (
      <>
        <p className="text-sm text-emerald-500 dark:text-gray-100 transition-colors duration-500">
          🌫️ Carbon Dioxide (CO₂) is like Earth's invisible blanket. It keeps us warm — but too much of it, from burning fuels 🚗🔥, overheats the planet! 😓
        </p>
        <ul className="list-disc list-inside text-sm text-emerald-500 dark:text-gray-100 mt-2 transition-colors duration-500">
          <li>🌀 Methane (CH₄): From burping cows & landfills 🐄</li>
          <li>🌾 Nitrous Oxide (N₂O): From farming & fertilizers</li>
          <li>❄️ Fluorinated Gases: Used in fridges and ACs</li>
        </ul>
        <p className="text-sm text-emerald-500 dark:text-gray-100 mt-2 transition-colors duration-500">
          These gases trap heat and make Earth too hot to handle. 🔥
        </p>
      </>
    ),
  },
  {
    id: 'global',
    title: '📊 How Much CO₂ Do We Emit Individually?',
    content: (
      <p className="text-sm text-emerald-500 dark:text-gray-100 transition-colors duration-500">
        🧮 In 2024, the average carbon footprint was 4.7 tons/year (~392 kg/month). That’s a lot of CO₂! Emissions vary by country:
        <br />🌎 USA: 1,240 kg/month 😬
        <br />🇮🇳 India: 192 kg/month
        <br />🌍 Sub-Saharan Africa: 75 kg/month
        <br />
        Let’s keep it low — our future depends on it! 🌱
      </p>
    ),
  },
  {
    id: 'impact',
    title: '🌡️ Carbon and Greenhouse Gases',
    content: (
      <p className="text-sm text-emerald-500 dark:text-gray-100 transition-colors duration-500">
        CO₂ is the biggest greenhouse gas villain! 🦹‍♂️ It traps heat like a thermal blanket — great in winter, bad for the planet. Other gases like CH₄, N₂O, and F-gases add to the mess. Together, they change our climate dramatically. 🌪️☀️🌊
      </p>
    ),
  },
  {
    id: 'solutions',
    title: '🔍 Why Calculate Your Carbon Footprint?',
    content: (
      <p className="text-sm text-emerald-500 dark:text-gray-100 transition-colors duration-500">
        📏 Knowing your carbon footprint helps you take charge! You’ll see where you're doing great 🌟 and where you can improve 🌿 — from switching to green energy to biking instead of driving.
      </p>
    ),
  },
  {
    id: 'calculator',
    title: '📱 How Our Calculator Works',
    content: (
      <p className="text-sm text-emerald-500 dark:text-gray-100 transition-colors duration-500">
        Our tool is super simple! Just enter details like energy usage ⚡, travel 🚙✈️, diet 🥗, and waste ♻️. We’ll calculate your impact and help you cut down!
      </p>
    ),
  },
  {
    id: 'action',
    title: '🌱 Your Action Plan Starts Here!',
    content: (
      <ul className="list-disc list-inside text-sm text-emerald-500 dark:text-gray-100 transition-colors duration-500">
        <li>💡 Energy: Switch to LEDs or solar power</li>
        <li>🚶‍♂️ Travel: Walk, bike, or use public transport</li>
        <li>♻️ Waste: Reuse, recycle, reduce</li>
        <li>🥦 Diet: Try more plant-based meals</li>
        <li>📣 Voice: Speak up & support green policies</li>
      </ul>
    ),
  },
]
.map((section, index) => (
  <motion.section
  layout
    key={section.id}
    initial={{ opacity: 0, y: -30, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, scale: 0.8 }}
    transition={{ type: "spring", stiffness: 400, damping: 17 }}
    whileHover={{ scale: 1.03, boxShadow: "0px 8px 20px rgba(0,0,0,0.2)" }}
    whileTap={{ scale: 0.97, transition: { duration: 0.05 } }}
    ref={(el) => (sectionRefs.current[index] = el)}
    className="p-4 bg-white/20 dark:bg-gray-800/40 rounded-xl backdrop-blur-md shadow-md cursor-pointer origin-center transition-colors duration-300"
    onClick={() =>
      setOpenSection((prev) => (prev === section.id ? null : section.id))
    }
  >
    <h2 className="text-2xl md:text-3xl font-bold text-emerald-500 dark:text-white mb-2 transition-colors duration-500">
      {section.title}
    </h2>
    <div
      className={`transition-all duration-500 ease-in-out overflow-hidden ${  
        openSection === section.id ? 'max-h-[500px] opacity-100 mt-2' : 'max-h-0 opacity-0'
      }`}
    >
      {section.content}
    </div>
  </motion.section>
))

}</div>
        </main>
        
<div className="relative w-full flex flex-col sm:flex-row justify-between items-center pl-6 pr-6 gap-3">
  <button
    onClick={() => {
  if (data.length >= 5) {
  setShowLimitMsg(false);
  setTimeout(() => {
    setShowLimitMsg(true);
    setTimeout(() => window.scrollTo(0, 0), 50); 
  }, 50);
} else {
  navigate('/footprint');
}

}}
    className="w-32 sm:w-40 md:w-48 px-4 py-3 flex items-center justify-center text-emerald-500 dark:text-white bg-transparent border border-white rounded hover:bg-emerald-700 hover:text-white dark:hover:text-black active:scale-75 active:bg-emerald-800 dark:active:bg-white focus:ring focus:ring-green-800 transition duration-300"
  >
   New Entry
  </button>

  <button
    onClick={() => navigate('/history')}
    className="w-32 sm:w-40 md:w-48 px-4 py-3 flex items-center justify-center text-emerald-500 dark:text-white bg-transparent border border-white rounded hover:bg-emerald-700 hover:text-white dark:hover:text-black active:scale-75 active:bg-emerald-800 dark:active:bg-white focus:ring focus:ring-green-800 transition duration-300"
  >
    Edit Entries
  </button>

  <button
    onClick={handleLogout}
    className="w-32 sm:w-40 md:w-48 px-4 py-3 flex items-center justify-center text-emerald-500 dark:text-white bg-transparent border border-white rounded hover:bg-emerald-700 hover:text-white dark:hover:text-black active:scale-75 active:bg-emerald-800 dark:active:bg-white focus:ring focus:ring-green-800 transition duration-300"
  >
    Logout
  </button>
</div>
</div>
        
    </PageWrapper>
    </motion.div>
  );
};

export default Dashboard;
