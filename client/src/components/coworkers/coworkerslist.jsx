import React, { useEffect, useState } from 'react';
import Heading from '../Home/headings';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const API_URL = "http://localhost:4001/api";
const IMAGE_URL = "http://localhost:4001/uploads/";

const CoworkersList = () => {
  const [coworkers, setCoworkers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await fetch(`${API_URL}/activetestimonials`);
        if (!response.ok) throw new Error('Failed to fetch testimonials');
        const data = await response.json();
        setCoworkers(data);
      } catch (err) {
        console.error(err);
        setError('Error fetching testimonials');
      }
    };
    fetchTestimonials();
  }, []);

  return (
    <section className="py-12 bg-white">
      <Heading title="Testimonial" subtitle="Our Customers Say It Best" />
      <div className="container mx-auto flex items-center justify-center mb-4">
        {error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : coworkers.length > 0 ? (
          <Swiper
            className="custom-swiper 2xl:mx-24 xl:mx-8 lg:mx-4 md:mx-8 mx-6"
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={25}
            pagination={{ clickable: true }}
            autoplay={{ delay: 3000 }}
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
              1280: {slidesPerView:3}
            }}
          >
            {coworkers.map((coworker) => {
              // Fix image path mapping from API keys
              const logoImage = `${IMAGE_URL}/${coworker.companylogo}`.replace(/([^:]\/)\/+/g, '$1');
              const flagImage = `${IMAGE_URL}/${coworker.Flag}`.replace(/([^:]\/)\/+/g, '$1');

              return (
                <SwiperSlide key={coworker.id}>
                <div className="border-2 border-gray-200 shadow-custom p-2 flex flex-col xl:h-[67vh] lg:h-[80vh] md:h-[45vh] maxm:h-[35vh] slg:h-[35vh] h-auto shadow-lg text-center justify-center item-center mb-8">
                    <div className="flex justify-center items-center mx-auto">
                    <img
                          src={logoImage}
                          alt="Company Logo"
                      className="border-4 border-gray-300 w-28 h-28  rounded-full object-cover p-1" 
                    />
                    </div>
                  

                    {/* Testimonial Content */}
                    <div className='my-auto'>
                      <i className="fa-solid fa-quote-left text-yellow-500"></i>
                      
                      <p className="leading-6 xl:leading-8 italic text-center xl:text-lg lg:text-base px-2 md:px-4 lg:p-1 xl:px-4 ">
                        {coworker.message}
                      </p>
                      
                      <i className="fa-solid fa-quote-right text-yellow-500"></i>
                      {/* Name and Designation */}
                      <h2 className="font-Cardo text-center text-lg mt-4">
                          {coworker.name} ({coworker.designation})
                      </h2>

                      {/* Country Flag */}
                      <div className='flex justify-center items-center gap-2 md:gap-8 p-3'>
                        <img
                          className="w-8 h-5 object-cover border border-gray-200 shadow-sm"
                          src={flagImage}
                          alt="Country Flag"
                        />
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        ) : (
          <p className="text-center">No testimonials available.</p>
        )}
      </div>
    </section>
  );
};

export default CoworkersList;