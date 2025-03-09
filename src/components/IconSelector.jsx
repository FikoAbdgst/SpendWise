import React from "react";

const IconSelector = ({ onSelectIcon, darkMode }) => {
  const icons = [
    "💰",
    "💸",
    "💵",
    "💴",
    "💶",
    "💷",
    "🏦",
    "🏧",
    "💳",
    "💎",
    "🏆",
    "🎁",
    "🎯",
    "📊",
    "📈",
    "🚀",
    "💼",
    "👨‍💼",
    "👩‍💼",
    "🏢",
    "🏠",
    "🏡",
    "🚗",
    "🏍️",
    "✈️",
    "🛥️",
    "🎮",
    "🎬",
    "🎵",
    "📱",
    "💻",
    "🖥️",
    "💝",
    "❤️",
    "🤝",
    "🎓",
  ];

  return (
    <div
      className={`p-3 rounded-lg max-h-40 overflow-y-auto grid grid-cols-8 gap-2 ${
        darkMode ? "bg-gray-700" : "bg-white border border-gray-300"
      }`}
    >
      {icons.map((icon, index) => (
        <button
          key={index}
          type="button"
          onClick={() => onSelectIcon(icon)}
          className={`text-2xl p-1 rounded hover:bg-opacity-10 ${
            darkMode ? "hover:bg-gray-600" : "hover:bg-gray-200"
          }`}
        >
          {icon}
        </button>
      ))}
    </div>
  );
};

export default IconSelector;
