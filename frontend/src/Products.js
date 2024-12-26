import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/products`);
      setProducts(response.data.data);
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to fetch products");
    }
  };

  const editProduct = async (productId, updates) => {
    try {
      const response = await axios.put(`${API_URL}/products/${productId}`, updates);
      alert(response.data.msg);
      fetchProducts(); // Refresh the product list
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to edit product");
    }
  };

  const deleteProduct = async (productId) => {
    try {
      const response = await axios.delete(`${API_URL}/products/${productId}`);
      alert(response.data.msg);
      fetchProducts(); // Refresh the product list
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to delete product");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div>
      <h2>Products</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            {product.name}
            <button onClick={() => editProduct(product.id, { name: "Updated Name" })}>Edit</button>
            <button onClick={() => deleteProduct(product.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Products;