import React from "react";
import { NavLink } from "react-router-dom";

const Footer = () => {

  return (
    <footer className="bg-gray-900 text-white py-6 px-4 mt-auto">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
        <ul className="flex flex-wrap gap-4 text-sm md:text-base">
          <li><NavLink to="/" className="hover:text-blue-400 transition">About Us</NavLink></li>
          <li><NavLink to="/" className="hover:text-blue-400 transition">Contact Us</NavLink></li>
          <li><NavLink to="/" className="hover:text-blue-400 transition">Terms & Conditions</NavLink></li>
          <li><NavLink to="/" className="hover:text-blue-400 transition">Privacy Policy</NavLink></li>
          <li><NavLink to="/" className="hover:text-blue-400 transition">FAQs</NavLink></li>
        </ul>
        <div className="mt-4 md:mt-0 text-xs md:text-sm text-gray-400 text-center">
          &copy; 2024 abishek. All rights reserved.
        </div>
      </div>
    </footer>
  );

}
export default Footer;