import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Contacts = () => {
  const navigate = useNavigate();

  const handleScrollToTopAndNavigate = (path) => {
    window.scrollTo({ top: 0 });

    setTimeout(() => {
      navigate(path);
    }, 500);  // Delay for smooth transition
  };

  return (
    <section className='contact'>
      <div className='container mx-auto text-center flex flex-wrap justify-center items-center lg:gap-4 md:gap-2 sm:gap-12 my-4'>
        <div className="my-5 mx-5">
            <p className='text-center'>
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

        <div className="w-[1px] bg-[#c7c5c5] h-[250px] inline-block hidden md:block"></div> {/* Vertical line */}

        <div className='mx-6'>
          <p className='text-center'>
            <b>Business Partner</b><br />
            Asia/Japan<br />
            Selam Store Trading LLC<br />
            4-32-4 Asakusa, Taito-ku Tokyo<br />
            Japan<br />
          </p>
          <div className="titles">
            <h3 className="text-2xl font-extralight my-2">Reach us</h3>
          </div>
          <div className="flex justify-center mt-4 mb-4 gap-4">
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

        <div className="w-[1px] bg-[#c7c5c5] h-[250px] inline-block hidden  md:hidden lg:block"></div> {/* Vertical line */}


        <div className="pages text-center">
          <div className="titles">
            <h3 className="text-2xl font-extralight">Navigation</h3>
          </div>
          <div className="flex lg:flex-col flex-row  justify-center mt-2"> 
            <Link onClick={() => handleScrollToTopAndNavigate('/')} className="md:mx-2 mx-3 text-[105F4E]-600 font-medium md:text-xl text-base text-left leading-[2.5rem]">Home</Link>
            <Link onClick={() => handleScrollToTopAndNavigate('/ourstory')} className="md:mx-2 mx-3 text-[105F4E]-600 font-medium md:text-xl text-base text-left leading-[2.5rem]">Our Story</Link>
            <Link onClick={() => handleScrollToTopAndNavigate('/blog')} className="md:mx-2 mx-3 text-[105F4E]-600 font-medium md:text-xl text-base text-left leading-[2.5rem]">Blog</Link>
            <Link onClick={() => handleScrollToTopAndNavigate('/sampleorder')} className="md:mx-2 mx-3 text-[105F4E]-600 font-medium md:text-xl text-base text-left leading-[2.5rem]">Order Sample</Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contacts;