import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:4001/api';

const UOMAdd = ({ username }) => {
    const initialFormData = {
        id: null,
        uomName: '',
        uomDescription: '',
        isActive: true,
    };

    const [uoms, setUoms] = useState([]);
    const [formData, setFormData] = useState(initialFormData);
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    // 1. Memoized fetch function (Following CategoriesAdd pattern)
    const fetchUoms = useCallback(async () => {
        const token = localStorage.getItem('authToken');
        try {
            const response = await axios.get(`${API_URL}/uoms`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            // Handle different potential data structures from backend
            setUoms(Array.isArray(response.data) ? response.data : response.data.uoms || []);
        } catch (error) {
            console.error('Fetch Error:', error);
            setUoms([]);
        }
    }, []);

    // 2. Load data immediately on mount
    useEffect(() => {
        fetchUoms();
    }, [fetchUoms]);

    const handleEdit = (uom) => {
        setFormData({
            id: uom.id,
            uomName: uom.uomName,
            uomDescription: uom.uomDescription,
            isActive: !!uom.isActive, 
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
                await axios.put(`${API_URL}/updateuom/${formData.id}`, payload, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                const { id, ...newData } = payload;
                await axios.post(`${API_URL}/adduom`, newData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
            alert("Success!");
            setFormData(initialFormData);
            setIsEditing(false);
            fetchUoms(); 
        } catch (error) {
            console.error("Submission Error:", error.response?.data);
            alert(error.response?.data?.message || "Operation failed");
        } finally {
            setLoading(false);
        }
    };

    // Pagination Calculation
    const totalPages = Math.ceil(uoms.length / itemsPerPage);
    const currentItems = uoms.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div className="max-w-6xl mx-auto p-4 space-y-6">
            {/* FORM SECTION - Top */}
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-lg border border-slate-200">
                <h2 className="text-xl font-bold mb-4 text-slate-700">
                    {isEditing ? `Editing UOM: ${formData.uomName}` : "Add Unit of Measure"}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">UOM Name</label>
                        <input 
                            placeholder="e.g. Kilograms"
                            value={formData.uomName}
                            onChange={e => setFormData({...formData, uomName: e.target.value})}
                            className="border p-3 rounded-lg outline-blue-500 bg-slate-50 focus:bg-white transition-all"
                            required
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Description</label>
                        <input 
                            placeholder="Short description..."
                            value={formData.uomDescription}
                            onChange={e => setFormData({...formData, uomDescription: e.target.value})}
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
                        UOM is Active
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
                            {loading ? "SAVING..." : isEditing ? "UPDATE UOM" : "SAVE UOM"}
                        </button>
                    </div>
                </div>
            </form>

            {/* TABLE SECTION - Bottom */}
            <div className="bg-white rounded-xl shadow-md border overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-400 border-b">
                        <tr>
                            <th className="p-4 w-16">ID</th>
                            <th className="p-4">UOM Name</th>
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
                                    <td className="p-4 font-bold text-slate-700">{item.uomName}</td>
                                    <td className="p-4 text-slate-500">{item.uomDescription}</td>
                                    <td className="p-4 text-center">
                                        <span className={`px-2 py-1 rounded-full text-[9px] font-black tracking-tighter ${item.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                                            {item.isActive ? "ACTIVE" : "INACTIVE"}
                                        </span>
                                    </td>
                                    <td className="p-4 text-center">
                                        <button 
                                            onClick={() => handleEdit(item)} 
                                            className="text-green-600 bg-green-50 hover:bg-green-100 px-4 py-1.5 rounded-md font-bold text-[10px] uppercase transition-colors"
                                        >
                                            Edit
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="p-10 text-center text-slate-400 italic">
                                    No Units of Measure found.
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

export default UOMAdd;