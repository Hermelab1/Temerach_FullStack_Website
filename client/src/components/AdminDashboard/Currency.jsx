import React, { useEffect, useState } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const API_URL = "http://localhost:4001/api";

const Currency = ({ username }) => {
  const initialFormData = {
    id: null,
    currencycode: "",
    currencyname: "",
    currencydescription: "",
    rate: "",
    isactive: 0,
  };

  const [currencies, setCurrencies] = useState([]);
  const [formData, setFormData] = useState(initialFormData);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [selectedCurrency, setSelectedCurrency] = useState(null);
  const [isAuthorized, setIsAuthorized] = useState(true);

  /* ================= AUTH + FETCH ================= */
  useEffect(() => {
    if (!username) {
      setIsAuthorized(false);
      return;
    }

    fetchCurrencies();
  }, [username]);

  const fetchCurrencies = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) return toast.error("Please login again");

    try {
      const res = await axios.get(`${API_URL}/currency`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCurrencies(res.data || []);
    } catch {
      toast.error("Failed to load currency list");
      setCurrencies([]);
    }
  };

  if (!isAuthorized) return <Navigate to="/login" />;

  /* ================= EDIT ================= */
  const handleEdit = (currency) => {
    setFormData({
      id: currency.id,
      currencycode: currency.currencycode,
      currencyname: currency.currencyname,
      currencydescription: currency.currencydescription,
      rate: currency.rate,
      isactive: currency.isactive,
    });
    setSelectedCurrency(currency);
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("authToken");
    if (!token) return toast.error("Please login again");

    try {
      if (formData.id) {
        await axios.put(`${API_URL}/currency/${formData.id}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Currency updated successfully");
      } else {
        await axios.post(`${API_URL}/currency`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Currency created successfully");
      }

      setFormData(initialFormData);
      setSelectedCurrency(null);
      fetchCurrencies();
    } catch (error) {
      toast.error(error.response?.data?.message || "Save failed");
    }
  };

  /* ================= CHECKBOX ================= */
  const handleCheckboxChange = (e) => {
    setFormData({ ...formData, isactive: e.target.checked ? 1 : 0 });
  };

  /* ================= PAGINATION ================= */
  const indexOfLast = currentPage * itemsPerPage;
  const currentItems = currencies.slice(
    indexOfLast - itemsPerPage,
    indexOfLast
  );
  const totalPages = Math.ceil(currencies.length / itemsPerPage);

  return (
    <section className="adminsection">
      {/* ================= TABLE CARD ================= */}
      <div className="card1">
        <table className="min-w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2">Code</th>
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Description</th>
              <th className="border px-4 py-2">Rate</th>
              <th className="border px-2 py-2">Active</th>
              <th className="border px-2 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length ? (
              currentItems.map((item) => (
                <tr key={item.id}>
                  <td className="border px-4 py-2">{item.currencycode}</td>
                  <td className="border px-4 py-2">{item.currencyname}</td>
                  <td className="border px-4 py-2">
                    {item.currencydescription}
                  </td>
                  <td className="border px-4 py-2">{item.rate}</td>
                  <td className="border px-2 py-2">
                    {item.isactive ? "Yes" : "No"}
                  </td>
                  <td className="border px-2 py-2">
                    <button
                      className="bg-inherit text-[#105F4E] px-2"
                      onClick={() => handleEdit(item)}
                    >
                      <i className="fa-solid fa-marker"></i>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-4">
                  No data found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* PAGINATION */}
        <div className="pagination absolute bottom-0 left-0 right-0 flex justify-center gap-6 mb-2">
          <button
            className={`border rounded px-2 py-1 ${
              currentPage === 1
                ? "cursor-not-allowed bg-gray-100 text-gray-600"
                : "bg-blue-500 text-white"
            }`}
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
          >
            <i className="fa-solid fa-arrow-left"></i>
          </button>

          <button
            className={`border rounded px-2 py-1 ${
              currentPage === totalPages
                ? "cursor-not-allowed bg-gray-100 text-gray-600"
                : "bg-blue-500 text-white"
            }`}
            onClick={() =>
              setCurrentPage((p) => Math.min(p + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            <i className="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      </div>

      {/* ================= FORM CARD ================= */}
      <div className="card2">
        <h1 className="text-xl mb-4">
          {selectedCurrency ? "EDIT CURRENCY" : "ADD NEW CURRENCY"}
        </h1>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Currency Code"
            value={formData.currencycode}
            onChange={(e) =>
              setFormData({ ...formData, currencycode: e.target.value })
            }
            required
            className="border rounded p-2 mb-2 w-full"
          />

          <input
            type="text"
            placeholder="Currency Name"
            value={formData.currencyname}
            onChange={(e) =>
              setFormData({ ...formData, currencyname: e.target.value })
            }
            required
            className="border rounded p-2 mb-2 w-full"
          />

          <textarea
            placeholder="Description"
            value={formData.currencydescription}
            onChange={(e) =>
              setFormData({
                ...formData,
                currencydescription: e.target.value,
              })
            }
            className="border rounded p-2 mb-2 w-full h-20"
          />

          <input
            type="number"
            placeholder="Rate"
            value={formData.rate}
            onChange={(e) =>
              setFormData({ ...formData, rate: e.target.value })
            }
            required
            className="border rounded p-2 mb-2 w-full"
          />

          <label className="py-4 block">
            <input
              type="checkbox"
              checked={formData.isactive === 1}
              onChange={handleCheckboxChange}
            />{" "}
            Is Active
          </label>

          <button
            type="submit"
            className={`text-white rounded px-4 py-2 ${
              selectedCurrency ? "bg-[#105F4E]" : "bg-blue-500"
            }`}
          >
            {selectedCurrency ? "Update Currency" : "Create Currency"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default Currency;
