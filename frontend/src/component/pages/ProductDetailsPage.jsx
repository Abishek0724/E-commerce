import React, {useEffect, useState} from "react";
import { useParams } from "react-router-dom";
import  useCart  from "../context/usecart";
import ApiService from "../../service/ApiService";


const ProductDetailsPage = () => {

    const {productId} = useParams();
    const {cart, dispatch} = useCart();
    const [product, setProduct] = useState(null);

    useEffect(()=>{
        fetchProduct();
    }, [productId])

    const fetchProduct = async () => {
        try {
            const response = await ApiService.getProductById(productId);
            setProduct(response.product);
            
        } catch (error) {
            console.log(error.message || error)
        }
    }

    
    const addToCart = () => {
        if (product) {
            dispatch({type: 'ADD_ITEM', payload: product});   
        }
    }

    const incrementItem = () => {
        if(product){
            dispatch({type: 'INCREMENT_ITEM', payload: product});
 
        }
    }

    const decrementItem = () => {
        if (product) {
            const cartItem = cart.find(item => item.id === product.id);
            if (cartItem && cartItem.quantity > 1) {
                dispatch({type: 'DECREMENT_ITEM', payload: product}); 
            }else{
                dispatch({type: 'REMOVE_ITEM', payload: product}); 
            }
            
        }
    }

    if (!product) {
        return <p>Loading product details ...</p>
    }

    const cartItem = cart.find(item => item.id === product.id);

return (
  <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
    <img
      src={product?.imageUrl}
      alt={product?.name}
      className="w-full h-48 object-contain rounded-md mb-6"
    />
    <h1 className="text-3xl font-semibold mb-2">{product?.name}</h1>
    <p className="text-gray-700 mb-4">{product?.description}</p>
    <span className="text-xl font-bold text-green-600 block mb-6">
      ₹{product?.price.toFixed(2)}
    </span>

    {cartItem ? (
      <div className="flex items-center gap-4">
        <button
          onClick={decrementItem}
          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
        >
          -
        </button>
        <span className="font-medium text-lg">{cartItem.quantity}</span>
        <button
          onClick={incrementItem}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          +
        </button>
      </div>
    ) : (
      <button
        onClick={addToCart}
        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Add To Cart
      </button>
    )}
  </div>
);


}

export default ProductDetailsPage;