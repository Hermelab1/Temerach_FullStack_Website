import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:4001/api';

const OrderAdd = ({ username }) => {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(5);
  const [expandedRows, setExpandedRows] = useState({}); // State to manage expanded rows

  useEffect(() => {
    const fetchPosts = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        alert('No token found. Please log in.');
        return;
      }

      try {
        const response = await axios.get(`${API_URL}/orders`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPosts(response.data);
      } catch (error) {
        console.error('Error fetching posts:', error);
        alert(`Error fetching posts: ${error.response ? error.response.data.message : error.message}`);
        setPosts([]);
      }
    };

    fetchPosts();
  }, []);

  // Pagination logic
  const indexOfLastPost = currentPage * postsPerPage;
  const currentPosts = posts.slice(indexOfLastPost - postsPerPage, indexOfLastPost);
  const totalPages = Math.ceil(posts.length / postsPerPage);

  const handleToggleRow = (orderId) => {
    setExpandedRows((prev) => ({  
      ...prev,
      [orderId]: !prev[orderId], // Toggle expanded state for the clicked orderId
    }));
  };

  return (
    <section className="adminsection">
      <div className="card1">
        <table className="min-w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
                <th className="border border-gray-300 px-2 py-2"></th>
              <th className="border border-gray-300 px-4 py-2">ID</th>
              <th className="border border-gray-300 px-4 py-2">Order Id</th>
              <th className="border border-gray-300 px-4 py-2">Ordered By</th>
              <th className="border border-gray-300 px-4 py-2">Company Name</th>
              <th className="border border-gray-300 px-4 py-2">Website</th>
              <th className="border border-gray-300 px-4 py-2">Email</th>
              <th className="border border-gray-300 px-2 py-2">Phone</th>
              <th className="border border-gray-300 px-2 py-2">Address</th>

              <th className="border border-gray-300 px-2 py-2">Status</th>
               {/* New column for details */}
            </tr>
          </thead>
          <tbody>
            {currentPosts.map((post) => (
              <React.Fragment key={post.id}>
                <tr>
                    <td className="border border-gray-300 px-4 py-2">
                    <button className='bg-white hover:bg-white text-gray-600 text-bold' onClick={() => handleToggleRow(post.orderId)}>+</button>
                  </td>
                  <td className="border border-gray-300 px-4 py-2">{post.id}</td>
                  <td className="border border-gray-300 px-4 py-2">{post.orderId}</td>
                  <td className="border border-gray-300 px-4 py-2">{post.orderedBy}</td>
                  <td className="border border-gray-300 px-4 py-2">{post.companyName}</td>
                  <td className="border border-gray-300 px-4 py-2">{post.website}</td>
                  <td className="border border-gray-300 px-4 py-2">{post.email}</td>
                  <td className="border border-gray-300 px-2 py-2">{post.phone}</td>
                  <td className="border border-gray-300 px-2 py-2">{post.deliveryAddress}</td>
                  <td className="border border-gray-300 px-2 py-2"> {post.status}</td>
                </tr>

                {/* Detail row */}
                {expandedRows[post.orderId] && (
                  <tr>
                    <td colSpan="11" className="border border-gray-300 px-4 py-2">
                      <div>
                        {/* Here you can customize the additional details that you want to show */}
                        <p><strong>Orderd Date:</strong> {post.orderDate}</p>
                        <p><strong>Coffee Grade:</strong> {post.coffeeGrade}</p>
                        <p><strong>Quantity:</strong> {post.quantity}</p>
                        <p><strong>Agree with Terms:</strong> {post.agreewithterms ? 'Yes' : 'No'}</p>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
        <div className="pagination absolute bottom-0 left-0 right-0 flex justify-center gap-6 mb-2">
          <button 
              className={`border border-gray-300 rounded px-2 py-1 ${currentPage === 1 ? 'cursor-not-allowed bg-gray-100 text-gray-600 hover:bg-gray-100 hover:text-gray-600' : 'bg-blue-500 text-white hover:bg-blue-500 hover:text-white'}`}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
          >
              <i className="fa-solid fa-arrow-left"></i>
          </button>
          <button 
              className={`border border-gray-300 rounded px-2 py-1 ${currentPage === totalPages ? 'cursor-not-allowed bg-gray-100 text-gray-600 hover:bg-gray-100 hover:text-gray-600' : 'bg-blue-500 text-white hover:bg-blue-500 hover:text-white'}`}
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
          >
              <i className="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      </div>
    </section>
  );
};

export default OrderAdd;