import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../../service/ApiService";


const CategoryListPage = () => {
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCategories();
    }, []);




    const fetchCategories = async () => {
        try {
            const response = await ApiService.getAllCategory();
            setCategories(response.categoryList || [])

        } catch (err) {

            setError(err.response?.data?.message || err.message || 'Unable to fetch categories')

        }
    }

    const handleCategoryClick = (categoryId) => {
        navigate(`/category/${categoryId}`);
    } 

    return (
  <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
    {error ? (
      <p className="text-center text-red-500 font-medium">{error}</p>
    ) : (
      <div>
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Categories</h2>
        <ul className="space-y-3">
          {categories.map((category) => (
            <li key={category.id}>
              <button
                onClick={() => handleCategoryClick(category.id)}
                className="w-full text-left px-4 py-2 bg-blue-100 text-blue-800 rounded hover:bg-blue-200 transition"
              >
                {category.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
    )}
  </div>
);

}

export default CategoryListPage;