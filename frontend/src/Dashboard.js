import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from "./AuthContext";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
} from 'chart.js';
import { Line, Pie } from 'react-chartjs-2';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title
);


const Dashboard = () => {
  const [chartData, setChartData] = useState(null);
  const [pieChartData, setPieChartData] = useState(null);
  const [cardsData, setCardsData] = useState(null);

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

        //Pie Chart Data
        const labels1 = response.data.purchases_per_product.map(item => item.name);
        const quantities1 = response.data.purchases_per_product.map(item => item.total_quantity);

        setPieChartData({
          labels: labels1,
            datasets: [
            {
              label: "Products",
              data: quantities1,
              backgroundColor: [
                "rgba(255, 99, 132, 0.6)",
                "rgba(54, 162, 235, 0.6)",
                "rgba(255, 206, 86, 0.6)",
                "rgba(75, 192, 192, 0.6)",
                "rgba(153, 102, 255, 0.6)",
              ],
              borderColor: [
                "rgba(255, 99, 132, 1)",
                "rgba(54, 162, 235, 1)",
                "rgba(255, 206, 86, 1)",
                "rgba(75, 192, 192, 1)",
                "rgba(153, 102, 255, 1)",
              ],
              borderWidth: 1,
            },
          ],
        });

        setCardsData(response.data.cards_data);
      } catch (err) {
        console.error('Error fetching purchases data:', err);
      }
    };

    fetchAnalytics();
  }, [user.access_token]);

  const InfoCard = ({ title, value, subtitle, change, isPositive, icon }) => {
    return (
      <div className="bg-white shadow-lg rounded-lg p-4 w-64">
        <div className="text-gray-500 text-sm font-medium">{title}</div>
        <div className="text-3xl font-bold text-gray-800 mt-2">{value}</div>
        <div className="text-gray-500 text-sm mt-1">{subtitle}</div>
        <div className="flex items-center mt-2">
          <span className={`text-lg font-medium ${isPositive ? "text-green-500" : "text-red-500"}`}>
            {isPositive ? "▲" : "▼"} {change}
          </span>
        </div>
      </div>
    );
  };

  if (!chartData && !pieChartData && !cardsData) {
    return <div className="text-center text-gray-500">Loading chart...</div>;
  }

  return (
    <>
    <h1 className="text-xl font-bold mb-6 text-center">Analytics</h1>
    <div className="flex flex-col items-center justify-center">
      <div className="flex space-x-4">
        {cardsData.map((card, index) => (
          <InfoCard
            key={index}
            title={card.title}
            value={card.value}
            subtitle={card.subtitle}
            change={card.change}
            isPositive={card.isPositive}
            icon={card.icon}
          />
        ))}
      </div>
    </div>
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 p-4">
          <h2 className="text-xl font-bold mb-4 text-center">Purchases by day and hour</h2>
          <Line data={chartData} />
        </div>
        <div className="col-span-1 p-4">
          <h2 className="text-xl font-bold mb-4 text-center">Most purchased product by name</h2>
          <Pie data={pieChartData} />
        </div>
      </div>
    </div>
    </>
  );
};

export default Dashboard;
