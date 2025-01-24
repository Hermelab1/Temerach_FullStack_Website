import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import emailjs from 'emailjs-com';
import { Coffeetype } from '../data/Coffeetype';
import { ContryCode } from '../data/contrycode';

const countryCodes = ContryCode;

const Orderd = () => {
  const location = useLocation();
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

  const [loading, setLoading] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));

    if (name === 'coffeeCategory') {
      setFormData(prevState => ({
        ...prevState,
        coffeeCategory: value,
        coffeeGrade: '', // Reset coffeeGrade when coffeeCategory changes
        price: '',
      }));
    }

    if (name === 'coffeeGrade') {
      const selectedCoffee = Coffeetype.find(coffee => coffee.cname === formData.coffeeType);
      if (selectedCoffee) {
        const selectedCategory = selectedCoffee.catagory?.find(category => category.coffeeCatagory === formData.coffeeCategory);
        const selectedGrade = selectedCategory?.grades?.find(grade => grade.gname === value);

        if (selectedGrade) {
          setFormData(prevState => ({
            ...prevState,
            price: selectedGrade.price,
          }));
        } else {
          setFormData(prevState => ({
            ...prevState,
            price: '',
          }));
        }
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Gather the relevant data for the email
    const emailData = {
      cname: formData.coffeeType,
      coffeeCatagory: formData.coffeeCategory || "N/A",
      coffeeGrade: formData.coffeeGrade || "N/A",
      quantity: formData.quantity,
      name: formData.name,
      user_email: formData.user_email,
      country_code: formData.country_code || "N/A",
      user_phone: `${formData.country_code} ${formData.user_phone}`,
      user_companyname: formData.user_companyname,
      user_website: formData.user_website,
      delivery_address: formData.delivery_address,
    };

    emailjs.send('service_w6blv2o', 'template_ys7e7mk', emailData, 'Puv041KtiA_TZduH2')
      .then((response) => {
        alert('Order placed successfully!');
        resetForm();
      })
      .catch(err => {
        alert('Failed to place order, please try again. Error: ' + (err.text || "Unknown error"));
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const resetForm = () => {
    setFormData({
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
  };

  if (!location.state) {
    return <p>No information available. Check the console for debugging.</p>;
  }

  const selectedCoffee = Coffeetype.find(coffee => coffee.cname === formData.coffeeType);

  return (
    <div className="container mx-auto items-center justify-center">
      <div className='xl:w-[80%] lg:w-[90%] w-[95%]  bg-white md:p-6 p-4 mx-auto shadow-xl mt-20 lg:mt-20 maxm:mt-[15%] slg:mt-[15%] border  slg:gap-12 md:gap-20 gap-2 flex flex-col md:flex-row '>
        <div className="flex flex-col w-[100%] py-4">
          <div className="flex w-[100%] lg:h-[34vh] maxm:h-[20vh] slg:h-[20vh] md:h-[35vh] h-[25vh] items-center justify-center">
            {imageError ? (
              <p className="text-red-500">Image failed to load</p>
            ) : (
              <img
                src={image}
                alt={cname || 'Item Image'}
                onLoad={handleImageLoad}
                onError={handleImageError}
                className={`border-2 w-[50%] h-full object-cover shadow-custom transition-transform duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
              />
            )}
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
            <p>Product Code: {code || 'Code Not Available'}</p>
            <p>Price: {formData.price || 'Select Coffee Grade first'}</p>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Name" className="inputs" />
            <input type="text" name="user_companyname" value={formData.user_companyname} onChange={handleChange} required placeholder="Company Name" className="inputs" />
            <input type="text" name="user_website" value={formData.user_website} onChange={handleChange} required placeholder="Website" className="inputs" />
            <input type="email" name="user_email" value={formData.user_email} onChange={handleChange} required placeholder="Email" className="inputs" />
            <div className="flex gap-2">
              <select className='inputs' name="country_code" value={formData.country_code} onChange={handleChange} required>
                {countryCodes.map((country, index) => (
                  <option key={index} value={country.code}>
                    {country.flag} {country.code}
                  </option>
                ))}
              </select>
              <div className="flex items-center">-</div>
              <input type="tel" name="user_phone" value={formData.user_phone} onChange={handleChange} required placeholder="Phone number" className="inputs" />
            </div>
            <input type="text" name="delivery_address" value={formData.delivery_address} onChange={handleChange} required placeholder="Delivery Address" className="inputs" />

            {/* Render radio buttons for coffee categories */}
            {selectedCoffee?.catagory?.map((category, index) => (
              <label key={index} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="coffeeCategory"
                  value={category.coffeeCatagory}
                  checked={formData.coffeeCategory === category.coffeeCatagory}
                  onChange={handleChange}
                  className=""
                />
                {category.coffeeCatagory}
              </label>
            ))}

            <select name="coffeeGrade" value={formData.coffeeGrade} onChange={handleChange} required className="inputs">
              <option value="">Select Coffee Grade</option>
              {selectedCoffee?.catagory?.find(category => category.coffeeCatagory === formData.coffeeCategory)?.grades?.map((grade, index) => (
                <option key={index} value={grade.gname}>
                  {grade.gname}
                </option>
              ))}
            </select>

            <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} min="1" max="10" required placeholder="Quantity" className="inputs" />

            <button type="submit" disabled={loading} className="bg-gray-800 text-white md:w-2/5 sm:w-full p-3 hover:bg-gray-700 transition-all duration-300">
              {loading ? 'Ordering...' : 'Send Request'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Orderd;