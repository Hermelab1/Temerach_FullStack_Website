import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import emailjs from 'emailjs-com';
import axios from 'axios';
import { ContryCode } from '../data/contrycode';

const countryCodes = ContryCode;

const Orderd = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { image, code, cname, description } = location.state || {};

  const [formData, setFormData] = useState({
    name: '',
    user_email: '',
    user_phone: '',
    country_code: '+1',
    coffeeType: cname || '',
    coffeeCategory: '',
    coffeeGrade: '',
    quantity: '',
    user_companyname: '',
    user_website: '',
    delivery_address: '',
    price: '',
  });

  const [catagoryI, setCatagoryI] = useState([]);
  const [grades, setGrades] = useState({});
  const [loading, setLoading] = useState(false);

  const API_URL = 'http://localhost:4001/api';

  useEffect(() => {
    const fetchItemsAndCategories = async () => {
      try {
        const response = await axios.get(`${API_URL}/categoriesI`);
        const groupedData = response.data.reduce((acc, item) => {
          if (!acc[item.CatName]) {
            acc[item.CatName] = [];
          }
          acc[item.CatName].push({
            GradeName: item.GradeName,
            Price: item.Price,
            IsAvalible: item.IsAvalible,
          });
          return acc;
        }, {});
  
        setCatagoryI(Object.keys(groupedData));
        setGrades(groupedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchItemsAndCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleCategoryChange = (e) => {
    setFormData({
      ...formData,
      coffeeCategory: e.target.value,
      coffeeGrade: '',
      price: ''
    });
  };
  
  const handleGradeChange = (e) => {
    const selectedGrade = e.target.value;
    const gradeInfo = grades[formData.coffeeCategory]?.find(grade => grade.GradeName === selectedGrade);
    setFormData({
      ...formData,
      coffeeGrade: selectedGrade,
      price: gradeInfo ? gradeInfo.Price : '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const emailData = {
        cname: formData.coffeeType,
        coffeeCatagory: formData.coffeeCategory || "N/A",
        coffeeGrade: formData.coffeeGrade || "N/A",
        quantity: formData.quantity,
        name: formData.name,
        user_email: formData.user_email,
        user_phone: `${formData.country_code} ${formData.user_phone}`,
        user_companyname: formData.user_companyname,
        user_website: formData.user_website,
        delivery_address: formData.delivery_address,
        total_price: formData.price * formData.quantity
    };

    try {
        const orderResponse = await axios.post(`${API_URL}/addorder`, {
            orderedBy: formData.name,
            companyName: formData.user_companyname,
            website: formData.user_website,
            email: formData.user_email,
            phone: formData.user_phone,
            deliveryAddress: formData.delivery_address,
            coffeeGrade: formData.coffeeGrade,
            quantity: formData.quantity,
            orderDate: new Date().toISOString().split('T')[0],
            status: 'Ordered',
            agreewithterms: true,
        });
        
        await emailjs.send('service_w6blv2o', 'template_ys7e7mk', emailData, 'Puv041KtiA_TZduH2');

        alert('Order placed successfully!');
        
        // Navigation with consolidated data for the Payment page
        navigate('/payment', { 
            state: { 
                orderId: orderResponse.data.orderId, 
                formData, 
                image, 
                description,
                coffeeType: formData.coffeeType,
                amount: formData.price * (formData.quantity || 1) // Calculating total amount
            } 
        });

    } catch (err) {
        console.error('Failed to place order:', err);
        alert('Failed to place order, please try again.');
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="container mx-auto items-center justify-center">
      <div className='xl:w-[80%] lg:w-[90%] w-[95%] bg-white md:p-6 p-4 mx-auto shadow-xl mt-20 lg:mt-20 maxm:mt-[15%] slg:mt-[15%] border slg:gap-12 md:gap-20 gap-2 flex flex-col md:flex-row '>
        <div className="flex flex-col w-[100%] py-4">
          <div className="flex w-[100%] lg:h-[34vh] maxm:h-[20vh] slg:h-[20vh] md:h-[35vh] h-[25vh] items-center justify-center">
            <img
              src={image}
              alt={cname || 'Item Image'}
              className={`border-2 w-[50%] h-full object-cover shadow-custom transition-transform duration-300 `}
            />
          </div>
          <div className="mt-5">
            <p className='leading-7'>{description || 'Description Not Available'}</p>
          </div>
        </div>
        <div className="w-full text-left">
          <form onSubmit={handleSubmit} className="flex flex-col gap-2 py-4">
            <h3 className="text-2xl font-serif py-2 text-[#3e1c08] border-t border-b border-gray-400">
              {formData.coffeeType || 'Title Not Available'}
            </h3>
            <p className="font-semibold">Product Code: {code || 'Code Not Available'}</p>
            <p className="text-xl text-green-700 font-bold">Price: {formData.price ? `$${formData.price}` : 'Select Grade'}</p>
            
            <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Full Name" className="inputs border p-2 rounded" />
            <input type="text" name="user_companyname" value={formData.user_companyname} onChange={handleChange} required placeholder="Company Name" className="inputs border p-2 rounded" />
            <input type="text" name="user_website" value={formData.user_website} onChange={handleChange} required placeholder="Website" className="inputs border p-2 rounded" />
            <input type="email" name="user_email" value={formData.user_email} onChange={handleChange} required placeholder="Email" className="inputs border p-2 rounded" />

            <div className="flex gap-2">
              <select className='inputs border p-2 rounded' name="country_code" value={formData.country_code} onChange={handleChange} required>
                {countryCodes.map((country, index) => (
                  <option key={index} value={country.code}>
                    {country.flag} {country.code}
                  </option>
                ))}
              </select>
              <input type="tel" name="user_phone" value={formData.user_phone} onChange={handleChange} required placeholder="Phone number" className="inputs border p-2 rounded w-full" />
            </div>
            <input type="text" name="delivery_address" value={formData.delivery_address} onChange={handleChange} required placeholder="Delivery Address" className="inputs border p-2 rounded" />
            
            <div className='border-t pt-4'>
              <p className="mb-2 font-semibold">Select Category:</p>
              <div className="flex flex-wrap gap-4 mb-4">
                {catagoryI.length > 0 ? (
                  catagoryI.map((category, index) => (
                    <label key={index} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="coffeeCategory"
                        value={category}
                        onChange={handleCategoryChange}
                        checked={formData.coffeeCategory === category}
                        className="mr-2"
                      />
                      {category}
                    </label>
                  ))
                ) : (
                  <p>Loading categories...</p> 
                )}
              </div>

              {formData.coffeeCategory && (
                <div className="mb-4">
                  <select name='coffeeGrade' value={formData.coffeeGrade} onChange={handleGradeChange} required className="inputs border p-2 rounded w-full">
                    <option value="">Select Grade</option>
                    {grades[formData.coffeeCategory]?.map((grade, index) => (
                      <option key={index} value={grade.GradeName}>
                        {grade.GradeName} - ${grade.Price}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <input 
              type="number" 
              name="quantity" 
              value={formData.quantity} 
              onChange={handleChange} 
              placeholder="Quantity" 
              className="inputs border p-2 rounded" 
              required 
              min="1"
            />

            <button type="submit" disabled={loading} className="bg-[#3e1c08] text-white md:w-2/5 w-full p-3 hover:bg-opacity-90 transition-all duration-300 rounded font-bold uppercase mt-2">
              {loading ? 'Processing...' : 'Proceed to Payment'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Orderd;