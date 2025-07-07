import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ApiService from "../../service/ApiService";

import Pagination from "../common/Pagination";

const ProfilePage = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    try {
      const response = await ApiService.getLoggedInUserInfo();
      setUserInfo(response.user);
    } catch (error) {
      setError(
        error.response?.data?.message || error.message || "Unable to fetch user info"
      );
    }
  };

  const handleAddressClick = () => {
    navigate(userInfo.address ? "/edit-address" : "/add-address");
  };

  const orderItemList = userInfo?.orderItemList || [];
  const totalPages = Math.ceil(orderItemList.length / itemsPerPage);
  const paginatedOrders = orderItemList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePayNow = async (orderItem) => {
    
    try {
      console.log("Initiating payment for order ID:", orderItem.id);

      const res = await axios.post(
        `http://localhost:2424/payment/create-order?amount=${orderItem.price}`,
        {},
        { headers: ApiService.getHeader() }
      );

      const { orderId, amount, currency, key } = res.data;

      const options = {
        key,
        amount,
        currency,
        order_id: orderId,
        name: "GUVI Shop",
        description: "Product Purchase",
        handler: async function (response) {
             console.log("Razorpay payment response:", response);
          try {
            await axios.post(
              "http://localhost:2424/payment/verify",
              {
                orderId: orderItem.id,
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              },
              {
                headers: ApiService.getHeader(),
              }
            );

            alert("✅ Payment Success!");
            fetchUserInfo();
          } catch (err) {
            console.error("❌ Payment verification failed:", err);
            alert("❌ Payment verification failed.");
          }
        },
        prefill: {
          name: userInfo.name,
          email: userInfo.email,
          contact: userInfo.phoneNumber,
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("❌ Payment failed:", error);
      alert("❌ Payment failed. Try again.");
    }
  };

  if (!userInfo) {
    return <div>Loading...</div>;
  }

 return (
  <div className="max-w-5xl mx-auto p-6 bg-white shadow rounded-lg mt-10">
    <h2 className="text-2xl font-bold mb-6">Welcome, {userInfo.name}</h2>

    {error ? (
      <p className="text-red-600 font-medium">{error}</p>
    ) : (
      <div className="space-y-6">
        <div className="space-y-2">
          <p><span className="font-semibold">Name:</span> {userInfo.name}</p>
          <p><span className="font-semibold">Email:</span> {userInfo.email}</p>
          <p><span className="font-semibold">Phone Number:</span> {userInfo.phoneNumber}</p>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-2">Address</h3>
          {userInfo.address ? (
            <div className="space-y-1">
              <p><span className="font-semibold">Street:</span> {userInfo.address.street}</p>
              <p><span className="font-semibold">City:</span> {userInfo.address.city}</p>
              <p><span className="font-semibold">State:</span> {userInfo.address.state}</p>
              <p><span className="font-semibold">Zip Code:</span> {userInfo.address.zipcode}</p>
              <p><span className="font-semibold">Country:</span> {userInfo.address.country}</p>
            </div>
          ) : (
            <p className="text-gray-600">No address information available</p>
          )}
          <button
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={handleAddressClick}
          >
            {userInfo.address ? "Edit Address" : "Add Address"}
          </button>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4">Order History</h3>
          <ul className="space-y-4">
            {paginatedOrders.map((order) => (
              <li
                key={order.id}
                className="flex gap-4 p-4 border rounded shadow-sm items-start"
              >
                <img
                  src={order.product?.imageUrl}
                  alt={order.product?.name}
                  className="w-24 h-24 object-cover rounded"
                />
                <div className="flex-1 space-y-1">
                  <h4 className="text-lg font-semibold">{order.product?.name}</h4>
                  <p><strong>Status:</strong> {order.status}</p>
                  <p><strong>Quantity:</strong> {order.quantity}</p>
                  <p><strong>Price:</strong> ₹{order.price.toFixed(2)}</p>
                  <p>
                    <strong>Payment Status:</strong>{" "}
                    {order.status === "CONFIRMED" ? (
                      <span className="text-green-600 font-semibold">Paid ✅</span>
                    ) : (
                      <span className="text-red-500 font-semibold">Pending ❌</span>
                    )}
                  </p>

                  {order.status !== "CONFIRMED" && (
                    <button
                      className="mt-2 px-4 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                      onClick={() => handlePayNow(order)}
                    >
                      Pay Now
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-6">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </div>
        </div>
      </div>
    )}
  </div>
);

};

export default ProfilePage;
