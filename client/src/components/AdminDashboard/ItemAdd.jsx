import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";

const API_URL = "http://localhost:4001/api";
const IMAGE_BASE = "http://localhost:4001";

export const ItemManagement = () => {
  const initialForm = {
    itemName: "",
    itemCode: "",
    description: "",
    unitPrice: "", 
    stockQty: "",
    categoryId: "",
    uomId: "",
    isActive: true,
    isTaxable: false,
    transactionAllowed : true,
  };

  const [items, setItems] = useState([]);
  const [uom, setUom] = useState([]);
  const [formData, setFormData] = useState(initialForm);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);
  const [categories, setCategories] = useState([]);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [itemsRes, uomRes, catRes] = await Promise.all([
        axios.get(`${API_URL}/allitems`),
        axios.get(`${API_URL}/uomsactive`),
        axios.get(`${API_URL}/activecategory`),
      ]);
      setItems(itemsRes.data || []);
      setUom(uomRes.data || []);
      setCategories(catRes.data || []);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const resetForm = () => {
    setEditId(null);
    setFormData(initialForm);
    setFile(null);
  };

  const startEdit = (item) => {
    // Note: This logic loads the first price level into the form for editing.
    const firstPrice = item.priceLevels && item.priceLevels.length > 0 ? item.priceLevels[0] : null;
    
    setEditId(item.id);
    setFormData({
      itemName: item.itemName,
      itemCode: item.itemCode,
      description: item.description || "",
      unitPrice: firstPrice ? firstPrice.unitPrice : "",
      stockQty: item.stockQty,
      categoryId: firstPrice ? firstPrice.categoryId : "",
      uomId: item.uomId,
      isActive: item.isActive,
      isTaxable: item.isTaxable,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("Please log in to perform this action.");
      setLoading(false);
      return;
    }

    const data = new FormData();
    Object.keys(formData).forEach((key) => data.append(key, formData[key]));
    if (file) data.append("image", file);

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      };

      if (editId) {
        await axios.put(`${API_URL}/updateitem/${editId}`, data, config);
      } else {
        await axios.post(`${API_URL}/additem`, data, config);
      }

      resetForm();
      fetchData();
      alert("Success!");
    } catch (error) {
      alert(error.response?.data?.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Deactivate this item?")) return;
    const token = localStorage.getItem("authToken");
    try {
      await axios.delete(`${API_URL}/disactiveitem/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchData();
    } catch (error) {
      alert("Action failed");
    }
  };

  const groupedCategories = categories.reduce((acc, cat) => {
    if (!acc[cat.categoryName]) {
      acc[cat.categoryName] = [];
    }
    acc[cat.categoryName].push(cat);
    return acc;
  }, {});

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-8 text-slate-700 font-sans">
      {/* --- FORM SECTION --- */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-lg border border-slate-200">
        <h3 className="font-bold text-xl mb-6 flex items-center gap-2">
          {editId ? "📝 Edit Product" : "➕ Register New Product"}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
          <div className="space-y-4">
            <input name="itemName" placeholder="Product Name" value={formData.itemName} onChange={handleInputChange} required className="w-full border rounded-lg p-2.5 outline-indigo-500 bg-slate-50/50" />
            <input name="itemCode" placeholder="Item Code" value={formData.itemCode} onChange={handleInputChange} required className="w-full border rounded-lg p-2.5 outline-indigo-500 bg-slate-50/50" />
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={formData.isTaxable} name="isTaxable" id="isTaxable" onChange={handleInputChange} />
                <label htmlFor="isTaxable" className="text-xs font-bold text-slate-500 uppercase cursor-pointer">Is Taxable</label>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={formData.isActive} name="isActive" id="isActive" onChange={handleInputChange} />
                <label htmlFor="isActive" className="text-xs font-bold text-slate-500 uppercase cursor-pointer">Is Active</label>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={formData.transactionAllowed} name="transactionAllowed" id="transactionAllowed" onChange={handleInputChange} />
                <label htmlFor="transactionAllowed" className="text-xs font-bold text-slate-500 uppercase cursor-pointer">Allow Transactions</label>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <textarea name="description" placeholder="Description" value={formData.description} onChange={handleInputChange} className="w-full border rounded-lg p-2.5 h-20 resize-none outline-indigo-500 bg-slate-50/50" />
            <div className="grid grid-cols-2 gap-2">
              <select name="uomId" value={formData.uomId} onChange={handleInputChange} required className="w-full border rounded-lg p-2.5 outline-indigo-500 bg-slate-50/50">
                <option value="">Select UOM</option>
                {uom.map((u) => <option key={u.id} value={u.id}>{u.uomName}</option>)}
              </select>
              <input type="number" name="stockQty" placeholder="Stock Qty" value={formData.stockQty} onChange={handleInputChange} required className="w-full border rounded-lg p-2.5 outline-indigo-500 bg-slate-50/50" />
              <select name="categoryId" value={formData.categoryId} onChange={handleInputChange} required className="w-full border rounded-lg p-2.5 outline-indigo-500 bg-slate-50/50 col-span-2">
                <option value="">Select Category & Grade</option>
                {Object.keys(groupedCategories).map((groupName) => (
                  <optgroup key={groupName} label={groupName}>
                    {groupedCategories[groupName].map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.categoryName} - {cat.subCategory}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
              <input type="number" step="0.01" name="unitPrice" placeholder="Price" value={formData.unitPrice} onChange={handleInputChange} required className="w-full border rounded-lg p-2.5 outline-indigo-500 bg-slate-50/50 col-span-2" />
            </div>
          </div>

          <div className="space-y-4">
            <div className="border-2 border-dashed rounded-lg p-8 text-center relative hover:bg-slate-50 transition border-slate-200">
              <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => setFile(e.target.files[0])} />
              <p className="text-xs font-bold uppercase text-slate-400">{file ? file.name : "Click to upload image"}</p>
            </div>
            {file && <div className="bg-slate-50 p-2 rounded-lg border border-slate-100 flex justify-center"><img src={URL.createObjectURL(file)} alt="Preview" className="h-20 w-auto rounded" /></div>}
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button type="submit" disabled={loading} className="flex-1 bg-indigo-600 text-white font-black py-3 rounded-lg hover:bg-indigo-700 transition">
            {loading ? "PROCESSING..." : editId ? "UPDATE PRODUCT" : "PUBLISH PRODUCT"}
          </button>
          {editId && <button type="button" onClick={resetForm} className="px-6 bg-slate-100 text-slate-500 rounded-lg hover:bg-slate-200 transition font-bold text-xs uppercase">Cancel</button>}
        </div>
      </form>

      {/* --- TABLE SECTION --- */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden text-sm">
        <div className="p-5 border-b bg-slate-50/50 flex justify-between items-center">
          <h2 className="font-bold text-slate-800 text-lg">Inventory List</h2>
          <span className="text-[11px] font-bold bg-white px-3 py-1 border border-slate-200 rounded-full text-indigo-500 uppercase">{items.length} Items</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b text-[10px] uppercase font-black text-slate-400">
              <tr>
                <th className="p-4">Product Details</th>
                <th className="p-4">Stock & Unit</th>
                <th className="p-4">Prices by Grade & Category</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((item) => {
                return (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors align-top">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded bg-slate-100 overflow-hidden border border-slate-200 flex-shrink-0">
                          {item.imageUrl ? <img src={`${IMAGE_BASE}${item.imageUrl}`} className="w-full h-full object-cover" alt="" /> : <div className="w-full h-full flex items-center justify-center text-[8px]">NO IMG</div>}
                        </div>
                        <div>
                          <p className="font-bold text-slate-700 leading-none mb-1">{item.itemName}</p>
                          <span className="text-[10px] text-slate-400 font-mono">{item.itemCode}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-700">{item.stockQty}</span>
                        <span className="text-[10px] text-slate-400 uppercase font-semibold">{item.uom?.uomName}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-2">
                        {item.priceLevels && item.priceLevels.length > 0 ? (
                          item.priceLevels.map((pl) => (
                            <div key={pl.id} className="flex items-center justify-between bg-slate-50 px-2 py-1 rounded border border-slate-100 min-w-[180px]">
                              <div className="flex flex-col">
                                <span className="text-[9px] font-black text-indigo-600 uppercase leading-tight">
                                  {pl.category?.categoryName}
                                </span>
                                <span className="text-[10px] text-slate-500 font-medium">
                                  {pl.category?.subCategory}
                                </span>
                              </div>
                              <span className="font-bold text-slate-800 ml-4">
                                ${Number(pl.unitPrice).toFixed(2)}
                              </span>
                            </div>
                          ))
                        ) : (
                          <span className="text-slate-400 italic text-[11px]">No prices set</span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-center space-x-2">
                      <button onClick={() => startEdit(item)} className="text-indigo-600 bg-indigo-50 hover:bg-indigo-600 hover:text-white px-3 py-1 rounded-md text-[10px] font-bold uppercase transition-colors">Edit</button>
                      <button onClick={() => handleDelete(item.id)} className="text-rose-600 bg-rose-50 hover:bg-rose-600 hover:text-white px-3 py-1 rounded-md text-[10px] font-bold uppercase transition-colors">Disable</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};