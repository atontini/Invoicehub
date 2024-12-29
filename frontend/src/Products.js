import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

const Products = () => {
  const [products, setProducts] = useState([]);
  const { user } = useAuth();

  const editProduct = async (productId, updates) => {
    try {
      const response = await axios.put(`http://localhost:5000/products/${productId}`, updates);
    } catch (error) {
      console.error("Failed to edit product: ", error);
    }
  };

  const deleteProduct = async (productId) => {
    try {
      const response = await axios.delete(`$http://localhost:5000/products/${productId}`);
    } catch (error) {
      console.error("Failed to delete product: ", error);
    }
  };
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/products/`, {
          headers: {
            Authorization: `Bearer ${user.access_token}`,
          },
        });

        console.log("Fetched data:", response.data.data);
        setProducts(response.data.data); // Update state with fetched data
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };


    // Invoke the fetchProducts function
    fetchProducts();
  }, []); // Empty dependency array ensures this runs only once

  return (
    <div>
      <h2>Products</h2>
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            {product.name}
            {/*<button onClick={() => editProduct(product.id, { name: "Updated Name" })}>Edit</button>*/}

            {/*delete button not working*/}
            <button onClick={() => deleteProduct(product.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Products;
