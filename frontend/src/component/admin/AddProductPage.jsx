import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import ApiService from "../../service/ApiService";

const AddProductPage = () => {
    const [image, setImage] = useState(null);
    const [categories, setCategories] = useState([]);
    const [categoryId, setCategoryId] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [message, setMessage] = useState('');
    const [price, setPrice] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        ApiService.getAllCategory()
            .then((res) => setCategories(res.categoryList))
            .catch((err) => console.error("Failed to fetch categories", err));
    }, []);

    const handleImage = (e) => {
        setImage(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('image', image);
            formData.append('categoryId', categoryId);
            formData.append('name', name);
            formData.append('description', description);
            formData.append('price', price);

            const response = await ApiService.addProduct(formData);
            if (response.status === 200) {
                setMessage("Product added successfully!");
                setTimeout(() => {
                    setMessage('');
                    navigate('/admin/products');
                }, 3000);
            }
        } catch (error) {
            setMessage(error.response?.data?.message || error.message || 'Unable to upload product');
        }
    };

return (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
    <form 
      onSubmit={handleSubmit} 
      className="w-full max-w-2xl bg-white p-8 rounded-xl shadow-md space-y-6"
    >
      <h2 className="text-2xl font-semibold text-gray-800 text-center">Add Product</h2>

      {message && (
        <div
          className={`text-center p-3 rounded-md text-sm font-medium ${
            message.toLowerCase().includes("success")
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message}
        </div>
      )}

      {/* Product Image */}
      <div className="flex flex-col gap-1">
        <label className="font-medium text-gray-700">Product Image</label>
        <input 
          type="file" 
          onChange={handleImage} 
          className="border border-gray-300 rounded px-3 py-2" 
        />
      </div>

      {/* Category */}
      <div className="flex flex-col gap-1">
        <label className="font-medium text-gray-700">Category</label>
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2"
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option value={cat.id} key={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Product Name */}
      <div className="flex flex-col gap-1">
        <label className="font-medium text-gray-700">Product Name</label>
        <input
          type="text"
          placeholder="Product name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2"
        />
      </div>

      {/* Description */}
      <div className="flex flex-col gap-1">
        <label className="font-medium text-gray-700">Description</label>
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2"
          rows={4}
        />
      </div>

      {/* Price */}
      <div className="flex flex-col gap-1">
        <label className="font-medium text-gray-700">Price</label>
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full py-3 rounded bg-primary text-white hover:bg-primary-dark transition"
      >
        Add Product
      </button>
    </form>
  </div>
);
};
export default AddProductPage;
