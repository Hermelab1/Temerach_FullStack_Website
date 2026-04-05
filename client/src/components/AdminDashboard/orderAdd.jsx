import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:4001/api';

const OrderAdd = ({ username }) => {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(8);
  const [expandedRows, setExpandedRows] = useState({});

  useEffect(() => {
    const fetchPosts = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        alert('No token found. Please log in.');
        return;
      }

      try {
        const response = await axios.get(`${API_URL}/allorders`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPosts(response.data);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setPosts([]);
      }
    };

    fetchPosts();
  }, []);

  const indexOfLastPost = currentPage * postsPerPage;
  const currentPosts = posts.slice(indexOfLastPost - postsPerPage, indexOfLastPost);
  const totalPages = Math.ceil(posts.length / postsPerPage);

  const handleToggleRow = (id) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id], // Use the 'id' property from your API
    }));
  };

  return (
    <section className="">
      <div className="card1 p-4">
        <table className="min-w-full border border-gray-300 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 px-2 py-2 w-10"></th>

              <th className="border border-gray-300 px-4 py-2">Order Number</th>
              <th className="border border-gray-300 px-4 py-2">Ordered By</th>
              <th className="border border-gray-300 px-4 py-2">Company</th>
              <th className="border border-gray-300 px-4 py-2">Email</th>
              <th className="border border-gray-300 px-2 py-2">Phone</th>
              <th className="border border-gray-300 px-2 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {currentPosts.map((post) => (
              <React.Fragment key={post.id}>
                <tr className={expandedRows[post.id] ? "bg-blue-50" : ""}>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    <button 
                      className='font-bold text-blue-600 bg-transparent hover:bg-transparent' 
                      onClick={() => handleToggleRow(post.id)}
                    >
                      {expandedRows[post.id] ? '−' : '+'}
                    </button>
                  </td>
                  <td className="border border-gray-300 px-4 py-2 font-mono">{post.orderNumber}</td>
                  <td className="border border-gray-300 px-4 py-2">{post.customerName}</td>
                  <td className="border border-gray-300 px-4 py-2">{post.companyName}</td>
                  <td className="border border-gray-300 px-4 py-2">{post.customerEmail}</td>
                  <td className="border border-gray-300 px-2 py-2">{post.phone}</td>
                  <td className="border border-gray-300 px-2 py-2 text-center">
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                        {post.status}
                    </span>
                  </td>
                </tr>

                {/* Detail row */}
                {expandedRows[post.id] && (
                  <tr>
                    <td colSpan="8" className="border border-gray-300 bg-gray-50 px-8 py-4">
                      <div className="flex flex-col gap-2">
                        <h4 className="font-bold border-b pb-1">Order Details</h4>
                        <p><strong>Delivery Address:</strong> {post.deliveryAddress}</p>
                        <p><strong>Total Amount:</strong> ${post.totalAmount}</p>
                        
                        <div className="mt-2">
                            <p className="font-semibold mb-1 underline">Items:</p>
                            <ul className="list-disc ml-5">
                                {post.details.map((item) => (
                                    <li key={item.id}>
                                        Item ID: {item.itemId} — Qty: {item.quantity} @ ${item.unitprice} (Total: ${item.totalprice})
                                    </li>
                                ))}
                            </ul>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
        
        {/* Pagination */}
{/* Pagination */}
<footer className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 mt-6">
  
  {/* Previous Button */}
  <button
    className={`px-4 py-2 rounded text-sm w-full sm:w-auto ${
      currentPage === 1
        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
        : 'bg-blue-500 text-white hover:bg-blue-600'
    }`}
    onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
    disabled={currentPage === 1}
  >
    Previous
  </button>

  {/* Page Info */}
  <span className="text-sm text-gray-600 text-center">
    Page {currentPage} of {totalPages}
  </span>

  {/* Next Button */}
  <button
    className={`px-4 py-2 rounded text-sm w-full sm:w-auto ${
      currentPage === totalPages
        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
        : 'bg-blue-500 text-white hover:bg-blue-600'
    }`}
    onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
    disabled={currentPage === totalPages}
  >
    Next
  </button>

</footer>
      </div>
    </section>
  );
};

export default OrderAdd;