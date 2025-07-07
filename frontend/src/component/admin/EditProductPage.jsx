import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import ApiService from "../../service/ApiService";


const EditProductPage = () => {
    const {productId} = useParams();
    const [image, setImage] = useState(null);
    const [categories, setCategories] = useState([]);
    const [categoryId, setCategoryId] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [message, setMessage] = useState('');
    const [price, setPrice] = useState('');
    const [imageUrl, setImageUrl] = useState(null);
    const navigate = useNavigate();

    useEffect(()=>{
        ApiService.getAllCategory().then((res) => setCategories(res.categoryList));

        if (productId) {
            ApiService.getProductById(productId).then((response)=>{
                setName(response.product.name);
                setDescription(response.product.description);
                setPrice(response.product.price);
                setCategoryId(response.product.categoryId);
                setImageUrl(response.product.imageUrl);
            })
        }
    }, [productId]);

    const handleImageChange = (e) =>{
        setImage(e.target.files[0]);
        setImageUrl(URL.createObjectURL(e.target.files[0]));
    };

    
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            if(image){
                formData.append('image', image);
            }
            formData.append('productId', productId);
            formData.append('categoryId', categoryId);
            formData.append('name', name);
            formData.append('description', description);
            formData.append('price', price);

            const response = await ApiService.updateProduct(formData);
            if (response.status === 200) {
                setMessage(response.message)
                setTimeout(() => {
                    setMessage('')
                    navigate('/admin/products')
                }, 3000);
            }

        } catch (error) {
            setMessage(error.response?.data?.message || error.message || 'unable to update product')
        }
    }

 return (
  <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-lg bg-white p-6 rounded-lg shadow-lg space-y-4"
    >
      <h2 className="text-2xl font-semibold text-center text-gray-800">Edit Product</h2>

      {message && (
        <div
          className={`text-sm text-center font-medium ${
            message.toLowerCase().includes("success")
              ? "text-green-600"
              : "text-red-600"
          }`}
        >
          {message}
        </div>
      )}

      <div>
        <label className="block mb-1 text-gray-700">Product Image</label>
        <input
          type="file"
          onChange={handleImageChange}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
        />
        {imageUrl && (
          <img
            src={imageUrl}
            alt={name}
            className="mt-2 h-32 w-32 object-cover rounded border"
          />
        )}
      </div>

      <div>
        <label className="block mb-1 text-gray-700">Category</label>
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option value={cat.id} key={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block mb-1 text-gray-700">Product Name</label>
        <input
          type="text"
          placeholder="Product name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="block mb-1 text-gray-700">Description</label>
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="block mb-1 text-gray-700">Price</label>
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
      >
        Update Product
      </button>
    </form>
  </div>
);

}

export default EditProductPage;