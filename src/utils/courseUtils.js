// src/utils/courseUtils.js
export const getDifficultyText = (level) => {
    switch(level) {
      case 1: return '쉬움';
      case 2: return '보통';
      case 3: return '어려움';
      default: return '쉬움';
    }
  };
  
  export const getDifficultyColor = (level) => {
    switch(level) {
      case 1: return 'bg-green-100 text-gray-800';  
    case 2: return 'bg-yellow-100 text-gray-800';  
    case 3: return 'bg-red-100 text-gray-800';     
    default: return 'bg-green-100 text-gray-800';
  }
  };
  