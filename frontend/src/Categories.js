import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000";

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState(null);
  
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${API_URL}/categories/`);
        setCategories(response.data.data);
      } catch (err) {
        setError(err.response?.data?.msg || "Failed to fetch categories");
      }
    };
  
    const editCategory = async (categoryId, updates) => {
      try {
        const response = await axios.put(`${API_URL}/categories/${categoryId}`, updates);
        alert(response.data.msg);
        fetchCategories(); // Refresh the category list
      } catch (err) {
        setError(err.response?.data?.msg || "Failed to edit category");
      }
    };
  
    const deleteCategory = async (categoryId) => {
      try {
        const response = await axios.delete(`${API_URL}/categories/${categoryId}`);
        alert(response.data.msg);
        fetchCategories(); // Refresh the category list
      } catch (err) {
        setError(err.response?.data?.msg || "Failed to delete category");
      }
    };
  
    useEffect(() => {
      fetchCategories();
    }, []);
  
    return (
      <div>
        <h2>Categories</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <ul>
          {categories.map((category) => (
            <li key={category.id}>
              {category.name}
              <button onClick={() => editCategory(category.id, { name: "Updated Category" })}>Edit</button>
              <button onClick={() => deleteCategory(category.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  export default Categories;