import React, {useState} from "react";

import { NavLink, useNavigate } from "react-router-dom";
import ApiService from "../../service/ApiService";
import logo from "../../assets/react.svg"

const Navbar = () =>{

    const [searchValue, setSearchValue] = useState("");
    const navigate = useNavigate();

    const isAdmin = ApiService.isAdmin();
    const isAuthenticated = ApiService.isAuthenticated();

    const handleSearchChange =(e) => {
        setSearchValue(e.target.value);
    }

    const handleSearchSubmit = async (e) =>{
        e.preventDefault();
        navigate(`/?search=${searchValue}`)
    }

    const handleLogout = () => {
        const confirm = window.confirm("Are you sure you want to logout? ");
        if(confirm){
            ApiService.logout();
            setTimeout(()=>{
                navigate('/login')
            }, 500);
        }
    }

 
  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
      {/* Brand Logo */}
      <div className="flex items-center gap-2">
        <NavLink to="/">
          <img src={logo} alt="abi Mart" className="h-10 w-auto" />
        </NavLink>
      </div>

      {/* Search Form */}
      <form
        className="flex items-center border border-gray-300 rounded-md overflow-hidden w-full max-w-md"
        onSubmit={handleSearchSubmit}
      >
        <input
          type="text"
          placeholder="Search products"
          value={searchValue}
          onChange={handleSearchChange}
          className="px-3 py-2 w-full focus:outline-none"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 hover:bg-blue-700 transition"
        >
          Search
        </button>
      </form>

      {/* Navigation Links */}
      <div className="flex flex-wrap gap-4 text-sm md:text-base items-center">
        <NavLink to="/" className="hover:text-blue-600 transition">Home</NavLink>
       {isAdmin && (
  <NavLink to="/categories" className="hover:text-blue-600 transition">
    Categories
  </NavLink>
)}
        {isAuthenticated && (
          <NavLink to="/profile" className="hover:text-blue-600 transition">My Account</NavLink>
        )}
        {isAdmin && (
          <NavLink to="/admin" className="hover:text-blue-600 transition">Admin</NavLink>
        )}
        {!isAuthenticated && (
          <NavLink to="/login" className="hover:text-blue-600 transition">Login</NavLink>
        )}
        {isAuthenticated && (
          <button onClick={handleLogout} className="hover:text-blue-600 transition">
            Logout
          </button>
        )}
        <NavLink to="/cart" className="hover:text-blue-600 transition">Cart</NavLink>
      </div>
    </nav>
  );
};
export default Navbar;