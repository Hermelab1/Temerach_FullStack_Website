import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PaymentList = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const token = localStorage.getItem('token'); // Assuming admin is logged in
        const res = await axios.get('http://localhost:4001/api/allpayments', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPayments(res.data);
      } catch (err) {
        console.error("Error loading payments", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  if (loading) return <div className="p-10 text-center text-gray-500">Loading Transaction History...</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Payment Transactions</h2>
        
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase">Date</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase">Order #</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase">Customer</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase">Transaction ID</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase">Method</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase">Amount</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {payments.map((py) => (
                <tr key={py.id} className="hover:bg-gray-50 transition">
                  <td className="p-4 text-sm text-gray-600">
                    {new Date(py.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-sm font-bold text-blue-600">
                    {py.Order?.orderNumber}
                  </td>
                  <td className="p-4">
                    <p className="text-sm font-medium text-gray-800">{py.Order?.customerName}</p>
                    <p className="text-xs text-gray-400">{py.Order?.customerEmail}</p>
                  </td>
                  <td className="p-4 text-xs font-mono text-gray-500">
                    {py.transactionId || 'N/A'}
                  </td>
                  <td className="p-4 text-sm text-gray-600">
                    {py.paymentMethod}
                  </td>
                  <td className="p-4 text-sm font-bold text-gray-900">
                    ${parseFloat(py.amount).toFixed(2)}
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                      py.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {py.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {payments.length === 0 && (
            <div className="p-10 text-center text-gray-400 italic">No payments found in the database.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentList;