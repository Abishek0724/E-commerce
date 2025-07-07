import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ApiService from "../../service/ApiService";
import ProductList from "../common/ProductList";
import Pagination from "../common/Pagination";



const CategoryProductsPage = () => {

    const { categoryId } = useParams();
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [error, setError] = useState(null);
    const itemsPerPage = 8;


    useEffect(() => {
        fetchProducts();
    }, [categoryId, currentPage]);

    const fetchProducts = async () => {
        try {

            const response = await ApiService.getAllProductsByCategoryId(categoryId);
            const allProducts = response.productList || [];
            setTotalPages(Math.ceil(allProducts.length / itemsPerPage));
            setProducts(allProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage));
        } catch (error) {
            setError(error.response?.data?.message || error.message || 'unable to fetch products by categoty id')
        }
    }


return (
  <div className="min-h-screen bg-gray-50 p-6">
    {error ? (
      <p className="text-center text-red-500 font-semibold">{error}</p>
    ) : (
      <div className="space-y-10">
        <ProductList products={products} />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>
    )}
  </div>
);

}
export default CategoryProductsPage;