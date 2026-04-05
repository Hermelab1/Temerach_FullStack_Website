import React, { useEffect, useState } from 'react';
import axios from 'axios';

import { ContryCode } from '../data/contrycode';

const countryCodes = ContryCode;
const TAX_RATE = 0.15;

const Orderd = () => {


  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  


  const [formData, setFormData] = useState({
    name: '',
    user_email: '',
    user_phone: '',
    country_code: '+1',
    user_companyname: '',
    user_website: '',
    delivery_address: '',
  });

  const API_URL = 'http://localhost:4001/api';
  
 

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('coffeeCart')) || [];
    setCart(savedCart);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (cartId, priceLevelId) => {
    const updated = cart.map(item => {
      if (item.cartId === cartId) {
        const selectedLevel = item.priceLevels.find(pl => pl.id === parseInt(priceLevelId));
        return {
          ...item,
          selectedPriceLevelId: priceLevelId,
          categoryId: selectedLevel.categoryId,
          price: selectedLevel.unitPrice
        };
      }
      return item;
    });

    setCart(updated);
    localStorage.setItem('coffeeCart', JSON.stringify(updated));
  };

  const updateQuantity = (cartId, newQty) => {
    const updated = cart.map(item =>
      item.cartId === cartId
        ? { ...item, quantity: Math.max(1, parseInt(newQty)) }
        : item
    );

    setCart(updated);
    localStorage.setItem('coffeeCart', JSON.stringify(updated));
  };

  const removeItem = (cartId) => {
    const updated = cart.filter(item => item.cartId !== cartId);
    setCart(updated);
    localStorage.setItem('coffeeCart', JSON.stringify(updated));
  };

  const getSubtotal = () =>
    cart.reduce((acc, item) => acc + (parseFloat(item.price || 0) * item.quantity), 0);

  const getTotalTax = () =>
    cart.reduce((acc, item) => {
      if (item.isTaxable) {
        return acc + (parseFloat(item.price || 0) * item.quantity * TAX_RATE);
      }
      return acc;
    }, 0);

  const getGrandTotal = () => getSubtotal() + getTotalTax();

const handleSubmit = async (e) => {
  e.preventDefault();

  if (cart.length === 0) {
    alert("Cart empty");
    return;
  }

  try {
    setLoading(true);

    const invalidItems = cart.filter(item => item.transactionAllowed === false);

    if (invalidItems.length > 0) {
      const names = invalidItems.map(i => i.itemName).join(", ");
      alert(`Transaction not allowed for: ${names}`);
      return;
    }

    // 🔹 2. CREATE ORDER
    const orderPayload = {
      customerName: formData.name,
      customerEmail: formData.user_email,
      companyName: formData.user_companyname,
      website: formData.user_website,
      phone: formData.user_phone,
      deliveryAddress: formData.delivery_address,
      items: cart.map(item => ({
        itemId: item.id,
        categoryId: item.categoryId,
        uomId: item.uomId,
        quantity: item.quantity,
        unitprice: item.price
      }))
    };

    const orderRes = await axios.post(`${API_URL}/addorders`, orderPayload);

    const { orderNumber } = orderRes.data;

    // 🔹 3. CREATE SIGNATURE (SAFE NOW)
    const res = await axios.post(`${API_URL}/signature`, {
      orderId: orderNumber,
      amount: getGrandTotal(),
      currency: "USD",
    });

    const { fields, signature, endpoint } = res.data;

    // 🔹 4. SUBMIT PAYMENT FORM
    const form = document.createElement("form");
    form.method = "POST";
    form.action = endpoint;

    Object.keys(fields).forEach((key) => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = key;
      input.value = fields[key];
      form.appendChild(input);
    });

    const sig = document.createElement("input");
    sig.type = "hidden";
    sig.name = "signature";
    sig.value = signature;
    form.appendChild(sig);

    document.body.appendChild(form);
    form.submit();

  } catch (err) {
    console.error(err);
    alert(err.response?.data?.message || "Payment failed");
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="container mx-auto px-4 py-10 mt-16">
      <h2 className="text-3xl font-serif text-[#3e1c08] mb-8 text-center border-b pb-4">Order Review & Checkout</h2>
      
      <div className="flex flex-col lg:flex-row gap-10">
        <div className="flex-1">
          <h3 className="text-xl font-bold mb-4 text-[#3e1c08]">Your Selection ({cart.length} items)</h3>
          {cart.length > 0 ? cart.map((item) => (
            <div key={item.cartId} className="flex gap-4 border-b py-6 items-start bg-white p-4 mb-2 rounded shadow-sm">
              <img 
                src={item.image?.startsWith('http') ? item.image : `http://localhost:4001${item.image}`} 
                alt={item.itemName} 
                className="w-24 h-24 object-cover rounded border" 
              />
              
              <div className="flex-1">
                <div className="flex items-center gap-2">
                    <h4 className="font-bold text-gray-800 text-lg">{item.itemName}</h4>
                    {item.isTaxable && (
                        <span className="text-[9px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-bold uppercase">Taxable</span>
                    )}
                </div>
                <p className="text-xs text-gray-400 mb-2">Code: {item.itemCode}</p>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Processing & Grade</label>
                  <select 
                    value={item.selectedPriceLevelId || ""} 
                    onChange={(e) => handleCategoryChange(item.cartId, e.target.value)}
                    className="border p-2 rounded text-sm bg-gray-50 outline-none w-full max-w-xs"
                    required
                  >
                    <option value="" disabled>Select Coffee Grade...</option>
                    {item.priceLevels?.map((level) => (
                      <option key={level.id} value={level.id}>
                        {level.category?.categoryName} - {level.category?.subCategory}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex flex-col items-end gap-3 min-w-[120px]">
                <div className="text-right">
                    <p className="text-[10px] text-gray-400 uppercase font-bold">Unit Price</p>
                    <p className="text-2xl font-bold text-[#3e1c08]">
                        ${item.price ? parseFloat(item.price).toFixed(2) : "0.00"}
                    </p>
                </div>
                <div className="flex items-center border rounded overflow-hidden">
                   <input 
                    type="number" 
                    value={item.quantity} 
                    onChange={(e) => updateQuantity(item.cartId, e.target.value)}
                    className="w-12 p-1 text-center font-bold focus:outline-none"
                    min="1"
                   />
                   <span className="px-2 py-1 bg-gray-100 text-[10px] font-bold text-gray-500 border-l">
                    {item.uom?.uomName || 'KG'}
                   </span>
                </div>
                <button onClick={() => removeItem(item.cartId)} className="text-red-500 text-[10px] hover:bg-transparent bg-transparent font-bold uppercase hover:underline">Remove</button>
              </div>
            </div>
          )) : (
            <div className="text-center py-16 bg-gray-50 rounded border-dashed border-2">
              <p className="text-gray-500 italic">Your cart is currently empty.</p>
            </div>
          )}
          
          {cart.length > 0 && (
            <div className="mt-6 p-6 bg-white rounded border shadow-sm space-y-2">
                <div className="flex justify-between items-center text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-bold">${getSubtotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-gray-600">
                    <span>VAT (15%)</span>
                    <span className="font-bold">${getTotalTax().toFixed(2)}</span>
                </div>
                <div className="border-t pt-3 flex justify-between items-center">
                    <span className="text-lg font-bold text-[#3e1c08]">GRAND TOTAL</span>
                    <span className="text-4xl font-bold text-[#3e1c08]">${getGrandTotal().toFixed(2)}</span>
                </div>
            </div>
          )}
        </div>

        <div className="lg:w-1/3 bg-white p-6 shadow-2xl border rounded-lg h-fit sticky top-24">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <h3 className="text-xl font-bold border-b pb-3 text-[#3e1c08]">Shipping Info</h3>
            <div className="space-y-3">
                <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required className="w-full border p-3 rounded text-sm" />
                <input type="email" name="user_email" placeholder="Email Address" value={formData.user_email} onChange={handleChange} required className="w-full border p-3 rounded text-sm" />
                <div className="flex gap-2">
                    <select name="country_code" value={formData.country_code} onChange={handleChange} className="border p-3 rounded w-1/3 text-xs bg-gray-50">
                        {countryCodes.map((c, i) => <option key={i} value={c.code}>{c.flag} {c.code}</option>)}
                    </select>
                    <input type="tel" name="user_phone" placeholder="Phone" value={formData.user_phone} onChange={handleChange} required className="border p-3 rounded w-full text-sm" />
                </div>
                <input type="text" name="user_companyname" placeholder="Company Name" value={formData.user_companyname} onChange={handleChange} required className="w-full border p-3 rounded text-sm" />
                <textarea name="delivery_address" placeholder="Shipping Address" value={formData.delivery_address} onChange={handleChange} required className="w-full border p-3 rounded h-28 text-sm resize-none" />
            </div>
            <button 
              type="submit" 
              disabled={loading || cart.length === 0}
              className="bg-[#3e1c08] text-white p-4 rounded-sm font-bold uppercase text-xs tracking-widest hover:bg-[#2a1306] disabled:bg-gray-300 transition-all"
            >
              {loading ? 'Processing...' : 'Confirm & Pay'}
            </button>
          </form>
        </div>
      </div>
      
    </div>
    
  );
};

export default Orderd;