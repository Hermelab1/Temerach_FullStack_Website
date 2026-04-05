import React, { useEffect, useState, useCallback } from "react";
import {createCurrency, updateCurrency, getCurrencies} from "../API/apis";
import { toast } from "react-hot-toast";
import { Edit3, Plus, ArrowLeft, ArrowRight, X } from "lucide-react"; // Using Lucide for cleaner icons

const Currency = ({ username }) => {
  const initialFormData = {
    id: null,
    code: "",
    name: "",
    symbol: "",
    rate: 1,
    isActive: true,
    isDefault: false,
  };

  const [currencies, setCurrencies] = useState([]);
  const [formData, setFormData] = useState(initialFormData);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 5;

  // Memoized fetch to prevent unnecessary re-renders
  const fetchCurrencies = useCallback(async () => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    try {
      setLoading(true);
      const res = await getCurrencies();
      setCurrencies(res || []);
    } catch (err) {
      toast.error("Failed to load currency list");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCurrencies();
  }, [username, fetchCurrencies]);

  const handleEdit = (currency) => {
    setFormData({ ...currency });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => setFormData(initialFormData);

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const isEditing = !!formData.id;

    if (isEditing) {
      await updateCurrency(formData.id, formData);
    } else {
      await createCurrency(formData);
    }

    toast.success(`Currency ${isEditing ? "updated" : "created"} successfully`);
    resetForm();
    fetchCurrencies();

  } catch (error) {
    const msg = error.response?.data?.message || "Operation failed";
    toast.error(msg);
  }
};

  // Pagination Logic
  const totalPages = Math.ceil(currencies.length / itemsPerPage);
  const currentItems = currencies.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* FORM COLUMN */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                {formData.id ? "Edit Currency" : "New Currency"}
              </h2>
              {formData.id && (
                <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
                  <X size={20} />
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Code (e.g. USD)</label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition"
                  placeholder="USD"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition"
                  placeholder="United States Dollar"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Symbol</label>
                  <input
                    type="text"
                    value={formData.symbol}
                    onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
                    className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition"
                    placeholder="$"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Exchange Rate</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={formData.rate}
                    onChange={(e) => setFormData({ ...formData, rate: e.target.value })}
                    className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition"
                    required
                  />
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <label className="flex items-center cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                  />
                  <span className="ml-3 text-sm text-gray-600 group-hover:text-gray-900 transition">Active Status</span>
                </label>

                <label className="flex items-center cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={formData.isDefault}
                    onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                  />
                  <span className="ml-3 text-sm text-gray-600 group-hover:text-gray-900 transition">Set as Default</span>
                </label>
              </div>

              <button
                type="submit"
                className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all shadow-md flex justify-center items-center gap-2 ${
                  formData.id ? "bg-emerald-600 hover:bg-emerald-700" : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {formData.id ? <Edit3 size={18} /> : <Plus size={18} />}
                {formData.id ? "Update Currency" : "Create Currency"}
              </button>
            </form>
          </div>
        </div>

        {/* TABLE COLUMN */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Currency</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Symbol</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Rate</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {currentItems.length > 0 ? (
                  currentItems.map((item) => (
                    <tr key={item.id} className={`hover:bg-gray-50 transition ${item.isDefault ? 'bg-amber-50/50' : ''}`}>
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-900">{item.code}</div>
                        <div className="text-xs text-gray-500">{item.name}</div>
                      </td>
                      <td className="px-6 py-4 text-gray-600 font-mono">{item.symbol}</td>
                      <td className="px-6 py-4 text-gray-600">{item.rate}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                          item.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        }`}>
                          {item.isActive ? "Active" : "Inactive"}
                        </span>
                        {item.isDefault && (
                          <span className="ml-2 px-2 py-1 rounded-full bg-amber-100 text-amber-700 text-[10px] font-bold uppercase">
                            Default
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleEdit(item)}
                          className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                        >
                          <Edit3 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-10 text-center text-gray-400">
                      {loading ? "Loading..." : "No currencies found."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Pagination UI */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
              <span className="text-sm text-gray-500">
                Page {currentPage} of {totalPages || 1}
              </span>
              <div className="flex gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => p - 1)}
                  className="p-2 border rounded bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ArrowLeft size={16} />
                </button>
                <button
                  disabled={currentPage === totalPages || totalPages === 0}
                  onClick={() => setCurrentPage(p => p + 1)}
                  className="p-2 border rounded bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Currency;