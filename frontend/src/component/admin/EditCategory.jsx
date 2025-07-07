import React, { useState, useEffect } from "react";
import ApiService from "../../service/ApiService";
import { useNavigate, useParams } from "react-router-dom";


const EditCategory = () => {
    const { categoryId } = useParams();
    const [name, setName] = useState('')
    const [message, setMessage] = useState('');
    const navigate = useNavigate();


    useEffect(() => {
        fetchCategory(categoryId);
    }, [categoryId])

    const fetchCategory = async () => {
        try {
            const response = await ApiService.getCategoryById(categoryId);
            setName(response.category.name);

        } catch (error) {
            setMessage(error.response?.data?.message || error.message || "Failed to get a category by id")
            setTimeout(() => {
                setMessage('');
            }, 3000)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await ApiService.updateCategory(categoryId, { name });
            if (response.status === 200) {
                setMessage(response.message);
                setTimeout(() => {
                    setMessage('');
                    navigate("/admin/categories")
                }, 3000)
            }
        } catch (error) {
            setMessage(error.response?.data?.message || error.message || "Failed to save a category")
        }
    }

return (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
    <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
      {message && (
        <p
          className={`mb-4 text-center text-sm font-medium ${
            message.toLowerCase().includes('success')
              ? 'text-green-600'
              : 'text-red-600'
          }`}
        >
          {message}
        </p>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-2xl font-semibold text-center text-gray-800">
          Edit Category
        </h2>
        <input
          type="text"
          placeholder="Category Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Update
        </button>
      </form>
    </div>
  </div>
);

}

export default EditCategory;