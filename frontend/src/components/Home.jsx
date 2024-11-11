import { ChevronDown, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';

import {useKindeAuth} from "@kinde-oss/kinde-auth-react";


const Homepage = () => {
  const [showContent, setShowContent] = useState(false);
  const { login, register, logout} = useKindeAuth();
  
  // Fade-in animation effect
  useEffect(() => {
    setShowContent(true);
  }, []);
  
  return (
    <div className="min-h-screen bg-[#242846]">
      {/* Navigation Bar */}
      <nav className="flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <div className="flex items-center">
          <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
          </svg>
          <span className="ml-2 text-white text-xl font-semibold">Metaverse</span>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center space-x-8">
          {['Product', 'Solutions', 'Pricing', 'Resources', 'Contact Sales'].map((item, index) => (
            <div key={index} className="text-white flex items-center">
              {item} {['Product', 'Solutions', 'Resources'].includes(item) && <ChevronDown className="ml-1 w-4 h-4" />}
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="flex items-center space-x-4">
          <button  className="px-4 py-2 rounded-lg bg-[#63E2B7] text-[#242846] font-semibold hover:bg-[#50C89E] transition-colors">
            Get started
          </button>
          <button onClick={register} className="px-4 py-2 rounded-lg text-white border border-white hover:bg-white/10 transition-colors">
            Sign In
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="flex flex-col md:flex-row items-center px-6 py-16 max-w-7xl mx-auto">
        {/* Left Column */}
        <div
          className={`w-full md:w-1/2 pr-0 md:pr-8 transform transition duration-700 ${
            showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 md:mb-6">
            Your Virtual HQ
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-6 md:mb-8">
            Metaverse brings the best of in-person collaboration to distributed teams.
          </p>
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-4">
            <button className="px-6 py-3 rounded-lg bg-[#63E2B7] text-[#242846] font-semibold hover:bg-[#50C89E] transition-colors">
              Get started
            </button>
            <button onClick={logout} className="flex items-center px-6 py-3 rounded-lg text-white hover:bg-white/10 transition-colors">
              Or just login <ChevronRight className="ml-2 w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Column - Virtual Office Preview with Video */}
        <div
          className={`w-full md:w-1/2 mt-8 md:mt-0 transform transition duration-700 delay-200 ${
            showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="bg-white rounded-xl p-4 shadow-lg transform rotate-1 hover:rotate-0 transition-transform duration-500 ease-out">
            <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
              {/* Video Preview */}
              <video
                src="/video/preview.mp4" // replace with your video path
                autoPlay
                loop
                muted
                className="w-full h-full object-cover"
              ></video>
             
            </div>
          </div>
        </div>
      </div>

      {/* Language Selector */}
      <div className="fixed bottom-4 left-4">
        <button className="px-4 py-2 text-white bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
          English
        </button>
      </div>
    </div>
  );
};

export default Homepage;
