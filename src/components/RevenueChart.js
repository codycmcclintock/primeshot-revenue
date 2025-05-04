import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const RevenueChart = ({ projections = [] }) => {
  // Default to empty array if projections is undefined
  const safeProjections = projections || [];
  
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  
  // Get current month and create labels for the next 12 months
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  
  const labels = Array(12).fill().map((_, i) => {
    const monthIndex = (currentMonth + i) % 12;
    const yearOffset = Math.floor((currentMonth + i) / 12);
    return `${months[monthIndex]} ${currentYear + yearOffset}`;
  });

  // Calculate if we reach $500K in any month
  const reachesMilestone = safeProjections.some(value => value >= 500000);
  const milestoneMonth = safeProjections.findIndex(value => value >= 500000);
  
  const data = {
    labels,
    datasets: [
      {
        label: 'Monthly Revenue',
        data: safeProjections,
        backgroundColor: 'rgba(59, 130, 246, 0.7)',
        borderColor: '#3B82F6',
        borderWidth: 1,
      }
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            }).format(context.raw);
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            }).format(value);
          }
        }
      }
    }
  };

  return (
    <div className="w-full h-[400px] bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      {reachesMilestone && (
        <div className="mb-4 text-sm bg-green-50 text-green-700 px-4 py-2 rounded-lg inline-flex items-center">
          Milestone: $500K reached by {labels[milestoneMonth]}
        </div>
      )}
      <div className="h-full">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default RevenueChart;
