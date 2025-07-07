import React from "react";

const Banner = () => {
  return (
    <div className="relative bg-gradient-to-r from-purple-500 to-pink-500 text-white py-6 px-4 rounded-lg shadow-md mb-6">
      <h2 className="text-3xl font-bold mb-2">🎉 Big Sale is Live!</h2>
      <p className="text-lg">Up to 50% OFF on Electronics & Fashion!</p>
      <button className="mt-4 bg-white text-purple-700 font-semibold px-4 py-2 rounded shadow hover:bg-gray-100">
        Shop Now
      </button>
    </div>
  );
};

export default Banner;
