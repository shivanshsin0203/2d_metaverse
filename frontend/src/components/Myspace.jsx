import { useState, useEffect } from 'react';
import { Calendar, Users, Globe, Search,  Plus, LogOut,  DeleteIcon } from 'lucide-react';
import PropTypes from 'prop-types';
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
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
const SpaceCard = ({ title, lastVisited,onDelete,onClick}) => {
  const handleDelete = () => {
    onDelete();
  }
  return(
  
  <div className="relative group" onClick={onClick}>
    <div className="absolute top-3 left-3 bg-black/50 text-white px-2 py-1 rounded-full text-sm flex items-center gap-1">
      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
      0
    </div>
    <div className="relative overflow-hidden rounded-lg group-hover:ring-2 ring-[#63E2B7] transition-all pb-10">
      <img
        src="https://i.ytimg.com/vi/60zpPbY1DLA/maxresdefault.jpg"
        alt={title}
        className="w-full h-48 object-cover"
      />
      <div className="absolute bottom-0 left-0 right-0 p-3 flex justify-between items-center">
        <span className="text-white font-medium">{title}</span>
        <div className="flex items-center gap-2">
          <span className="text-gray-300 text-sm">{lastVisited}</span>
          <button onClick={handleDelete} className="text-white hover:bg-white/20 p-1 rounded">
            <DeleteIcon size={16} />
          </button>
        </div>
      </div>
    </div>
  </div>
)};
SpaceCard.propTypes = {
    title: PropTypes.string.isRequired,
    lastVisited: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    onDelete: PropTypes.func.isRequired,
    onClick: PropTypes.func.isRequired,
}

// CreateSpaceModal component
const CreateSpaceModal = ({ onClose, onCreate }) => {
CreateSpaceModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onCreate: PropTypes.func.isRequired,
};
  const [title, setTitle] = useState('');
  const [name, setName] = useState('');
  const [isCreated, setIsCreated] = useState(false);

  const handleCreate = () => {
    if (title && name) {
      setIsCreated(true);
      onCreate({ title, lastVisited: 'Just now', image: '/api/placeholder/400/300' });
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 w-80 relative">
        {!isCreated ? (
          <>
            <h2 className="text-xl font-semibold mb-4">Create Space</h2>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
              className="w-full mb-4 p-2 border rounded-lg focus:outline-none"
            />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Name"
              className="w-full mb-4 p-2 border rounded-lg focus:outline-none"
            />
            <button
              onClick={handleCreate}
              className="w-full bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600 transition"
            >
              Create
            </button>
          </>
        ) : (
          <div className="text-center space-x-3">
            <p className="text-lg font-semibold mb-4">Space Created!</p>
            <button className="bg-green-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-green-600 transition mb-2">
              Share
            </button>
            <button
              onClick={onClose}
              className="bg-blue-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-600 transition"
            >
              Join
            </button>
          </div>
        )}
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
          ✕
        </button>
      </div>
    </div>
  );
};
function convertToIST(isoString) {
  // Create a Date object from the ISO string
  const date = new Date(isoString);

  // Options for formatting the date to "DD-MM-YYYY HH:MM:SS" in IST
  const options = {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      
      hour12: false
  };

  // Format the date to a readable IST format
  return new Intl.DateTimeFormat("en-IN", options).format(date);
}



// MySpace component
const MySpace = () => {
  const [activeTab, setActiveTab] = useState('Last Visited');
  const { user, isAuthenticated, isLoading, logout } = useKindeAuth();
  const [spaces, setSpaces] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/');
    }
    else{
      async function getSpaces(){
      const spaces= await axios.post("http://localhost:3001/getspace", {email: user.email});
      console.log(spaces.data)
      spaces.data.forEach((space)=>{
        const istdate=convertToIST(space.lastModified);
        space.lastModified=istdate;
      });
      setSpaces(spaces.data);
      }
      getSpaces();
    }
  }, [isAuthenticated, isLoading, navigate,user]);

  const handleCreateSpace = async(newSpace) => {
    const result= await axios.post("http://localhost:3001/newspace", {email: user.email,roomId:Math.floor(100000 + Math.random() * 900000), title: newSpace.title});
    const istdate=convertToIST(result.data.lastModified);
    result.data.lastModified=istdate;
    setSpaces([...spaces, result.data]);
  };
  const handleDeleteSpace = (index,space) => {
    const updatedSpaces = spaces.filter((_, i) => i !== index);
    setSpaces(updatedSpaces);
    axios.post("http://localhost:3001/deletespace", {email: user.email,roomId:space.roomId});
  };
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

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
          <img
            src={user.picture}
            alt="User Avatar"
            className="w-8 h-8 rounded-full"
          />
          <span className="text-white font-medium">{user.given_name}</span>
          <NavigationButton>
            <Globe size={20} />
            English
          </NavigationButton>
          <button
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors hover:text-white text-gray-300 hover:bg-red-400"
          >
            <LogOut size={20} />
            Logout
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="bg-[#63E2B7] text-[#242846] px-4 py-2 rounded-lg font-medium hover:bg-opacity-90 transition-colors flex items-center gap-2"
          >
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
          {spaces.map((space, index) => (
            <SpaceCard
              key={index}
              title={space.title}
              lastVisited={space.lastModified}
              image={space.image}
              onDelete={() => handleDeleteSpace(index,space)}
              onClick={() => navigate(`/myspace?spaceId=${space.roomId}`)} 
            />
          ))}
        </div>
      </main>

      {/* Modal for Creating Space */}
      {showModal && (
        <CreateSpaceModal onClose={() => setShowModal(false)} onCreate={handleCreateSpace} />
      )}
    </div>
  );
};

export default MySpace;
