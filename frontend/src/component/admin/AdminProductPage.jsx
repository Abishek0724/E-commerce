import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Pagination from "../common/Pagination";
import ApiService from "../../service/ApiService";

const AdminProductPage = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [error, setError] = useState(null);
    const itemsPerPage = 10;


    const fetchProducts = async() => {
        try {
            const response = await ApiService.getAllProducts();
            const productList = response.productList || [];
            setTotalPages(Math.ceil(productList.length/itemsPerPage));
            setProducts(productList.slice((currentPage -1) * itemsPerPage, currentPage * itemsPerPage));
        } catch (error) {
            setError(error.response?.data?.message || error.message || 'unable to fetch products')
            
        }
    }

    useEffect(()=>{
        fetchProducts();
    }, [currentPage]);

    const handleEdit = async (id) => {
        navigate(`/admin/edit-product/${id}`)
    }
    const handleDelete = async(id) => {
        const confirmed = window.confirm("Are your sure you want to delete this product? ")
        if(confirmed){
            try {
                await ApiService.deleteProduct(id);
                fetchProducts();
            } catch (error) {
                setError(error.response?.data?.message || error.message || 'unable to delete product')
            }
        }
    }

    return(
       <div className="min-h-screen px-4 py-8 bg-white">
  {error ? (
    <p className="text-red-600 text-center text-lg font-medium">{error}</p>
  ) : (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Products</h2>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          onClick={() => navigate('/admin/add-product')}
        >
          Add Product
        </button>
      </div>

      <ul className="space-y-4">
        {products.map((product) => (
          <li
            key={product.id}
            className="flex items-center justify-between bg-gray-100 p-4 rounded-lg shadow"
          >
            <span className="text-gray-800 font-medium">{product.name}</span>
            <div className="flex gap-2">
              <button
                className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition"
                onClick={() => handleEdit(product.id)}
              >
                Edit
              </button>
              <button
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                onClick={() => handleDelete(product.id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-8">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>
    </div>
  )}
</div>
    );
}
export default AdminProductPage;