/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import ApiService from "../../service/ApiService";
import { useNavigate } from "react-router-dom";

const AdminCategoryPage = () => {
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await ApiService.getAllCategory();
            setCategories(response.categoryList || []);
        } catch (error) {
            console.log("Error fetching category list", error);
        }
    };

    const handleEdit = (id) => {
        navigate(`/admin/edit-category/${id}`);
    };

    const handleDelete = async (id) => {
        const confirmed = window.confirm("Are you sure you want to delete this category?");
        if (confirmed) {
            try {
                await ApiService.deleteCategory(id);
                fetchCategories();
            } catch (error) {
                console.log("Error deleting category by id");
            }
        }
    };

  return (
  <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-8">
    <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">Categories</h2>
        <button
          className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded transition"
          onClick={() => navigate('/admin/add-category')}
        >
          Add Category
        </button>
      </div>

      {/* No categories case */}
      {categories.length === 0 ? (
        <p className="text-gray-500 text-center">No categories found.</p>
      ) : (
        <div className="space-y-4">
          {categories.map((category) => (
            <div
              key={category.id}
              className="flex items-center justify-between border border-gray-200 rounded px-4 py-3 hover:shadow-sm transition"
            >
              <span className="text-gray-700 font-medium">{category.name}</span>
              <div className="flex gap-3">
                <button
                  className="px-3 py-1 text-sm bg-yellow-400 hover:bg-yellow-500 text-white rounded"
                  onClick={() => handleEdit(category.id)}
                >
                  Edit
                </button>
                <button
                  className="px-3 py-1 text-sm bg-red-500 hover:bg-red-600 text-white rounded"
                  onClick={() => handleDelete(category.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
);
};
export default AdminCategoryPage;
