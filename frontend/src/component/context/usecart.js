// src/context/useCart.js
import { useContext } from "react";
import { CartContext } from "./CartContext";

// Custom hook to use cart context
const useCart = () => useContext(CartContext);

export default useCart;
