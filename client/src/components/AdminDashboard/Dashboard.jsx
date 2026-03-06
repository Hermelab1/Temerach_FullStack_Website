import React from 'react';

const Dashboard = ({ username }) => {
  // Mock data for the UI
  const stats = [
    { title: 'Total Revenue', value: '$12,450.00', icon: 'fa-dollar-sign', color: 'text-green-600', bg: 'bg-green-100' },
    { title: 'New Orders', value: '45', icon: 'fa-shopping-cart', color: 'text-blue-600', bg: 'bg-blue-100' },
    { title: 'Total Customers', value: '1,204', icon: 'fa-users', color: 'text-purple-600', bg: 'bg-purple-100' },
    { title: 'Pending Shipments', value: '12', icon: 'fa-truck', color: 'text-orange-600', bg: 'bg-orange-100' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Dashboard Overview</h1>
          <p className="text-slate-500">Welcome back, {username || 'Admin'}! Here is what's happening today.</p>
        </div>
        <div className="mt-4 md:mt-0">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition shadow-sm font-medium">
            <i className="fa-solid fa-download mr-2"></i> Generate Report
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">{stat.title}</p>
                <h3 className="text-2xl font-bold text-slate-800 mt-1">{stat.value}</h3>
              </div>
              <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-lg flex items-center justify-center text-xl`}>
                <i className={`fa-solid ${stat.icon}`}></i>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-green-500 font-semibold mr-2">
                <i className="fa-solid fa-arrow-up mr-1"></i> 12%
              </span>
              <span className="text-slate-400">vs last month</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders Table */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-100 shadow-sm">
          <div className="p-6 border-b border-slate-50 flex justify-between items-center">
            <h3 className="font-bold text-slate-800">Recent Orders</h3>
            <button className="text-blue-600 text-sm font-medium hover:underline">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
                <tr>
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Product</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {[1, 2, 3].map((_, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-4 font-medium">#ORD-240{i}</td>
                    <td className="px-6 py-4">Temerach Special Roast</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-green-100 text-green-700">DELIVERED</span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-700">$45.00</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions / Activity */}
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
          <h3 className="font-bold text-slate-800 mb-4">Stock Alerts</h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg">
              <i className="fa-solid fa-circle-exclamation text-red-500 mt-1"></i>
              <div>
                <p className="text-sm font-semibold text-red-800">Low Stock: Arabica Dark</p>
                <p className="text-xs text-red-600">Only 5 units remaining in warehouse.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
              <i className="fa-solid fa-circle-info text-blue-500 mt-1"></i>
              <div>
                <p className="text-sm font-semibold text-blue-800">New Review</p>
                <p className="text-xs text-blue-600">A customer left a 5-star review on "Sidamo Gold".</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;