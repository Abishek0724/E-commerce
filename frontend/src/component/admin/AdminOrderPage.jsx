import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import Pagination from "../common/Pagination";
import ApiService from "../../service/ApiService";

const OrderStatus = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED", "RETURNED"];

const AdminOrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [statusFilter, setStatusFilter] = useState('');
    const [searchStatus, setSearchStatus] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [error, setError] = useState(null);
    const itemsPerPage = 10;

    const navigate = useNavigate();

    const fetchOrders = useCallback(async () => {
        try {
            let response;
            if (searchStatus) {
                response = await ApiService.getAllOrderItemsByStatus(searchStatus);
            } else {
                response = await ApiService.getAllOrders();
            }
            const orderList = response.orderItemList || [];

            setTotalPages(Math.ceil(orderList.length / itemsPerPage));
            setOrders(orderList);
            setFilteredOrders(
                orderList.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
            );
        } catch (error) {
            setError(error.response?.data?.message || error.message || 'Unable to fetch orders');
            setTimeout(() => setError(''), 3000);
        }
    }, [searchStatus, currentPage, itemsPerPage]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const handleFilterChange = (e) => {
        const filterValue = e.target.value;
        setStatusFilter(filterValue);
        setCurrentPage(1);

        if (filterValue) {
            const filtered = orders.filter(order => order.status === filterValue);
            setFilteredOrders(filtered.slice(0, itemsPerPage));
            setTotalPages(Math.ceil(filtered.length / itemsPerPage));
        } else {
            setFilteredOrders(orders.slice(0, itemsPerPage));
            setTotalPages(Math.ceil(orders.length / itemsPerPage));
        }
    };

    const handleSearchStatusChange = (e) => {
        setSearchStatus(e.target.value);
        setCurrentPage(1);
    };

    const handleOrderDetails = (id) => {
        navigate(`/admin/order-details/${id}`);
    };

    return (
  <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-8">
    {/* Header */}
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
      <h2 className="text-2xl font-bold text-gray-800">Orders Management</h2>
      {error && (
        <div className="mt-2 sm:mt-0 text-sm text-red-600 bg-red-100 border border-red-300 px-4 py-2 rounded">
          {error}
        </div>
      )}
    </div>

    {/* Filters */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
      <div>
        <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700 mb-1">
          Filter By Status
        </label>
        <select
          id="statusFilter"
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={statusFilter}
          onChange={handleFilterChange}
        >
          <option value="">All</option>
          {OrderStatus.map((status) => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="searchStatus" className="block text-sm font-medium text-gray-700 mb-1">
          Search By Status
        </label>
        <select
          id="searchStatus"
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={searchStatus}
          onChange={handleSearchStatusChange}
        >
          <option value="">All</option>
          {OrderStatus.map((status) => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
      </div>
    </div>

    {/* Orders Table */}
    <div className="overflow-x-auto bg-white border border-gray-200 rounded-lg shadow-sm">
      <table className="min-w-full text-sm text-left text-gray-700">
        <thead className="bg-gray-100 border-b">
          <tr>
            <th className="px-4 py-3 font-medium">Order ID</th>
            <th className="px-4 py-3 font-medium">Customer</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Price</th>
            <th className="px-4 py-3 font-medium">Date Ordered</th>
            <th className="px-4 py-3 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map((order) => (
            <tr key={order.id} className="border-b hover:bg-gray-50">
              <td className="px-4 py-3">{order.id}</td>
              <td className="px-4 py-3">{order.user?.name || "N/A"}</td>
              <td className="px-4 py-3">{order.status}</td>
              <td className="px-4 py-3">₹{order.price?.toFixed(2)}</td>
              <td className="px-4 py-3">{new Date(order.createdAt).toLocaleDateString()}</td>
              <td className="px-4 py-3">
                <button
                  onClick={() => handleOrderDetails(order.id)}
                  className="text-indigo-600 hover:text-indigo-800 font-medium transition duration-150"
                >
                  Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    {/* Pagination */}
    <div className="mt-6">
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  </div>
);

};

export default AdminOrdersPage;
