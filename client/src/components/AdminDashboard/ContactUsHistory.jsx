import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:4001/api';

const Contactushistory = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(5);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      // No headers needed here because we made the GET route public in the backend
      const response = await axios.get(`${API_URL}/contactus`);
      setPosts(response.data);
      setErrorMsg('');
    } catch (error) {
      console.error('Fetch Error:', error);
      setErrorMsg("Failed to load contact history data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert("You must be logged in to delete records.");
        return;
      }

      await axios.delete(`${API_URL}/contactus/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      alert("Record deleted successfully.");
      fetchPosts(); // Refresh list
    } catch (error) {
      const msg = error.response?.data?.message || "Delete failed.";
      alert(`Error: ${msg}`);
    }
  };

  // Pagination logic
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(posts.length / postsPerPage) || 1;

  if (loading) return (
    <div className="p-20 text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#105F4E] mx-auto"></div>
      <p className="mt-4 text-gray-600">Loading history data...</p>
    </div>
  );

  return (
    <section className='adminsection p-4'>
      <div className='card1 bg-white shadow-lg rounded-xl p-6 min-h-[500px] flex flex-col'>
        <h2 className="text-2xl font-bold mb-6 text-[#105F4E] border-b pb-4">Contact Us History</h2>
        
        {errorMsg && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
            {errorMsg}
          </div>
        )}

        <div className="flex-grow overflow-x-auto">
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="border-b px-4 py-3 text-xs font-bold uppercase text-gray-500 text-center">ID</th>
                <th className="border-b px-4 py-3 text-xs font-bold uppercase text-gray-500">Full Name</th>
                <th className="border-b px-4 py-3 text-xs font-bold uppercase text-gray-500">Email</th>
                <th className="border-b px-4 py-3 text-xs font-bold uppercase text-gray-500">Memo</th>
                <th className="border-b px-4 py-3 text-xs font-bold uppercase text-gray-500">Sent Date</th>
                <th className="border-b px-4 py-3 text-xs font-bold uppercase text-gray-500 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {currentPosts.length > 0 ? (
                currentPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-4 text-sm text-gray-500 text-center">#{post.id}</td>
                    <td className="px-4 py-4 text-sm font-semibold text-gray-900">{post.FullName}</td>
                    <td className="px-4 py-4 text-sm text-[#105F4E]">{post.Email}</td>
                    <td className="px-4 py-4 text-sm text-gray-600 max-w-xs truncate">{post.Memo}</td>
                    <td className="px-4 py-4 text-sm text-gray-500">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4 text-center">
                      <button 
                        onClick={() => handleDelete(post.id)}
                        className="text-red-600 hover:text-red-900 font-medium text-sm transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-20 text-gray-400 italic">No records found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Section */}
        <div className="mt-8 flex items-center justify-between border-t pt-4">
          <p className="text-sm text-gray-500">
            Page <span className="font-medium">{currentPage}</span> of <span className="font-medium">{totalPages}</span>
          </p>
          <div className="flex gap-2">
            <button 
              className={`px-4 py-2 text-sm rounded border ${currentPage === 1 ? 'bg-gray-100' : 'bg-white hover:bg-gray-50'}`}
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <button 
              className={`px-4 py-2 text-sm rounded border ${currentPage >= totalPages ? 'bg-gray-100' : 'bg-white hover:bg-gray-50'}`}
              onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
              disabled={currentPage >= totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contactushistory;