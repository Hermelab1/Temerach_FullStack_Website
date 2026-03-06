import React, { useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import emailjs from '@emailjs/browser';

const API_URL = 'http://localhost:4001/api';

const Contact = () => {
  const form = useRef();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    FullName: '',
    CompanyName: '',
    Phone: '',
    Websites: '',
    Email: '',
    Memo: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 1. Save to Database
      const response = await axios.post(`${API_URL}/addcontactus`, formData);

      if (response.status === 201) {
        // 2. Send Email via EmailJS
        // Note: form.current sends the actual HTML input values
        await emailjs.sendForm(
          'service_w6blv2o', 
          'template_lb47k4j', 
          form.current, 
          'Puv041KtiA_TZduH2'
        );

        alert('Message sent successfully!');

        // 3. Reset State and HTML Form
        setFormData({
          FullName: '',
          CompanyName: '',
          Phone: '',
          Websites: '',
          Email: '',
          Memo: '',
        });
        form.current.reset();
      }
    } catch (error) {
      console.error('Submission Error:', error);
      alert('Error: ' + (error.response?.data?.message || 'Something went wrong'));
    }
  };

  const handleScrollToTopAndNavigate = (path) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => navigate(path), 500);
  };

  return (
    <section className="bg-[#f8f9fa] text-center py-10">
      <div className="container mx-auto flex flex-wrap justify-center gap-6 items-start">
        {/* Form Section */}
        <div className="xl:w-[23%] lg:w-[25%] md:w-[40%] w-[80%] mx-2">
          <form ref={form} onSubmit={handleSubmit} className='flex flex-col gap-3'>
            <input className='p-2 border border-gray-300' type="text" name="FullName" value={formData.FullName} onChange={handleChange} placeholder='Full Name' required />
            <input className='p-2 border border-gray-300' type="text" name="CompanyName" value={formData.CompanyName} onChange={handleChange} placeholder='Company Name' />
            <input className='p-2 border border-gray-300' type="text" name="Phone" value={formData.Phone} onChange={handleChange} placeholder='Phone Number' />
            <input className='p-2 border border-gray-300' type="text" name="Websites" value={formData.Websites} onChange={handleChange} placeholder='Website' />
            <input className='p-2 border border-gray-300' type="email" name="Email" value={formData.Email} onChange={handleChange} placeholder='Email' required />
            <textarea className='p-2 border border-gray-300' name="Memo" value={formData.Memo} onChange={handleChange} rows="4" placeholder='Leave your message here' required></textarea>
            <button className="p-3 bg-[#105F4E] text-white font-bold hover:bg-[#0d4d3f] transition" type="submit">Send Message</button>
          </form>  
        </div>

        <div className="hidden md:block w-[1px] bg-[#c7c5c5] h-[350px]"></div>

        {/* Address Section */}
        <div className="text-center px-4 max-w-sm">
            <p className="leading-relaxed">
              <span className="font-bold">HEAD OFFICE:</span><br />
              Kirkos Sub City Woreda 11 House No. 195/A<br />
              Addis Ababa, Ethiopia<br />
              Tel: +251911426480<br /><br />
              <span className="font-bold">Warehouse:</span><br />
              Guji Coffee Export and Processing Factory<br />
              Furi, Sheger Oromia, ETHIOPIA<br />
              Email: info@temerachicoffeeexport.com
            </p>
        </div>

        <div className="hidden lg:block w-[1px] bg-[#c7c5c5] h-[350px]"></div>

        {/* Navigation & Socials */}
        <div className='px-4'>
          <p className='font-bold mb-2'>Business Partner</p>
          <p className="text-sm mb-4">Asia/Japan<br />Selam Store Trading LLC<br />Tokyo, Japan</p>
          
          <h3 className="text-xl font-light mb-3">Reach us</h3>
          <div className="flex justify-center gap-4 mb-6">
            <a href="https://facebook.com" className="bg-[#105F4E] text-white p-2 rounded"><i className="fa-brands fa-facebook"></i></a>
            <a href="https://twitter.com" className="bg-[#105F4E] text-white p-2 rounded"><i className="fa-brands fa-x-twitter"></i></a>
            <a href="https://instagram.com" className="bg-[#105F4E] text-white p-2 rounded"><i className="fa-brands fa-instagram"></i></a>
          </div>

          <h3 className="text-xl font-light mb-2">Navigation</h3>
          <div className="flex flex-col text-[#105F4E] font-medium"> 
            <Link onClick={() => handleScrollToTopAndNavigate('/ourstory')} className="hover:underline">Our Story</Link>
            <Link onClick={() => handleScrollToTopAndNavigate('/blog')} className="hover:underline">Blog</Link>
            <Link onClick={() => handleScrollToTopAndNavigate('/sampleorder')} className="hover:underline">Order Sample</Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;