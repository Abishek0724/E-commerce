import React from "react";
import { useNavigate } from "react-router-dom";


const AdminPage = () => {
    const navigate = useNavigate();
return (
  <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-10">
    <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-8">
      Welcome Admin
    </h1>

    <div className="grid gap-4 w-full max-w-md">
      <button
        onClick={() => navigate("/admin/categories")}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg shadow transition duration-150"
      >
        Manage Categories
      </button>

      <button
        onClick={() => navigate("/admin/products")}
        className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded-lg shadow transition duration-150"
      >
        Manage Products
      </button>

      <button
        onClick={() => navigate("/admin/orders")}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-lg shadow transition duration-150"
      >
        Manage Orders
      </button>
    </div>
  </div>
);

};

export default AdminPage;
