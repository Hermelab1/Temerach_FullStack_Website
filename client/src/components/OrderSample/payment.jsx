import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import MasterCard from '../../asset/img/Payment/Mastercard.png';
import Telebirr from '../../asset/img/Payment/Telebirr.png';

const PaymentOrder = () => {
  const location = useLocation();
  const { image, coffeeType, description, amount } = location.state || {};

  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('MasterCard');
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    let paymentData = {}; 
    setMessage('');
  
    if (paymentMethod === 'MasterCard') {
      if (!cardNumber || !expiryDate || !cvv) {
        setMessage('Please fill in all card details');
        return;
      }

      // Extract expirationMonth and expirationYear safely
      const dateParts = expiryDate.split('-');
      const year = dateParts[0];
      const month = dateParts[1];
  
      paymentData = {
        cardNumber,
        expirationMonth: month,
        expirationYear: year,
        securityCode: cvv,
        amount,
        currency,
      };
    } else if (paymentMethod === 'Telebirr') {
      if (!phone) {
        setMessage('Please enter your phone number');
        return;
      }
  
      paymentData = {
        phone,
        amount,
        currency,
      };
    }
  
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:4001/api/payment', paymentData);
      if (response.data.success) {
          setMessage('Payment Successful!');
      } else {
          setMessage('Payment Failed: ' + (response.data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Payment error:', error);
      setMessage('Error processing payment. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className='flex flex-col lg:flex-row gap-12 p-4 w-[90%] lg:w-[70%] mx-auto justify-center items-start'>
        
        {/* Payment Form Section */}
        <div className='border bg-white shadow-lg p-6 w-full lg:w-1/2 rounded-lg'>
          <h2 className="text-2xl font-bold mb-6">Checkout</h2>
          
          <div className='flex gap-4 mb-8'>
            <div 
              className={`w-1/4 cursor-pointer p-2 rounded border-2 transition-all ${paymentMethod === 'MasterCard' ? 'border-blue-500 bg-blue-50' : 'border-transparent hover:bg-gray-100'}`} 
              onClick={() => setPaymentMethod('MasterCard')}
            >
              <img src={MasterCard} alt="MasterCard" className="w-full object-contain" />
            </div>
            <div 
              className={`w-1/4 cursor-pointer p-2 rounded border-2 transition-all ${paymentMethod === 'Telebirr' ? 'border-blue-500 bg-blue-50' : 'border-transparent hover:bg-gray-100'}`} 
              onClick={() => setPaymentMethod('Telebirr')}
            >
              <img src={Telebirr} alt="Telebirr" className="w-full object-contain" />
            </div>
          </div>

          {paymentMethod === 'MasterCard' && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg border-b pb-2">Card Information</h3>
              <div className='grid grid-cols-2 gap-4'>
                <div className="col-span-1">
                  <label className="text-sm text-gray-600">First Name</label>
                  <input type="text" name="firstname" placeholder='First Name' className="w-full border p-2 rounded mt-1" />
                </div>
                <div className="col-span-1">
                  <label className="text-sm text-gray-600">Last Name</label>
                  <input type="text" name="lastname" placeholder='Last Name' className="w-full border p-2 rounded mt-1" />
                </div>
                <div className="col-span-2">
                  <label className="text-sm text-gray-600">Card Number</label>
                  <input
                    className='w-full border p-2 rounded mt-1'
                    type='text'
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    maxLength='16'
                    placeholder='1234 5678 9012 3456'
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Expiry Date</label>
                  <input
                    className='w-full border p-2 rounded mt-1'
                    type='month'
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">CVV</label>
                  <input
                    className='w-full border p-2 rounded mt-1'
                    type='password'
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    maxLength='3'
                    placeholder='123'
                  />
                </div>
              </div>
            </div>
          )}

          {paymentMethod === 'Telebirr' && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg border-b pb-2">Telebirr Account</h3>
              <div>
                <label className="text-sm text-gray-600">Phone Number</label>
                <input
                  className='w-full border p-2 rounded mt-1'
                  type='tel'
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder='0912...'
                />
              </div>
            </div>
          )}

          <div className="mt-8 pt-4 border-t">
            <div className="flex justify-between items-center mb-4">
               <span className="text-gray-600">Currency</span>
               <select className='border p-1 rounded' value={currency} onChange={(e) => setCurrency(e.target.value)}>
                  <option value='USD'>USD</option>
                  <option value='EUR'>EUR</option>
                  <option value='GBP'>GBP</option>
               </select>
            </div>
            <div className="flex justify-between items-center">
               <span className="text-xl font-bold">Total Amount</span>
               <span className="text-xl font-bold text-green-700">{amount} {currency}</span>
            </div>
          </div>

          <button 
            onClick={handlePayment} 
            disabled={loading}
            className={`mt-6 w-full p-4 rounded text-white font-bold text-lg transition-all ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {loading ? 'Processing...' : `Pay ${amount} ${currency}`}
          </button>
          
          {message && (
            <p className={`mt-4 p-3 rounded text-center font-semibold ${message.includes('Successful') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {message}
            </p>
          )}
        </div>

        {/* Order Summary Side */}
        <div className='border p-6 w-full lg:w-1/3 bg-white shadow-md rounded-lg'>
          <h3 className="text-lg font-bold mb-4 border-b pb-2">Order Summary</h3>
          <img
            src={image || 'https://via.placeholder.com/150'}
            alt={coffeeType || 'Item Image'}
            className='w-full h-48 object-cover rounded shadow-sm mb-4'
          />
          <h4 className="text-xl font-serif text-[#3e1c08]">{coffeeType || 'Product Name'}</h4>
          <p className='leading-6 text-gray-600 mt-2 text-sm italic'>
            {description ? (description.length > 150 ? description.substring(0, 150) + "..." : description) : 'Description Not Available'}
          </p>
          <div className="mt-4 bg-gray-50 p-3 rounded">
            <p className="text-sm">Price per unit: <span className="float-right font-bold">${amount}</span></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentOrder;