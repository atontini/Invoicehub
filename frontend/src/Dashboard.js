import React from 'react';
import { Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LineController,
  CategoryScale,
  LinearScale,
  ArcElement,
  PieController,
  Legend,
  Tooltip,
} from 'chart.js';

// Register the required components
ChartJS.register(
  LineElement,
  PointElement,
  LineController,
  CategoryScale,
  LinearScale,
  ArcElement,
  PieController,
  Legend,
  Tooltip
);


const Dashboard = () => {
  const averageSales = {
    total_sales: 50897,
    this_month_percentage: 8,
  };

  const totalSales = {
    total: 550897,
    increase_last_month: 3.48,
  };

  const totalInquiries = {
    total: 750897,
    increase_last_month: 3.48,
  };

  const totalInvoices = {
    total: 897,
    increase_last_month: 3.48,
  };

  const graphSales = {
    profit: [10, 20, 15, 40, 50, 70, 90],
    sales: [5, 15, 25, 35, 30, 60, 80],
    categories: ['Apple', 'Samsung', 'Vivo', 'Oppo'],
    categories_percentage: [40, 30, 20, 10],
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="container mx-auto p-4">
        {/* Heading */}
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-8">
          Analytics
        </h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white shadow-lg rounded-lg p-6 text-center">
            <h2 className="text-lg font-semibold text-gray-600">Average Sales</h2>
            <p className="text-2xl font-bold text-gray-800">${averageSales.total_sales}</p>
            <p className="text-green-500">
              +{averageSales.this_month_percentage}% this month
            </p>
          </div>
          <div className="bg-white shadow-lg rounded-lg p-6 text-center">
            <h2 className="text-lg font-semibold text-gray-600">Total Sales</h2>
            <p className="text-2xl font-bold text-gray-800">${totalSales.total}</p>
            <p className="text-green-500">
              +{totalSales.increase_last_month}% last month
            </p>
          </div>
          <div className="bg-white shadow-lg rounded-lg p-6 text-center">
            <h2 className="text-lg font-semibold text-gray-600">Total Inquiries</h2>
            <p className="text-2xl font-bold text-gray-800">{totalInquiries.total}</p>
            <p className="text-green-500">
              +{totalInquiries.increase_last_month}% last month
            </p>
          </div>
          <div className="bg-white shadow-lg rounded-lg p-6 text-center">
            <h2 className="text-lg font-semibold text-gray-600">Total Invoices</h2>
            <p className="text-2xl font-bold text-gray-800">{totalInvoices.total}</p>
            <p className="text-green-500">
              +{totalInvoices.increase_last_month}% last month
            </p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Line Chart */}
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-600 mb-4">Sales & Profit</h2>
            <Line
              data={{
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
                datasets: [
                  {
                    label: 'Profit',
                    data: graphSales.profit,
                    borderColor: '#4F46E5',
                    backgroundColor: 'rgba(79, 70, 229, 0.2)',
                    fill: true,
                  },
                  {
                    label: 'Sales',
                    data: graphSales.sales,
                    borderColor: '#10B981',
                    backgroundColor: 'rgba(16, 185, 129, 0.2)',
                    fill: true,
                  },
                ],
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    display: true,
                    position: 'top',
                  },
                },
              }}
            />
          </div>

          {/* Pie Chart */}
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-600 mb-4">Category Distribution</h2>
            <Pie
              data={{
                labels: graphSales.categories,
                datasets: [
                  {
                    data: graphSales.categories_percentage,
                    backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4CAF50'],
                    hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4CAF50'],
                  },
                ],
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    display: true,
                    position: 'top',
                  },
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
