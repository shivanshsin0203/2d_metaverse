import { useState } from 'react';
import { Calendar, Users, HelpCircle, Globe, Search, MoreVertical, Plus } from 'lucide-react';
import PropTypes from 'prop-types';

// NavigationButton component
const NavigationButton = ({ children, isActive = false }) => (
  <button
    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
      isActive ? 'bg-[#464B6B] text-white' : 'text-gray-300 hover:bg-[#464B6B]'
    }`}
  >
    {children}
  </button>
);
NavigationButton.propTypes = {
  children: PropTypes.node.isRequired,
  isActive: PropTypes.bool,
};

// SpaceCard component
// SpaceCard component



const SpaceCard = ({ title, lastVisited, image }) => (
  <div className="relative group">
    <div className="absolute top-3 left-3 bg-black/50 text-white px-2 py-1 rounded-full text-sm flex items-center gap-1">
      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
      0
    </div>
    <div className="relative overflow-hidden rounded-lg group-hover:ring-2 ring-[#63E2B7] transition-all">
      <img
        src={image}
        alt={title}
        className="w-full h-48 object-cover"
      />
      <div className="absolute bottom-0 left-0 right-0 p-3 flex justify-between items-center">
        <span className="text-white font-medium">{title}</span>
        <div className="flex items-center gap-2">
          <span className="text-gray-300 text-sm">{lastVisited}</span>
          <button className="text-white hover:bg-white/20 p-1 rounded">
            <MoreVertical size={16} />
          </button>
        </div>
      </div>
    </div>
  </div>
);
SpaceCard.propTypes = {
    title: PropTypes.string.isRequired,
    lastVisited: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
}
// MySpace component
const MySpace = () => {
  const [activeTab, setActiveTab] = useState('Last Visited');
  
  return (
    <div className="min-h-screen bg-[#242846]">
      {/* Navigation Bar */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
        {/* Left Section */}
        <div className="flex items-center gap-6">
          <img
            src="https://cdn-icons-png.flaticon.com/512/3054/3054881.png"
            alt="Gather Logo"
            className="w-8 h-8"
          />
          <div className="flex items-center gap-2">
            <NavigationButton>
              <Calendar size={20} />
              Events
            </NavigationButton>
            <NavigationButton isActive>
              <Users size={20} />
              My Spaces
            </NavigationButton>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          <NavigationButton>
            <HelpCircle size={20} />
            Resources
          </NavigationButton>
          <NavigationButton>
            <Globe size={20} />
            English
          </NavigationButton>
          <img
            src="/api/placeholder/32/32"
            alt="User Avatar"
            className="w-8 h-8 rounded-full"
          />
          <button className="bg-[#63E2B7] text-[#242846] px-4 py-2 rounded-lg font-medium hover:bg-opacity-90 transition-colors flex items-center gap-2">
            <Plus size={20} />
            Create Space
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="px-6 py-8">
        {/* Tabs and Search */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex gap-4">
            {['Last Visited', 'Created Spaces'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeTab === tab 
                    ? 'bg-[#464B6B] text-white' 
                    : 'text-gray-300 hover:bg-[#464B6B]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search"
              className="bg-[#464B6B] text-white pl-10 pr-4 py-2 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#63E2B7]"
            />
          </div>
        </div>

        {/* Spaces Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <SpaceCard
            title="Sample Space"
            lastVisited="9 days ago"
            image="/api/placeholder/400/300"
          />
          {/* Add more SpaceCards as needed */}
        </div>
      </main>
    </div>
  );
};

export default MySpace;
