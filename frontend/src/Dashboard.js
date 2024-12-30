import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from "./AuthContext";

const Dashboard = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await axios.get('http://localhost:5000/analytics/', {
          headers: {
            Authorization: `Bearer ${user.access_token}`,
          },
        });
        setAnalyticsData(response.data);
        setLoading(false);
      } catch (err) {
        console.log(err);
        setError(err.response?.data?.message || 'Failed to fetch analytics data.');
        setLoading(true);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) return <div>Loading analytics data...</div>;

  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Analytics Dashboard</h1>
      <h2 className="text-xl font-semibold text-gray-700 mb-2">Key Performance Indicators (KPIs)</h2>
      <ul className="list-disc list-inside mb-6">
        <li className="text-gray-700"><strong>Total Revenue:</strong> {analyticsData.total_revenue}</li>
        <li className="text-gray-700"><strong>Total Quantity Sold:</strong> {analyticsData.total_quantity_sold}</li>
        <li className="text-gray-700"><strong>Average Order Value:</strong> {analyticsData.average_order_value}</li>
        <li className="text-gray-700"><strong>Total Purchases:</strong> {analyticsData.total_purchases}</li>
        <li className="text-gray-700"><strong>Most Purchased Product ID:</strong> {analyticsData.most_purchased_product_id}</li>
      </ul>
      <h2 className="text-xl font-semibold text-gray-700 mb-2">Purchases Per Client</h2>
        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-4 py-2 text-left">Client ID</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Number of Purchases</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(analyticsData.purchases_per_client).map(([clientId, purchaseCount]) => (
                <tr key={clientId} className="hover:bg-gray-100">
                  <td className="border border-gray-300 px-4 py-2">{clientId}</td>
                  <td className="border border-gray-300 px-4 py-2">{purchaseCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
    </div>
  );
};

export default Dashboard;
