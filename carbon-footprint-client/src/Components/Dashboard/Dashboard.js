import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom'; 
import PageWrapper from 'common/PageWrapper';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openSection, setOpenSection] = useState(null);
  const [version, setVersion] = useState(0);
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
      setData(Array.isArray(result) ? result : result.history || []);
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
    const handleClickOutside = (event) => {
      if (sectionRefs.current.every((ref) => ref && !ref.contains(event.target))) {
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
    <motion.main
            initial={{ x:100, opacity: 0}}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="w-full h-full"
          >
    <PageWrapper backgroundImage="/images/dashboard-bk.webp">
    <div className="relative w-full px-0">
      <div className="absolute top-6 left-0 pl-4 text-base md:text-2xl font-semibold text-emerald-600 dark:text-gray-100 transition-colors duration-500">
      🫡 Welcome, {user?.name || 'User'}
      </div>
    </div>
    <div className="w-full max-w-6xl flex flex-col text-emerald-500 dark:text-gray-100 px-6 py-8 space-y-6 transition-colors duration-500">
    <div className="mt-8 mb-6 text-center mx-auto">
      <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-emerald-500 dark:text-white transition-colors duration-500">
        Your Climate Dashboard
      </h1>
    </div>

        <main className="flex flex-col space-y-6">
          {loading ? (
            <p>Loading your carbon data...</p>
          ) : data.length > 0 ? (
            data.map((entry, index) => (
              <div
                key={index}
                className="bg-white/20 dark:bg-gray-800/40 rounded-xl backdrop-blur-md p-4 shadow-md text-sm transition-all duration-500 cursor-pointer"
                onClick={() =>
                  setOpenSection((prev) => (prev === `suggestion-${index}` ? null : `suggestion-${index}`))
                }
              >
                <p className="text-2xl md:text-3xl font-semibold text-emerald-500 dark:text-white transition-colors duration-500"><strong>Total Emission:</strong> {entry.totalEmissionKg} kg CO2</p>
                <section
  key={`suggestion-${index}`}
  ref={(el) => (sectionRefs.current[index + 100] = el)} // Avoid ref overlap with other sections
  className="px-1 pb-1 cursor-pointer transition-all duration-500"
  
>
  <h2 className="text-xl md:text-2xl font-bold text-emerald-500 dark:text-white transition-colors duration-500">
  {openSection === `suggestion-${index}` ? 'Suggestions:' : 'Suggestions...'}
  </h2>
  <div
    className={`transition-all duration-500 ease-in-out overflow-hidden ${
      openSection === `suggestion-${index}`
        ? 'max-h-[500px] opacity-100 mt-1'
        : 'max-h-0 opacity-0'
    }`}
  >
    <p className="text-sm text-emerald-500 dark:text-gray-100 transition-colors duration-500">
      {entry.suggestions}
    </p>
  </div>
</section>

              </div>
            ))
          ) : (
            <div className="text-center">
              <p className="text-2xl md:text-3xl font-semibold text-emerald-600 dark:text-white transition-colors duration-500">You haven't submitted any carbon data yet.</p>
            </div>
          )}

          {/* Expandable Sections */}
          <div className="mb-6 pb-8 space-y-6 pr-2 will-change-transform">
          {[
            {
              id: 'understanding',
              title: 'Understanding the Air We Share',
              content: (
                <>
                  <p className="text-sm text-emerald-500 dark:text-gray-100 transition-colors duration-500">
                    Carbon Dioxide (CO2) is the primary greenhouse gas linked to human activity. Think of greenhouse gases as a natural blanket around Earth, trapping heat and keeping our planet warm enough to live. However, too much of this "blanket" – largely from burning fossil fuels like coal, oil, and natural gas – traps excess heat, leading to global warming.
                  </p>
                  <ul className="list-disc list-inside text-sm text-emerald-500 dark:text-gray-100 mt-2 transition-colors duration-500">
                    <li>Methane (CH4): Potent, often from agriculture (livestock) and waste.</li>
                    <li>Nitrous Oxide (N2O): From fertilizers and industrial processes.</li>
                    <li>Fluorinated Gases(e.g., HFCs, PFCs): Used in refrigeration, with high warming potential.</li>
                  </ul>
                  <p className="text-sm text-emerald-500 dark:text-gray-100 mt-2 transition-colors duration-500">
                    These gases, even in small amounts, significantly amplify the greenhouse effect.
                  </p>
                </>
              ),
            },
            {
              id: 'global',
              title: 'How Much CO₂ Do We Emit Individually?',
              content: (
                <p className="text-sm text-emerald-500 dark:text-gray-100 transition-colors duration-500">
                  In 2024, the global average carbon footprint per person was approximately 4.7 metric tons of CO₂ per year, which translates to about 392 kg per month. This marks a slight increase from 2023, driven by factors like post-pandemic economic recovery in developing countries, higher energy consumption, and a slow global shift away from fossil fuels. Emissions vary widely by region—while countries like the United States average around 1,240 kg per month, nations such as India and Sub-Saharan Africa emit significantly less, at 192 kg and 75 kg respectively. Understanding these differences helps individuals and policymakers take informed climate action.
                  (2024 Data, In 2025 it is around 375 Kg CO2 per person per month, and we our only half way through 2025)
                </p>
              ),
            },
            {
              id: 'impact',
              title: 'Carbon and Greenhouse Gases',
              content: (
                <p className="text-sm text-emerald-500 dark:text-gray-100 transition-colors duration-500">
                  Carbon dioxide (CO2) is the most significant of the greenhouse gases (GHGs) released by human activities. Greenhouse gases are atmospheric gases that absorb and emit radiant energy within the thermal infrared range, causing the greenhouse effect. Other important GHGs include methane (CH4), nitrous oxide (N2O), and fluorinated gases. While the greenhouse effect is a natural process essential for life on Earth, an increased concentration of these gases due to human activity traps excessive heat, leading to a rise in global temperatures and disruptive climate patterns.
                </p>
              ),
            },
             
            {
              id: 'solutions',
              title: 'Why Calculate Your Carbon Footprint?',
              content: (
                <p className="text-sm text-emerald-500 dark:text-gray-100 transition-colors duration-500">
                  Calculating your carbon footprint is the first step towards taking meaningful action. It provides a personalized understanding of your contribution to climate change, highlighting areas where you can make the most significant reductions. Whether it's opting for renewable energy, reducing waste, choosing sustainable transportation, or making conscious dietary choices, knowing your footprint empowers you to make informed decisions that benefit both you and the planet. Join us in building a more sustainable future, one conscious choice at a time.
                </p>
              ),
            },
            {
              id: 'calculator',
              title: 'How Our Calculator Works',
              content: (
                <p className="text-sm text-emerald-500 dark:text-gray-100 transition-colors duration-500">
                 Our carbon emission calculator is designed to be user-friendly and comprehensive. We consider various aspects of your lifestyle, including energy consumption (electricity, heating), transportation (car, public transport, flights), waste generation, and even dietary choices. By inputting accurate data, you'll receive an estimated carbon footprint, broken down by category. This breakdown will help you identify the areas with the highest emissions, allowing you to prioritize your efforts for maximum impact.
                </p>
              ),
            },
            {
              id: 'action',
              title: 'Beyond the Numbers: Your Action Plan',
              content: (
                <ul className="list-disc list-inside text-sm text-emerald-500 dark:text-gray-100 transition-colors duration-500">
                  <li>Energy: Switch to LED, consider solar.</li>
                  <li>Travel: Walk, cycle, use EVs.</li>
                  <li>Consumption: Reduce, reuse, recycle.</li>
                  <li>Diet: Eat more plant-based meals.</li>
                  <li>Advocacy: Support green policies.</li>
                </ul>
              ),
            },
         ].map((section, index) => (
  <section
    key={section.id}
    ref={(el) => (sectionRefs.current[index] = el)}
    className="p-4 bg-white/20 dark:bg-gray-800/40 rounded-xl backdrop-blur-md shadow-md cursor-pointer transition-all duration-500"
    onClick={() =>
      setOpenSection((prev) => (prev === section.id ? null : section.id))
    }
  >
    <h2 className="text-2xl md:text-3xl font-bold text-emerald-500 dark:text-white mb-2 transition-colors duration-500">
      {section.title}
    </h2>
    <div
      className={`transition-all duration-500 ease-in-out overflow-hidden ${
        openSection === section.id ? 'max-h-[500px] opacity-y-auto opacity-100 mt-2' : 'max-h-0 opacity-0'
      }`}
    >
      {section.content}
    </div>
  </section>
))

}</div>
        </main>
        
<div className="w-full mt-2 mb-2 px-2">
  <div className="relative w-full h-[80px] hidden sm:block">
    {/* Desktop Layout */}
    <button
      onClick={() => navigate('/footprint')}
      className="absolute bottom-0 left-4 px-4 py-2 flex items-center justify-center text-emerald-500 dark:text-white bg-transparent border border-white rounded hover:bg-emerald-700 hover:text-white dark:hover:text-black active:scale-95 focus:ring focus:ring-green-800 transition duration-300"
    >
      Submit New Entry
    </button>
    <button
      onClick={() => navigate('/history')}
      className="absolute bottom-0 left-1/2 transform -translate-x-1/2 px-4 py-2 flex items-center justify-center text-emerald-500 dark:text-white bg-transparent border border-white rounded hover:bg-emerald-700 hover:text-white dark:hover:text-black active:scale-95 focus:ring focus:ring-green-800 transition duration-300"
    >
      Edit Entries
    </button>
    <button
      onClick={handleLogout}
      className="absolute bottom-0 right-4 px-4 py-2 flex items-center justify-center text-emerald-500 dark:text-white bg-transparent border border-white rounded hover:bg-emerald-700 hover:text-white dark:hover:text-black active:scale-95 focus:ring focus:ring-green-800 transition duration-300"
    >
      Logout
    </button>
  </div>

  <div className="flex flex-col gap-4 sm:hidden mt-2">
    {/* Mobile Layout */}
    <button
      onClick={() => navigate('/footprint')}
      className="w-full px-4 py-2 flex items-center justify-center text-emerald-500 dark:text-white bg-transparent border border-white rounded hover:bg-emerald-700 hover:text-white dark:hover:text-black active:scale-95 focus:ring focus:ring-green-800 transition duration-300"
    >
      Submit New Entry
    </button>
    <button
      onClick={() => navigate('/history')}
      className="w-full px-4 py-2 flex items-center justify-center text-emerald-500 dark:text-white bg-transparent border border-white rounded hover:bg-emerald-700 hover:text-white dark:hover:text-black active:scale-95 focus:ring focus:ring-green-800 transition duration-300"
    >
      Edit Entries
    </button>
    <button
      onClick={handleLogout}
      className="w-full px-4 py-2 flex items-center justify-center text-emerald-500 dark:text-white bg-transparent border border-white rounded hover:bg-emerald-700 hover:text-white dark:hover:text-black active:scale-95 focus:ring focus:ring-green-800 transition duration-300"
    >
      Logout
    </button>
  </div>
</div>


        </div>
    </PageWrapper>
    </motion.main>
  );
};

export default Dashboard;
