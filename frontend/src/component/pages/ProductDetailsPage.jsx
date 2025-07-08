/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ApiService from "../../service/ApiService";
import { CartContext } from "../context/CartContext";

const ProductDetailsPage = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [addedToCart, setAddedToCart] = useState(false);
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      const data = await ApiService.getProductById(productId);
      setProduct(data.product);
    };

    fetchProduct();
  }, [productId]);

  const handleAddToCart = () => {
    addToCart(product);
    setAddedToCart(true); 
  };

  const handleBuyNow = async () => {
    try {
      const res = await ApiService.createRazorpayOrder(product.price);
      const { orderId, amount, currency, key } = res;

      const options = {
        key,
        amount,
        currency,
        order_id: orderId,
        name: "ABI Mart",
        description: product.name,
        handler: async function (response) {
          try {
            await ApiService.verifyRazorpayPayment({
              orderId: product.id,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });
            alert("Payment Successful");
          } catch (err) {
            alert(" Payment verification failed");
          }
        },
        prefill: {
          name: "User",
          email: "user@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Payment error:", err);
      alert("Payment Failed");
    }
  };

  if (!product) return <div>Loading...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto mt-10 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-4">{product.name}</h1>
      <img
        src={product.imageUrl}
        alt={product.name}
        className="w-full max-w-sm mb-4"
      />
      <p className="mb-2 text-lg">₹{product.price}</p>
      <p className="mb-6">{product.description}</p>

      <div className="flex gap-4">
        <button
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          onClick={handleAddToCart}
        >
          Add to Cart
        </button>

        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={handleBuyNow}
        >
          Buy Now
        </button>

        {addedToCart && (
          <button
            className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900"
            onClick={() => navigate("/cart")}
          >
            View Cart
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductDetailsPage;
