import React, {useEffect, useState} from "react";
import { useLocation } from "react-router-dom";
import ProductList from "../common/ProductList";
import Pagination from "../common/Pagination";
import ApiService from "../../service/ApiService";
import Banner from "../common/Banner";



const Home = () => {
    const location = useLocation();
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [error, setError] = useState(null);
    const itemsPerPage = 10;

    useEffect(()=> {

        const fetchProducts = async () => {
            try{
                let allProducts = [];
                const queryparams = new URLSearchParams(location.search);
                const searchItem = queryparams.get('search')

                if (searchItem) {
                    const response = await ApiService.searchProducts(searchItem);
                    allProducts = response.productList || [];
                }else{
                    const response = await ApiService.getAllProducts();
                    allProducts = response.productList || [];

                }

                setTotalPages(Math.ceil(allProducts.length/itemsPerPage));
                setProducts(allProducts.slice((currentPage -1) * itemsPerPage, currentPage * itemsPerPage));
               
            }catch(error){
                setError(error.response?.data?.message || error.message || 'unable to fetch products')
            }
        }

        fetchProducts();

    },[location.search, currentPage])


   return (
      <div className="p-4">
    <Banner />
  <div className="min-h-screen bg-white p-6">
    {error ? (
      <p className="text-center text-red-600 font-medium">{error}</p>
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
  </div>
);



}

export default Home;