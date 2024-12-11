import React from 'react';
import { FaCut, FaPlus } from 'react-icons/fa';

const BubbleMenu = ({ onShorten, onLengthen }) => {
  return (
    <div className="absolute bottom-1 right-8 md:right-8 lg:right-10 flex space-x-6 md:space-x-6">
      {/* Shorten Button */}
      <div className="relative group">
        <button
          onClick={onShorten}
          className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-full flex justify-center items-center shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-110"
        >
          <FaCut className="text-xl md:text-3xl" />
        </button>
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 text-white bg-gray-800 text-xs rounded-lg py-1 px-2">
          Make it Shorter
        </div>
      </div>

      {/* Lengthen Button */}
      <div className="relative group">
        <button
          onClick={onLengthen}
          className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-full flex justify-center items-center shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-110"
        >
          <FaPlus className="text-xl md:text-3xl" />
        </button>
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 text-white bg-gray-800 text-xs rounded-lg py-1 px-2">
          Make it Longer
        </div>
      </div>
    </div>
  );
};

export default BubbleMenu;
