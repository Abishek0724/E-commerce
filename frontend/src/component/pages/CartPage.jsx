import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../../service/ApiService";
import useCart from "../context/usecart";


const CartPage = () => {
    const { cart, dispatch } = useCart();
    const [message, setMessage] = useState(null);
    const navigate = useNavigate();


    const incrementItem = (product) => {
        dispatch({ type: 'INCREMENT_ITEM', payload: product });
    }

    const decrementItem = (product) => {

        const cartItem = cart.find(item => item.id === product.id);
        if (cartItem && cartItem.quantity > 1) {
            dispatch({ type: 'DECREMENT_ITEM', payload: product });
        } else {
            dispatch({ type: 'REMOVE_ITEM', payload: product });
        }
    }

    const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);



    const handleCheckout = async () => {
        if (!ApiService.isAuthenticated()) {
            setMessage("You need to login first before you can place an order");
            setTimeout(() => {
                setMessage('')
                navigate("/login")
            }, 3000);
            return;
        }

        const orderItems = cart.map(item => ({
            productId: item.id,
            quantity: item.quantity
        }));

        const orderRequest = {
            totalPrice,
            items: orderItems,
        }

        try {
            const response = await ApiService.createOrder(orderRequest);
            setMessage(response.message)

            setTimeout(() => {
                setMessage('')
            }, 5000);

            if (response.status === 200) {
                dispatch({ type: 'CLEAR_CART' })
            }

        } catch (error) {
            setMessage(error.response?.data?.message || error.message || 'Failed to place an order');
            setTimeout(() => {
                setMessage('')
            }, 3000);

        }

    };

return (
  <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
    <h1 className="text-3xl font-bold mb-6 text-center">Cart</h1>

    {message && (
      <p className="text-center text-sm mb-4 text-green-600 font-medium">{message}</p>
    )}

    {cart.length === 0 ? (
      <p className="text-center text-gray-600">Your cart is empty</p>
    ) : (
      <div className="space-y-6">
        <ul className="divide-y divide-gray-200">
          {cart.map((item) => (
            <li key={item.id} className="flex items-start space-x-4 py-4">
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-24 h-24 object-cover rounded"
              />
              <div className="flex-1">
                <h2 className="text-xl font-semibold">{item.name}</h2>
                <p className="text-sm text-gray-500 mb-2">{item.description}</p>

                <div className="flex items-center space-x-3 mb-2">
                  <button
                    onClick={() => decrementItem(item)}
                    className="px-2 py-1 border rounded hover:bg-gray-200"
                  >
                    -
                  </button>
                  <span className="text-md font-medium">{item.quantity}</span>
                  <button
                    onClick={() => incrementItem(item)}
                    className="px-2 py-1 border rounded hover:bg-gray-200"
                  >
                    +
                  </button>
                </div>
                <span className="text-lg font-semibold text-gray-800">
                  ₹{item.price.toFixed(2)}
                </span>
              </div>
            </li>
          ))}
        </ul>

        <h2 className="text-2xl font-semibold text-right">Total: ₹{totalPrice.toFixed(2)}</h2>

        <div className="text-right">
          <button
            onClick={handleCheckout}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
          >
            Checkout
          </button>
        </div>
      </div>
    )}
  </div>
);

}

export default CartPage;