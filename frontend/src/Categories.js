import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [editedName, setEditedName] = useState("");
  const { user } = useAuth();

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/categories/`, {
        headers: {
          Authorization: `Bearer ${user.access_token}`,
        },
      });
      setCategories(response.data.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to fetch categories");
    }
  };

  const editCategory = async (categoryId, updates) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/categories/${categoryId}`,
        updates,
        {
          headers: {
            Authorization: `Bearer ${user.access_token}`,
          },
        }
      );
      alert(response.data.msg);
      fetchCategories(); // Refresh the category list
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to edit category");
    }
  };

  const deleteCategory = async (categoryId) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/categories/${categoryId}`,
        {
          headers: {
            Authorization: `Bearer ${user.access_token}`,
          },
        }
      );
      alert(response.data.msg);
      fetchCategories(); // Refresh the category list
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to delete category");
    }
  };

  const handleEditClick = (category) => {
    setEditingCategoryId(category.id);
    setEditedName(category.name); // Initialize input with current name
  };

  const handleSaveClick = () => {
    editCategory(editingCategoryId, { name: editedName });
    setEditingCategoryId(null); // Exit editing mode
  };

  const handleCancelClick = () => {
    setEditingCategoryId(null); // Exit editing mode without saving
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Categories</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {categories.length > 0 ? (
          <table className="w-full bg-white shadow-lg rounded-lg overflow-hidden">
            <thead className="bg-green-600 text-white">
              <tr>
                <th className="text-left px-6 py-4">ID</th>
                <th className="text-left px-6 py-4">Name</th>
                <th className="text-left px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr
                  key={category.id}
                  className="border-b hover:bg-gray-50 transition duration-300"
                >
                  <td className="px-6 py-4">{category.id}</td>
                  <td className="px-6 py-4">
                    {editingCategoryId === category.id ? (
                      <input
                        type="text"
                        value={editedName}
                        onChange={(e) => setEditedName(e.target.value)}
                        className="border border-gray-300 px-2 py-1 rounded"
                      />
                    ) : (
                      category.name
                    )}
                  </td>
                  <td className="px-6 py-4 flex space-x-4">
                    {editingCategoryId === category.id ? (
                      <>
                        <button
                          onClick={handleSaveClick}
                          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-300"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancelClick}
                          className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition duration-300"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEditClick(category)}
                          className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition duration-300"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteCategory(category.id)}
                          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-300"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-600 text-center">No categories available.</p>
        )}
      </div>
    </div>
  );
};

export default Categories;
