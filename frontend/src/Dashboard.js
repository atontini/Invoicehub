import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from "./AuthContext";
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement);

const Dashboard = () => {
  const [chartData, setChartData] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await axios.get('http://localhost:5000/analytics/', {
          headers: {
            Authorization: `Bearer ${user.access_token}`,
          },
        });
        const labels = [];
        const purchases = [];

        response.data.purchases_per_day.forEach(item => {
          const dayHour = `${item.day} ${item.hour}:00`;
          labels.push(dayHour);
          purchases.push(item.quantity);
        });

        setChartData({
          labels,
          datasets: [
            {
              label: 'Purchases by Day and Hour',
              data: purchases,
              borderColor: 'rgb(75, 192, 192)',
              borderWidth: 6,
              tension: 0.4,
            },
          ],
        });
      } catch (err) {
        console.error('Error fetching purchases data:', err);
      }
    };

    fetchAnalytics();
  }, []);

  if (!chartData) {
    return <div className="text-center text-gray-500">Loading chart...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-xl font-bold mb-4 text-center">Purchases by Day and Hour</h2>
      <Line data={chartData} />
    </div>
  );
};

export default Dashboard;
