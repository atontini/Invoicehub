import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

const Products = () => {
  const [products, setProducts] = useState([]);
  const { user } = useAuth();
  const [editingProductId, setEditingProductId] = useState(null);
  const [editedName, setEditedName] = useState("");

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/products/`, {
        headers: {
          Authorization: `Bearer ${user.access_token}`,
        },
      });
      setProducts(response.data.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const editProduct = async (productId, updates) => {
    try {
      await axios.put(`http://localhost:5000/products/${productId}`, updates, {
        headers: {
          Authorization: `Bearer ${user.access_token}`,
        },
      });
      fetchProducts();
    } catch (error) {
      console.error("Failed to edit product: ", error);
    }
  };

  const deleteProduct = async (productId) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/products/${productId}`, {
          headers: {
            Authorization: `Bearer ${user.access_token}`,
          },  
      });
      //setProducts(products.filter((product) => product.id !== productId));
      alert(response.data.msg);
      fetchProducts();
    } catch (error) {
      console.error("Failed to delete product: ", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [user.access_token]);

  const handleEditClick = (product) => {
    setEditingProductId(product.id);
    setEditedName(product.name);
  };

  const handleSaveClick = () => {
    editProduct(editingProductId, { name: editedName });
    setEditingProductId(null); // Exit editing mode
  };

  const handleCancelClick = () => {
    setEditingProductId(null); // Exit editing mode without saving
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Products</h2>
        {products.length > 0 ? (
          <table className="w-full bg-white shadow-lg rounded-lg overflow-hidden">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="text-left px-6 py-4">ID</th>
                <th className="text-left px-6 py-4">Name</th>
                <th className="text-left px-6 py-4">Price</th>
                <th className="text-left px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr
                  key={product.id}
                  className="border-b hover:bg-gray-50 transition duration-300"
                >
                  <td className="px-6 py-4">{product.id}</td>
                  <td className="px-6 py-4">
                    {editingProductId === product.id ? (
                      <input
                        type="text"
                        value={editedName}
                        onChange={(e) => setEditedName(e.target.value)}
                        className="border border-gray-300 px-2 py-1 rounded"
                      />
                    ) : (
                      product.name
                    )}
                  </td>
                  <td className="px-6 py-4">{product.price}</td>
                  <td className="px-6 py-4 flex space-x-4">
                    {editingProductId === product.id ? (
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
                          onClick={() => handleEditClick(product)}
                          className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition duration-300"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteProduct(product.id)}
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
          <p className="text-gray-600 text-center">No products available.</p>
        )}
      </div>
    </div>
  );
};

export default Products;
