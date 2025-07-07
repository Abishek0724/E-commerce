import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex justify-center mt-6 space-x-2">
      {pageNumbers.map((number) => (
        <button
          key={number}
          onClick={() => onPageChange(number)}
          className={`px-3 py-1 rounded-md border border-gray-300 text-sm hover:bg-blue-600 hover:text-white transition duration-200 ${
            number === currentPage
              ? "bg-blue-600 text-white font-semibold"
              : "bg-white text-gray-700"
          }`}
        >
          {number}
        </button>
      ))}
    </div>
  );
};

export default Pagination;
