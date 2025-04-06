'use client';

import { useSession, signOut } from 'next-auth/react';

import { useRef, useEffect } from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import Header from './Header';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

interface EggData {
  date: string;
  house: string;
  totalEggs: number;
  mortality: number;
  brokenEggs: number;
  chickens: number;
  food: number;
  user: string;
  tray: number;
  percentage: number;
}

interface DashboardProps {
  eggData: EggData[];
  error: string | null;
}

export default function Dashboard({ eggData, error }: DashboardProps) {
  const {status } = useSession();
  // Removed unused state variable isProfilePopoverOpen
  const profileRef = useRef<HTMLDivElement>(null);

  // Calculate metrics
  const uniqueCustomers = new Set(eggData.map((item) => item.user)).size;
  const totalEggs = eggData.reduce((sum, item) => sum + item.totalEggs, 0);
  const totalSales = totalEggs * 0.1; // Assume $0.10 per egg

  // Monthly sales for the bar graph
  const monthlySales: { [key: string]: number } = {};
  eggData.forEach((item) => {
    const month = new Date(item.date).toLocaleString('default', { month: 'short' });
    monthlySales[month] = (monthlySales[month] || 0) + item.totalEggs;
  });

  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];
  const salesData = months.map((month) => monthlySales[month] || 0);

  // Chart.js data for Monthly Egg Production
  const chartData = {
    labels: months,
    datasets: [
      {
        label: 'Monthly Egg Production',
        data: salesData,
        backgroundColor: 'rgba(147, 51, 234, 0.6)',
        borderColor: 'rgba(147, 51, 234, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Total Eggs',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Month',
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  // Monthly target calculation
  const targetEggs = 10000;
  const currentMonthEggs = monthlySales[new Date().toLocaleString('default', { month: 'short' })] || 0;
  const targetPercentage = (currentMonthEggs / targetEggs) * 100;

  // Sales Category (Doughnut Chart)
  const salesCategoryData = {
    labels: ['Affiliate Program', 'Direct Buy', 'Adsense'],
    datasets: [
      {
        data: [48, 33, 19], // Example percentages
        backgroundColor: [
          'rgba(147, 51, 234, 1)', // Purple
          'rgba(167, 139, 250, 1)', // Lighter Purple
          'rgba(196, 181, 253, 1)', // Lightest Purple
        ],
        borderWidth: 0,
      },
    ],
  };

  const salesCategoryOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          boxWidth: 12,
          padding: 20,
        },
      },
    },
    cutout: '70%',
  };

  // Average Daily Sales (Bar Chart)
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const dailySalesData = {
    labels: days,
    datasets: [
      {
        label: 'Daily Sales',
        data: [300, 200, 350, 400, 250, 300, 200], // Example data
        backgroundColor: 'rgba(147, 51, 234, 0.6)',
        borderColor: 'rgba(147, 51, 234, 1)',
        borderWidth: 1,
      },
    ],
  };

  const dailySalesOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  // Conversion Funnel (Stacked Bar Chart)
  const funnelData = {
    labels: months,
    datasets: [
      {
        label: 'Ad Impressions',
        data: months.map(() => Math.floor(Math.random() * 120)),
        backgroundColor: 'rgba(147, 51, 234, 1)',
      },
      {
        label: 'Website Session',
        data: months.map(() => Math.floor(Math.random() * 100)),
        backgroundColor: 'rgba(167, 139, 250, 1)',
      },
      {
        label: 'App Downloads',
        data: months.map(() => Math.floor(Math.random() * 80)),
        backgroundColor: 'rgba(196, 181, 253, 1)',
      },
      {
        label: 'New Users',
        data: months.map(() => Math.floor(Math.random() * 60)),
        backgroundColor: 'rgba(233, 213, 255, 1)',
      },
    ],
  };

  const funnelOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
  };


  const handleSignOut = () => {
    signOut({ callbackUrl: '/dashboard/login' });
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent): void {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        // Handle click outside logic here if needed
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [profileRef]);

  if (status === 'loading') return <p>Loading...</p>;
  if (status === 'unauthenticated') return <p>Please log in.</p>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <Header onSignOut={handleSignOut} /> 

      {/* Error message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
          {error}
        </div>
      )}

      {/* Existing Dashboard Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {/* Customers Card */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mr-2 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15.15 11h2.586a1 1 0 01.707.293l3 3a1 1 0 01-.293 1.707l-6.379 6.379a1 1 0 01-1.414 0l-6.379-6.379a1 1 0 01-.293-1.707l3-3A1 1 0 018.35 11h2.586m-4.85 0a2 2 0 01-3.514-2.311l1.7-4.828a2 2 0 013.514-1.039l3.666 1.057a2 2 0 01.632 2.162l-1.55 3.995z"
                />
              </svg>
              <span className="text-lg font-semibold text-gray-900">Customers</span>
            </div>
            <span className="text-green-500">+11.07%</span>
          </div>
          <p className="text-3xl font-bold mt-2 text-gray-900">{uniqueCustomers}</p>
        </div>

        {/* Total Sales Card */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mr-2 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 1.343-3 3v2c0 1.657 1.343 3 3 3s3-1.343 3-3v-2c0-1.657-1.343-3-3-3zm0 0V6m-9 9h18"
                />
              </svg>
              <span className="text-lg font-semibold text-gray-900">Total Sales</span>
            </div>
            <span className="text-red-500">-9.05%</span>
          </div>
          <p className="text-3xl font-bold mt-2 text-gray-900">${totalSales.toFixed(2)}</p>
        </div>

         {/* Total Sales Card */}
         <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mr-2 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 1.343-3 3v2c0 1.657 1.343 3 3 3s3-1.343 3-3v-2c0-1.657-1.343-3-3-3zm0 0V6m-9 9h18"
                />
              </svg>
              <span className="text-lg font-semibold text-gray-900">Total Sales</span>
            </div>
            <span className="text-red-500">-9.05%</span>
          </div>
          <p className="text-3xl font-bold mt-2 text-gray-900">${totalSales.toFixed(2)}</p>
        </div>


        {/* Monthly Sales Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md col-span-1 md:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-900">Monthly Egg Production</h3>
            <button className="text-gray-500 hover:text-gray-900">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                />
              </svg>
            </button>
          </div>
          <div className="h-64">
            <Bar data={chartData} options={chartOptions} />
          </div>
        </div>

        {/* Monthly Target */}
        <div className="bg-white p-6 rounded-lg shadow-md col-span-1">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-900">Monthly Target</h3>
            <button className="text-gray-500 hover:text-gray-900">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                />
              </svg>
            </button>
          </div>
          <div className="text-center">
            <div className="relative inline-flex items-center justify-center">
              <svg className="w-48 h-48" viewBox="0 0 100 100">
                <circle
                  className="stroke-current text-purple-200 stroke-2"
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                />
                <circle
                  className="stroke-current text-purple-600 stroke-4"
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  strokeDasharray={`${targetPercentage * 2.82743} 282.743`}
                  transform="rotate(-90 50 50)"
                />
                <text
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl font-bold text-gray-800"
                >
                  {targetPercentage.toFixed(2)}%
                </text>
              </svg>
            </div>
            <p className="text-green-500">+10%</p>
            <p className="mt-4 text-sm text-gray-700">
              You produced {currentMonthEggs} eggs this month, aiming for {targetEggs}.
              Keep up your good work!
            </p>
            <div className="mt-4 flex justify-around">
              <div>
                <p className="text-sm font-semibold text-gray-700">Target</p>
                <p className="text-lg font-bold text-gray-900">{targetEggs} eggs</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700">Produced</p>
                <p className="text-lg font-bold text-gray-900">{currentMonthEggs} eggs</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700">Today</p>
                <p className="text-lg font-bold text-gray-900">
                  {eggData
                    .filter((item) => item.date === new Date().toISOString().split('T')[0])
                    .reduce((sum, item) => sum + item.totalEggs, 0)} eggs
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* New Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Sales Category */}
        <div className="bg-white p-6 rounded-lg shadow-md col-span-1">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-900">Sales Category</h3>
            <button className="text-gray-500 hover:text-gray-900">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                />
              </svg>
            </button>
          </div>
          <div className="relative h-64">
            <Doughnut data={salesCategoryData} options={salesCategoryOptions} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
              <p className="text-sm text-gray-500">Total 3.5K</p>
              <p className="text-2xl font-bold text-gray-900">2450</p>
            </div>
          </div>
        </div>

        {/* Upcoming Schedule */}
        <div className="bg-white p-6 rounded-lg shadow-md col-span-1">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-900">Upcoming Schedule</h3>
            <button className="text-gray-500 hover:text-gray-900">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                />
              </svg>
            </button>
          </div>
          <div className="space-y-4">
            <div className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <div>
                <p className="text-sm font-medium text-gray-900">Wed, 11 Jan • 09:20 AM</p>
                <p className="text-sm text-gray-600">Business Analytics Press</p>
              </div>
            </div>
            <div className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <div>
                <p className="text-sm font-medium text-gray-900">Fri, 15 Feb • 10:35 AM</p>
                <p className="text-sm text-gray-600">Business Sprint</p>
              </div>
            </div>
            <div className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <div>
                <p className="text-sm font-medium text-gray-900">Thu, 18 Mar • 11:15 AM</p>
                <p className="text-sm text-gray-600">Customer Review Meeting</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Invoices */}
        <div className="bg-white p-6 rounded-lg shadow-md col-span-1 lg:col-span-3">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-900">Recent Invoices</h3>
            <div className="flex space-x-2">
              <button className="px-4 py-2 border rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                Filter
              </button>
              <button className="px-4 py-2 border rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                See All
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <input type="checkbox" />
                  </th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Deal ID
                  </th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product/Service
                  </th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Deal Value
                  </th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Close Date
                  </th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {[
                  {
                    dealId: 'DE124321',
                    customer: { name: 'John Doe', email: 'johndoe@gmail.com', initials: 'JD', color: 'bg-orange-400' },
                    product: 'Software License',
                    dealValue: '$618.50,34',
                    closeDate: '2024-06-15',
                    status: 'Complete',
                    statusColor: 'bg-green-100 text-green-800',
                  },
                  {
                    dealId: 'DE124322',
                    customer: { name: 'Jane Smith', email: 'janesmith@gmail.com', initials: 'JS', color: 'bg-yellow-400' },
                    product: 'Cloud Hosting',
                    dealValue: '$12,990.00',
                    closeDate: '2024-06-18',
                    status: 'Pending',
                    statusColor: 'bg-yellow-100 text-yellow-800',
                  },
                  {
                    dealId: 'DE124323',
                    customer: { name: 'Michael Brown', email: 'michaelbrown@gmail.com', initials: 'MB', color: 'bg-red-400' },
                    product: 'Web Domain',
                    dealValue: '$95.00',
                    closeDate: '2024-06-20',
                    status: 'Cancel',
                    statusColor: 'bg-red-100 text-red-800',
                  },
                  {
                    dealId: 'DE124324',
                    customer: { name: 'Alice Johnson', email: 'alicejohnson@gmail.com', initials: 'AJ', color: 'bg-purple-400' },
                    product: 'SSL Certificate',
                    dealValue: '$2,345',
                    closeDate: '2024-06-25',
                    status: 'Pending',
                    statusColor: 'bg-yellow-100 text-yellow-800',
                  },
                  {
                    dealId: 'DE124325',
                    customer: { name: 'Robert Lee', email: 'robertlee@gmail.com', initials: 'RL', color: 'bg-green-400' },
                    product: 'Premium Support',
                    dealValue: '$15,200.00',
                    closeDate: '2024-06-30',
                    status: 'Complete',
                    statusColor: 'bg-green-100 text-green-800',
                  },
                ].map((invoice, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <input type="checkbox" />
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-900">{invoice.dealId}</td>
                    <td className="py-4 px-6 text-sm text-gray-900">
                      <div className="flex items-center">
                        <div className={`w-8 h-8 rounded-full ${invoice.customer.color} flex items-center justify-center text-white mr-2`}>
                          {invoice.customer.initials}
                        </div>
                        <div>
                          <p className="font-medium">{invoice.customer.name}</p>
                          <p className="text-gray-500">{invoice.customer.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-900">{invoice.product}</td>
                    <td className="py-4 px-6 text-sm text-gray-900">{invoice.dealValue}</td>
                    <td className="py-4 px-6 text-sm text-gray-900">{invoice.closeDate}</td>
                    <td className="py-4 px-6 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${invoice.statusColor}`}>
                        {invoice.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-900">
                      <button className="text-gray-500 hover:text-gray-900">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                          />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Conversion Funnel and Average Daily Sales */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Conversion Funnel */}
        <div className="bg-white p-6 rounded-lg shadow-md col-span-1 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-900">Conversion Funnel</h3>
            <button className="text-gray-500 hover:text-gray-900">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                />
              </svg>
            </button>
          </div>
          <div className="h-64">
            <Bar data={funnelData} options={funnelOptions} />
          </div>
        </div>

        {/* Average Daily Sales */}
        <div className="bg-white p-6 rounded-lg shadow-md col-span-1">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-900">Average Daily Sales</h3>
            <button className="text-gray-500 hover:text-gray-900">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                />
              </svg>
            </button>
          </div>
          <div className="h-64">
            <Bar data={dailySalesData} options={dailySalesOptions} />
          </div>
          <div className="mt-4 text-center">
            <p className="text-2xl font-bold text-gray-900">$2,950</p>
            <p className="text-sm text-red-500">+0.52%</p>
          </div>
        </div>
      </div>
    </div>
  );
}