import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import ApiService from "../../service/ApiService";

const OrderStatus = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED", "RETURNED"];

const AdminOrderDetailsPage = () => {
    const { itemId } = useParams();
    const [orderItems, setOrderItems] = useState([]);
    const [message, setMessage] = useState('');
    const [selectedStatus, setSelectedStatus] = useState({});

    useEffect(() => {
        fetchOrderDetails(itemId);
    }, [itemId]);

    const fetchOrderDetails = async (itemId) => {
        try {
            const response = await ApiService.getOrderItemById(itemId);
            setOrderItems(response.orderItemList);
        } catch (error) {
            console.log(error.message || error);
        }
    };

    const handleStatusChange = (orderItemId, newStatus) => {
        setSelectedStatus({ ...selectedStatus, [orderItemId]: newStatus });
    };

    const handleSubmitStatusChange = async (orderItemId) => {
        try {
            await ApiService.updateOrderitemStatus(orderItemId, selectedStatus[orderItemId]);
            setMessage('Order item status was successfully updated');
            setTimeout(() => {
                setMessage('');
            }, 3000);
        } catch (error) {
            setMessage(error.response?.data?.message || error.message || 'Unable to update order item status');
        }
    };

 return (
  <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-8">
    {message && (
      <div className="mb-4 p-4 rounded bg-green-100 text-green-800 font-medium shadow-sm">
        {message}
      </div>
    )}

    <div className="max-w-5xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Order Details</h2>

      {orderItems.length ? (
        orderItems.map((orderItem) => (
          <div
            key={orderItem.id}
            className="border border-gray-200 rounded-lg shadow-sm p-6 bg-white space-y-4"
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-700">
                Order Item ID: #{orderItem.id}
              </h3>
              <span className="text-sm font-medium text-gray-600">
                Status: <span className="font-bold text-indigo-600">{orderItem.status}</span>
              </span>
            </div>

            {/* Product */}
            <div className="flex gap-6 flex-col sm:flex-row items-start">
              <img
                src={orderItem.product.imageUrl}
                alt={orderItem.product.name}
                className="w-32 h-32 object-cover rounded"
              />
              <div className="space-y-1 text-sm text-gray-700">
                <p><strong>Name:</strong> {orderItem.product.name}</p>
                <p><strong>Description:</strong> {orderItem.product.description}</p>
                <p><strong>Price:</strong> ₹{orderItem.product.price}</p>
                <p><strong>Quantity:</strong> {orderItem.quantity}</p>
                <p><strong>Total:</strong> ₹{orderItem.price}</p>
                <p><strong>Ordered On:</strong> {new Date(orderItem.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            {/* User Info */}
            <div className="grid sm:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-md text-sm text-gray-700">
              <div><strong>User Name:</strong> {orderItem.user.name}</div>
              <div><strong>Email:</strong> {orderItem.user.email}</div>
              <div><strong>Phone:</strong> {orderItem.user.phoneNumber}</div>
              <div><strong>Role:</strong> {orderItem.user.role}</div>
              <div className="sm:col-span-2">
                <strong>Address:</strong> {orderItem.user.address?.street}, {orderItem.user.address?.city}, {orderItem.user.address?.state}, {orderItem.user.address?.country} - {orderItem.user.address?.ZipCode}
              </div>
            </div>

            {/* Status Change */}
            <div className="mt-6 space-y-2">
              <h4 className="text-sm font-semibold text-gray-700">Change Status</h4>
              <select
                className="border border-gray-300 rounded px-4 py-2 text-sm w-full sm:w-60"
                value={selectedStatus[orderItem.id] || orderItem.status}
                onChange={(e) => handleStatusChange(orderItem.id, e.target.value)}
              >
                {OrderStatus.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              <button
                onClick={() => handleSubmitStatusChange(orderItem.id)}
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition text-sm"
              >
                Update Status
              </button>
            </div>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-500">Loading order details...</p>
      )}
    </div>
  </div>
);

};

export default AdminOrderDetailsPage;
