import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ApiService from "../../service/ApiService";

const AddressPage = () => {

    const [address, setAddress] = useState({
        street: '',
        city: '',
        state: '',
        zipcode: '',  
        country: ''
    });

    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (location.pathname === '/edit-address') {
            fetchUserInfo();
        }
    }, [location.pathname]);

    const fetchUserInfo = async () => {
        try {
            const response = await ApiService.getLoggedInUserInfo();
            if (response.user.address) {
                
                setAddress({
                    street: response.user.address.street || '',
                    city: response.user.address.city || '',
                    state: response.user.address.state || '',
                    zipcode: response.user.address.zipcode || '', 
                    country: response.user.address.country || ''
                });
            }
        } catch (error) {
            setError(error.response?.data?.message || error.message || "Unable to fetch user information");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAddress(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handSubmit = async (e) => {
        e.preventDefault();
        try {
            await ApiService.saveAddress(address);
            navigate("/profile");
        } catch (error) {
            setError(error.response?.data?.message || error.message || "Failed to save/update address");
        }
    };

   return (
  <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
    <h2 className="text-2xl font-semibold mb-6 text-center">
      {location.pathname === '/edit-address' ? 'Edit Address' : "Add Address"}
    </h2>

    {error && (
      <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
    )}

    <form onSubmit={handSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Street:
        </label>
        <input
          type="text"
          name="street"
          value={address.street}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          City:
        </label>
        <input
          type="text"
          name="city"
          value={address.city}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          State:
        </label>
        <input
          type="text"
          name="state"
          value={address.state}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Zip Code:
        </label>
        <input
          type="text"
          name="zipcode"
          value={address.zipcode}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Country:
        </label>
        <input
          type="text"
          name="country"
          value={address.country}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
      >
        {location.pathname === '/edit-address' ? 'Edit Address' : "Save Address"}
      </button>
    </form>
  </div>
);

};

export default AddressPage;
