import React from "react";
import { Link } from "react-router-dom";
import useCart from '../context/usecart'; 




const ProductList = ({products}) => {
    const {cart, dispatch} = useCart();

    const addToCart = (product) => {
        dispatch({type: 'ADD_ITEM', payload: product});
    }

    const incrementItem = (product) => {
        dispatch({type: 'INCREMENT_ITEM', payload: product});
    }

    const decrementItem = (product) => {

        const cartItem = cart.find(item => item.id === product.id);
        if (cartItem && cartItem.quantity > 1) {
            dispatch({type: 'DECREMENT_ITEM', payload: product}); 
        }else{
            dispatch({type: 'REMOVE_ITEM', payload: product}); 
        }
    }


    return (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
    {products.map((product, index) => {
      const cartItem = cart.find(item => item.id === product.id);
      return (
        <div
          key={index}
          className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center text-center hover:shadow-lg transition"
        >
          <Link to={`/product/${product.id}`} className="w-full">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-40 object-contain rounded-md mb-3"
            />
            <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
            <p className="text-sm text-gray-600">{product.description}</p>
            <span className="text-blue-600 font-bold block mt-1">₹{product.price.toFixed(2)}</span>
          </Link>

          {cartItem ? (
            <div className="mt-4 flex items-center space-x-2">
              <button
                onClick={() => decrementItem(product)}
                className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                -
              </button>
              <span className="font-semibold">{cartItem.quantity}</span>
              <button
                onClick={() => incrementItem(product)}
                className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
              >
                +
              </button>
            </div>
          ) : (
            <button
              onClick={() => addToCart(product)}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Add To Cart
            </button>
          )}
        </div>
      );
    })}
  </div>
);

};

export default ProductList;