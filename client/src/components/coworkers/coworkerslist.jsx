import React, { useEffect, useState } from 'react';
import Heading from '../Home/headings';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const API_URL = 'http://localhost:4001/api';
const ImageSource = 'http://localhost:4001';

const CoworkersList = () => {
  const [coworkers, setCoworkers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await fetch(`${API_URL}/activetestimonials`);

        if (!response.ok) {
          throw new Error('Failed to fetch testimonials');
        }

        const data = await response.json();
        console.log('Fetched testimonials:', data);
        setCoworkers(data);
      } catch (err) {
        console.error(err);
        setError('Error fetching testimonials');
      }
    };

    fetchTestimonials();
  }, []);

  return (
    <section>
      <Heading title="Testimonial" subtitle="Our Customers Say It Best" />

      <div className="container mx-auto flex items-center justify-center mb-4">
        {error ? (
          <p className="text-red-500">{error}</p>
        ) : coworkers.length > 0 ? (
          <Swiper
            className="custom-swiper  w-full 2xl:mx-24 xl:mx-8 lg:mx-4 md:mx-8 mx-6"
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={25}
            pagination={{ clickable: true }}
            autoplay={{ delay: 3000 }}
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
              1280: { slidesPerView: 3 },
            }}
          >
            {coworkers.map((coworker, index) => {
              const logoImage = `${ImageSource}/${coworker.CompanyLogo}`.replace(
                /([^:]\/)\/+/g,
                '$1'
              );
              const flagImage = `${ImageSource}/${coworker.Flag}`.replace(
                /([^:]\/)\/+/g,
                '$1'
              );

              return (
                <SwiperSlide key={index}>
                  <div className="border-2 border-gray-200 shadow-custom p-4 flex flex-col text-center justify-center items-center mb-12 shadow-lg">
                    <img
                      src={logoImage}
                      alt="Company Logo"
                      className="border-4 border-gray-300 w-28 h-28 rounded-full object-cover p-1"
                    />

                    <div className="mt-4">
                      <i className="fa-solid fa-quote-left text-yellow-500"></i>
                      <p className="italic px-4">
                        {coworker.Memo || 'Description Not Available'}
                      </p>
                      <i className="fa-solid fa-quote-right text-yellow-500"></i>

                      <h2 className="font-Cardo text-lg mt-4">
                        {coworker.CompanyName} ({coworker.EmpName})
                      </h2>

                      <img
                        className="w-8 h-5 mx-auto mt-3 border"
                        src={flagImage}
                        alt="Flag"
                      />
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        ) : (
          <p>No testimonials available.</p>
        )}
      </div>
    </section>
  );
};

export default CoworkersList;
