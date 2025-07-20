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
      <div className="absolute top-4 left-0 pl:2 md:pl-3 text-base md:text-2xl font-semibold text-emerald-600 dark:text-gray-100 transition-colors duration-500">
      🫡 Welcome, {user?.name || 'User'}
      </div>
    </div>
    <div className="w-full max-w-7xl flex flex-col text-emerald-500 dark:text-gray-100 px-6 transition-colors duration-500 overflow-visible overflow-x-hidden">
    <div className=" py-6 md:my-8 text-center mx-auto">
      <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-emerald-500 dark:text-white transition-colors duration-500">
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
                <p className="text-2xl md:text-3xl font-semibold text-emerald-500 dark:text-white transition-colors duration-500"><strong>🏭 Total Emission:</strong> {entry.totalEmissionKg} kg CO2</p>
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
      <p dangerouslySetInnerHTML={{ __html: entry.suggestions }} ></p>
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
            <div className="text-2xl md:text-3xl font-semibold text-emerald-600 dark:text-white text-center">
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
          🌫️ Carbon Dioxide (CO₂) is like Earth's invisible blanket. It keeps us warm — but too much of it, from burning fuels 🚗🔥,causes overheating and extreme weather patterns! 😓
        </p>
        <ul className="list-disc list-inside text-sm text-emerald-500 dark:text-gray-100 mt-2 transition-colors duration-500">
          <li>🌀 Methane (CH₄): Produced by livestock, rice farming, and landfill. </li>
          <li>🌾 Nitrous Oxide (N₂O): Released from fertilizers and agricultural activities.</li>
          <li>❄️ Fluorinated Gases: Man-made gases from industrial processes and cooling system. </li>
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
        🧮 In 2024, the average carbon footprint was about <strong>4.7 tons per year</strong> (~392 kg per month). 
        But this varies widely by region:
        <br />🌎 <strong>USA:</strong> ~1,240 kg/month 😬 (energy-heavy lifestyle)
        <br />🇮🇳 <strong>India:</strong> ~192 kg/month (rising with rapid urbanization)
        <br />🌍 <strong>Sub-Saharan Africa:</strong> ~75 kg/month (lowest yet most affected by climate change)
        <br />
        <br />
        Each ton matters. Cutting down even by 10% — through energy conservation, green transport, and mindful habits — 
        helps slow climate change for future generations. 🌱
      </p>
    ),
  },
   {
    id: 'impact',
    title: '🌡️ Carbon and Greenhouse Gases',
    content: (
      <p className="text-sm text-emerald-500 dark:text-gray-100 transition-colors duration-500">
        CO₂ is the largest contributor to global warming, trapping heat like a thermal blanket. 
        Other gases such as CH₄, N₂O, and F-gases multiply the effect. Together, they’re driving 
        extreme weather — hotter summers, stronger storms, and rising sea levels. 🌪️🔥🌊  
        <br />
        Every action to reduce emissions — from using renewable energy to planting trees — 
        slows the rise of Earth’s temperature and protects ecosystems worldwide. 🌳
      </p>
    ),
  },
   {
    id: 'solutions',
    title: '🔍 Why Calculate Your Carbon Footprint?',
    content: (
      <p className="text-sm text-emerald-500 dark:text-gray-100 transition-colors duration-500">
        📏 Knowing your footprint shows how your choices affect the planet. You’ll identify 
        areas to cut emissions — whether it’s switching to renewable energy, reducing car travel, 
        or improving home efficiency.  
        <br />
        <br />
        Tracking your impact helps you build sustainable habits, save money, and join a 
        growing community of people making positive environmental changes. 🌿
      </p>
    ),
  },
  {
    id: 'calculator',
    title: '📱 How Our Calculator Works',
    content: (
      <p className="text-sm text-emerald-500 dark:text-gray-100 transition-colors duration-500">
        Our tool estimates your emissions based on <em>energy use</em> ⚡, <em>travel habits</em> 🚙✈️, 
        <em>diet</em> 🥗, and <em>waste management</em> ♻️.  
        <br />
        <br />
        After entering your details, you’ll get a breakdown of your monthly CO₂ footprint 
        and practical suggestions for reducing it. Think of it as your personal guide to 
        sustainable living — simple, clear, and actionable! ✨
      </p>
    ),
  },
  {
    id: 'action',
    title: '🌱 Your Action Plan Starts Here!',
    content: (
      <ul className="list-disc list-inside text-sm text-emerald-500 dark:text-gray-100 transition-colors duration-500">
        <li>💡 <strong>Energy:</strong> Switch to LEDs, unplug idle electronics, and explore solar options.</li>
        <li>🚶‍♂️ <strong>Transport:</strong> Walk, cycle, or use public transit to cut fuel emissions.</li>
        <li>♻️ <strong>Waste:</strong> Reuse, recycle, and compost to reduce landfill methane.</li>
        <li>🥦 <strong>Diet:</strong> Incorporate more plant-based meals and reduce food waste.</li>
        <li>📣 <strong>Voice:</strong> Support eco-friendly policies and encourage others to act sustainably.</li>
        <li>🌍 <strong>Mindset:</strong> Small changes, multiplied by millions, can reshape our planet’s future.</li>
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
