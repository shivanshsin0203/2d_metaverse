import { useState, useEffect } from "react";
import {
  Calendar,
  Users,
  Globe,
  Search,
  Plus,
  LogOut,
  DeleteIcon,
  Menu,
  X,
} from "lucide-react";
import PropTypes from "prop-types";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Loading from "./Loading";

// NavigationButton component
const NavigationButton = ({ children, isActive = false, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
      isActive ? "bg-[#464B6B] text-white" : "text-gray-300 hover:bg-[#464B6B]"
    }`}
  >
    {children}
  </button>
);
NavigationButton.propTypes = {
  children: PropTypes.node.isRequired,
  isActive: PropTypes.bool,
  onClick: PropTypes.func,
};

// SpaceCard component
const SpaceCard = ({ title, lastVisited, onDelete, onClick }) => {
  const handleDelete = (event) => {
    event.stopPropagation();
    onDelete();
  };
  return (
    <div 
      className="relative group cursor-pointer" 
      onClick={onClick}
    >
      <div className="absolute top-3 left-3 bg-black/50 text-white px-2 py-1 rounded-full text-sm flex items-center gap-1">
        <div className="w-2 h-2 bg-green-400 rounded-full"></div>0
      </div>
      <div className="relative overflow-hidden rounded-lg group-hover:ring-2 ring-[#63E2B7] transition-all pb-10">
        <img
          src="https://i.ytimg.com/vi/60zpPbY1DLA/maxresdefault.jpg"
          alt={title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 p-3 flex justify-between items-center">
          <span className="text-white font-medium truncate max-w-[60%]">{title}</span>
          <div className="flex items-center gap-2">
            <span className="text-gray-300 text-sm truncate max-w-[100px]">{lastVisited}</span>
            <button
              onClick={handleDelete}
              className="text-white hover:bg-white/20 p-1 rounded"
            >
              <DeleteIcon size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
SpaceCard.propTypes = {
  title: PropTypes.string.isRequired,
  lastVisited: PropTypes.string.isRequired,
  onDelete: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
};

// CreateSpaceModal component
const CreateSpaceModal = ({ onClose, onCreate }) => {
  const [title, setTitle] = useState("");
  const [name, setName] = useState("");
  const [isCreated, setIsCreated] = useState(false);

  const handleCreate = () => {
    if (title && name) {
      setIsCreated(true);
      onCreate({
        title,
        lastVisited: "Just now",
        image: "/api/placeholder/400/300",
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
        {!isCreated ? (
          <>
            <h2 className="text-xl font-semibold mb-4">Create Space</h2>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
              className="w-full mb-4 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Name"
              className="w-full mb-4 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleCreate}
              className="w-full bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600 transition"
              disabled={!title || !name}
            >
              Create
            </button>
          </>
        ) : (
          <div className="text-center space-y-3">
            <p className="text-lg font-semibold mb-4">Space Created!</p>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <button className="bg-green-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-green-600 transition">
                Share
              </button>
              <button
                onClick={onClose}
                className="bg-blue-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-600 transition"
              >
                Join
              </button>
            </div>
          </div>
        )}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>
      </div>
    </div>
  );
};
CreateSpaceModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onCreate: PropTypes.func.isRequired,
};

// Utility function to convert to IST
function convertToIST(isoString) {
  const date = new Date(isoString);
  const options = {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour12: false,
  };
  return new Intl.DateTimeFormat("en-IN", options).format(date);
}

// MySpace component
const MySpace = () => {
  const [activeTab, setActiveTab] = useState("Last Visited");
  const { user, isAuthenticated, isLoading, logout } = useKindeAuth();
  const [spaces, setSpaces] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      console.log("User not authenticated. Redirecting to login page...");
      navigate("/");
    } else {
      async function getSpaces() {
        try {
          const spaces = await axios.post("http://localhost:3001/getspace", {
            email: user.email,
          });
          spaces.data.forEach((space) => {
            const istdate = convertToIST(space.lastModified);
            space.lastModified = istdate;
          });
          setSpaces(spaces.data);
        } catch (error) {
          console.error("Error fetching spaces:", error);
        }
      }
      getSpaces();
    }
  }, [isAuthenticated, isLoading, navigate, user]);

  const handleCreateSpace = async (newSpace) => {
    try {
      const result = await axios.post("http://localhost:3001/newspace", {
        email: user.email,
        roomId: Math.floor(100000 + Math.random() * 900000),
        title: newSpace.title,
      });
      const istdate = convertToIST(result.data.lastModified);
      result.data.lastModified = istdate;
      setSpaces([...spaces, result.data]);
    } catch (error) {
      console.error("Error creating space:", error);
    }
  };

  const handleDeleteSpace = (index, space) => {
    const updatedSpaces = spaces.filter((_, i) => i !== index);
    setSpaces(updatedSpaces);
    axios.post("http://localhost:3001/deletespace", {
      email: user.email,
      roomId: space.roomId,
    });
  };

  if (isLoading) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#242846]">
      {/* Navigation Bar */}
      <nav className="flex items-center justify-between px-4 py-4 border-b border-gray-700">
        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center justify-between w-full">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <img
              src="https://cdn-icons-png.flaticon.com/512/3054/3054881.png"
              alt="Gather Logo"
              className="w-8 h-8"
            />
          </div>
          <div className="flex items-center gap-4">
            <img
              src={user.picture}
              alt="User Avatar"
              className="w-8 h-8 rounded-full"
            />
            <button
              onClick={() => setShowModal(true)}
              className="bg-[#63E2B7] text-[#242846] px-3 py-2 rounded-lg font-medium text-sm flex items-center gap-1"
            >
              <Plus size={16} />
              Create
            </button>
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center justify-between w-full">
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
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-[#242846] z-50 border-t border-gray-700">
            <div className="flex flex-col">
              <NavigationButton>
                <Calendar size={20} />
                Events
              </NavigationButton>
              <NavigationButton isActive>
                <Users size={20} />
                My Spaces
              </NavigationButton>
              <NavigationButton>
                <Globe size={20} />
                English
              </NavigationButton>
              <button
                onClick={logout}
                className="flex items-center gap-2 px-4 py-3 text-gray-300 hover:bg-[#464B6B] transition-colors"
              >
                <LogOut size={20} />
                Logout
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="px-4 py-6 md:px-6 md:py-8">
        {/* Tabs and Search */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
          <div className="flex gap-4 w-full md:w-auto">
            {["Last Visited", "Created Spaces"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 md:flex-none px-4 py-2 rounded-lg transition-colors ${
                  activeTab === tab
                    ? "bg-[#464B6B] text-white"
                    : "text-gray-300 hover:bg-[#464B6B]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="relative w-full md:w-auto">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search"
              className="w-full md:w-auto bg-[#464B6B] text-white pl-10 pr-4 py-2 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#63E2B7]"
            />
          </div>
        </div>

        {/* Spaces Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {spaces.map((space, index) => (
            <SpaceCard
              key={index}
              title={space.title}
              lastVisited={space.lastModified}
              onDelete={() => handleDeleteSpace(index, space)}
              onClick={() => navigate(`/myspace?spaceId=${space.roomId}`)}
            />
          ))}
        </div>
      </main>

      {/* Modal for Creating Space */}
      {showModal && (
        <CreateSpaceModal
          onClose={() => setShowModal(false)}
          onCreate={handleCreateSpace}
        />
      )}
    </div>
  );
};

export default MySpace;