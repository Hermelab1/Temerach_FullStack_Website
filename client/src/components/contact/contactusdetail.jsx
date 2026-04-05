// Import necessary libraries and components
import React, { useRef, useState} from 'react';
import img from '../../asset/img/CoverImages/Bcover.webp';
//import { useNavigate } from 'react-router-dom';
import Heading from '../Home/headings';
import Footer from '../footage/footage';
import emailjs from '@emailjs/browser';
import { motion } from 'framer-motion';
import axios from 'axios';

const API_URL = 'http://localhost:4001/api';
// Define animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0 }
};

const ContactUsDetail = () => {
  const form = useRef();
 // const navigate = useNavigate();
  const [formData, setFormData] = useState({
    FullName: '',
    CompanyName: '',
    Phone: '',
    Websites: '',
    Email: '',
    Memo: '',
  });

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    // FIX: Pass formData as the second argument here
    const response = await axios.post(`${API_URL}/addcontactus`, formData);

    if (response.status === 201) {
      console.log('Data saved successfully');
      alert('Message sent successfully!');

      // Send email via EmailJS
      await emailjs.sendForm('service_w6blv2o', 'template_lb47k4j', form.current, 'Puv041KtiA_TZduH2');

      // Reset form
      setFormData({
        FullName: '',
        CompanyName: '',
        Phone: '',
        Websites: '',
        Email: '',
        Memo: '',
      });
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Something went wrong. Please try again.');
  }
};

  return (
    <>
      <section>
        <motion.div
          className="covers"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ duration: 0.5 }}
        >
          <div className='imgs'>
            <img src={img} alt="Location" />
          </div>
          <div className='slogan'>
            <Heading title="Get in Touch" subtitle="Temerachi Coffee Export" />
          </div>
        </motion.div>

        <motion.div
          className="container mx-auto lg:my-8 md:my-4 my-4 flex flex-wrap justify-center items-center xl:gap-20 lg:gap-14 md:gap-0  gap-0"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-row w-full xl:w-[35%] lg:w-[40%] md:w-[45%] text-center lg:mx-8 md:mx-2 mx-6 lg:my-12  md:my-4 my-4">
            <form ref={form} onSubmit={handleSubmit}>
            <input className='inputs' type="text" name="FullName" value={formData.FullName} onChange={handleChange} placeholder='Full Name' required />
            <input className='inputs' type="text" name="CompanyName" value={formData.CompanyName} onChange={handleChange} placeholder='Company Name' />
            <input className='inputs' type="text" name="Phone" value={formData.Phone} onChange={handleChange} placeholder='Phone Number' />
            <input className='inputs' type="text" name="Websites" value={formData.Websites} onChange={handleChange} placeholder='Website' />
            <input className='inputs' type="email" name="Email" value={formData.Email} onChange={handleChange} placeholder='Email' required />
            <textarea className='inputs' name="Memo" value={formData.Memo} onChange={handleChange} cols="20" rows="8" placeholder='Leave your message here' required></textarea>
            <button className="p-3 bg-[#105F4E] text-white" type="submit">Send Message</button> </form>
            {/* {statusMessage && <p>{statusMessage}</p>}  Displays success or error messages */}
          </div>

          <div className=''>
          <div className="lg:mx-6 md:mx-2 ">
            <p className='text-center leading-[2rem]'>
              <b>HEAD OFFICE:</b><br />
              Kirkos Sub City Woreda 11 House No. 195/A<br />
              Addis Ababa, Ethiopia<br />
              Tel: +251911426480<br />
              <b>Warehouse:</b><br />
              Guji Coffee Export and Processing Factory<br />
              Furi, Sheger Oromia, ETHIOPIA<br />
              Email: info@temerachicoffeeexport.com<br />
            </p>
          </div>
          <div className='mx-6'>
            <p className='text-center leading-[2rem]'>
              <b>Business Partner</b><br />
              Asia/Japan<br />
              Selam Store Trading LLC<br />
              4-32-4 Asakusa, Taito-ku Tokyo<br />
              Japan<br />
            </p>
            <div className="titles">
              <h3 className="text-2xl text-center font-extralight my-2">Reach us</h3>
            </div>
            <div className="flex justify-center mt-4 gap-4">
              <a href="https://www.facebook.com/Temerachixoffeeexport?mibextid=ZbWKwL" target="_blank" rel="noopener noreferrer" className="text-2xl text-white bg-[#105F4E] px-2 py-1">
                <i className="fa-brands fa-facebook"></i>
              </a>
              <a href="https://x.com/Dawitgi90612574" target="_blank" rel="noopener noreferrer" className="text-2xl  bg-[#105F4E] text-white px-2 py-1">
                <i className="fa-brands fa-x-twitter"></i>
              </a>
              <a href="https://www.instagram.com/temerachicoffee?igsh=OTA3aGFocjFmbTVp" target="_blank" rel="noopener noreferrer" className="text-2xl text-white  bg-[#105F4E] px-2 py-1">
                <i className="fa-brands fa-instagram"></i>
              </a>
            </div>
          </div>
          </div>
        </motion.div>
        <Footer />
      </section>
    </>
  );
};

export default ContactUsDetail;