import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:4001/api';

const CategoriesAdd = ({ username }) => {
    const initialFormData = {
        id: null,
        categoryName: '',
        categoryDescription: '',
        isActive: true,
    };

    const [posts, setPosts] = useState([]);
    const [formData, setFormData] = useState(initialFormData);
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 8;

    // 1. Memoized fetch function
    const fetchCategories = useCallback(async () => {
        const token = localStorage.getItem('authToken');
        try {
            const response = await axios.get(`${API_URL}/allcategory`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            // Ensure we set an array even if the backend returns something else
            setPosts(Array.isArray(response.data) ? response.data : response.data.categories || []);
        } catch (error) {
            console.error('Fetch Error:', error);
            setPosts([]);
        }
    }, []);

    // 2. Load data immediately on component mount
    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    const handleEdit = (post) => {
        setFormData({
            id: post.id,
            categoryName: post.categoryName,
            categoryDescription: post.categoryDescription,
            isActive: !!post.isActive, 
        });
        setIsEditing(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const token = localStorage.getItem('authToken');
        
        try {
            const payload = { ...formData };
            if (isEditing) {
                await axios.put(`${API_URL}/updatecategory/${formData.id}`, payload, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                // Remove ID when adding new
                const { id, ...newData } = payload;
                await axios.post(`${API_URL}/addcategory`, newData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
            alert("Success!");
            setFormData(initialFormData);
            setIsEditing(false);
            fetchCategories(); // Refresh list
        } catch (error) {
            console.error("Submission Error:", error.response?.data);
            alert(error.response?.data?.message || "Operation failed");
        } finally {
            setLoading(false);
        }
    };

    // Pagination Calculation
    const totalPages = Math.ceil(posts.length / postsPerPage);
    const currentItems = posts.slice((currentPage - 1) * postsPerPage, currentPage * postsPerPage);

    return (
        <div className="max-w-6xl mx-auto p-4 space-y-6">
            {/* FORM SECTION */}
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-lg border border-slate-200">
                <h2 className="text-xl font-bold mb-4">
                    {isEditing ? `Editing: ${formData.categoryName}` : "Add New Category"}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Category Name</label>
                        <input 
                            placeholder="e.g. Electronics"
                            value={formData.categoryName}
                            onChange={e => setFormData({...formData, categoryName: e.target.value})}
                            className="border p-3 rounded-lg outline-blue-500 bg-slate-50 focus:bg-white transition-all"
                            required
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Description</label>
                        <input 
                            placeholder="Short description..."
                            value={formData.categoryDescription}
                            onChange={e => setFormData({...formData, categoryDescription: e.target.value})}
                            className="border p-3 rounded-lg outline-blue-500 bg-slate-50 focus:bg-white transition-all"
                            required
                        />
                    </div>
                </div>
                <div className="flex items-center justify-between mt-6 pt-4 border-t">
                    <label className="flex items-center gap-2 font-bold text-xs uppercase text-slate-500 cursor-pointer">
                        <input 
                            type="checkbox" 
                            className="w-4 h-4 accent-blue-600"
                            checked={formData.isActive} 
                            onChange={e => setFormData({...formData, isActive: e.target.checked})} 
                        />
                        Category is Active
                    </label>
                    <div className="flex gap-3">
                        {isEditing && (
                            <button 
                                type="button" 
                                onClick={() => {setIsEditing(false); setFormData(initialFormData)}} 
                                className="px-6 py-2 text-slate-400 font-bold text-xs uppercase hover:text-slate-600"
                            >
                                Cancel
                            </button>
                        )}
                        <button 
                            disabled={loading} 
                            className="bg-blue-600 text-white px-8 py-2 rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50 shadow-md active:transform active:scale-95 transition-all"
                        >
                            {loading ? "SAVING..." : isEditing ? "UPDATE" : "SAVE"}
                        </button>
                    </div>
                </div>
            </form>

            {/* TABLE SECTION */}
            <div className="bg-white rounded-xl shadow-md border overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-400 border-b">
                        <tr>
                            <th className="p-4 w-16">ID</th>
                            <th className="p-4">Category</th>
                            <th className="p-4">Description</th>
                            <th className="p-4 text-center">Status</th>
                            <th className="p-4 text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {currentItems.length > 0 ? (
                            currentItems.map(item => (
                                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                                    <td className="p-4 text-slate-400 font-mono">#{item.id}</td>
                                    <td className="p-4 font-bold text-slate-700">{item.categoryName}</td>
                                    <td className="p-4 text-slate-500">{item.categoryDescription}</td>
                                    <td className="p-4 text-center">
                                        <span className={`px-2 py-1 rounded-full text-[9px] font-black tracking-tighter ${item.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                                            {item.isActive ? "ACTIVE" : "INACTIVE"}
                                        </span>
                                    </td>
                                    <td className="p-4 text-center">
                                        <button 
                                            onClick={() => handleEdit(item)} 
                                            className="text-blue-600 bg-blue-50 hover:bg-blue-100 px-4 py-1.5 rounded-md font-bold text-[10px] uppercase transition-colors"
                                        >
                                            Edit
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="p-10 text-center text-slate-400 italic">
                                    No categories found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {/* PAGINATION */}
                <div className="p-4 border-t flex justify-between items-center bg-slate-50/50">
                    <button 
                        disabled={currentPage === 1} 
                        onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                        className="px-4 py-2 text-[11px] font-black uppercase border rounded-lg bg-white shadow-sm hover:bg-slate-50 disabled:opacity-25 transition"
                    >
                        Previous
                    </button>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                        Page {currentPage} of {totalPages || 1}
                    </span>
                    <button 
                        disabled={currentPage >= totalPages} 
                        onClick={() => setCurrentPage(p => p + 1)}
                        className="px-4 py-2 text-[11px] font-black uppercase border rounded-lg bg-white shadow-sm hover:bg-slate-50 disabled:opacity-25 transition"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CategoriesAdd;