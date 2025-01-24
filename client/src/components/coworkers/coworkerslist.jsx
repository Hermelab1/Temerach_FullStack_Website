import React from 'react';
import Heading from '../Home/headings';
import { testimonial } from '../data/testimonial';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules'; 
import 'swiper/swiper-bundle.css';

const CoworkersList = () => {
  const totalItems = testimonial.length;

  return (
    <section>
      <Heading title="Testimonial" subtitle="Our Customers Say It Best" />
      <div className="container mx-auto flex items-center justify-center mb-4">
        {totalItems > 0 ? (
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
              1280:{slidesPerView:3}
            }}

          >
            {testimonial.map((item, index) => (
              <SwiperSlide key={`testimonial-${index}`}>
                <div className="border-2 border-gray-200 shadow-custom p-2 lg:p-6 xl:p-4 md:p-4 flex flex-col lg:p-2 xl:h-[67vh] lg:h-[80vh] md:h-[45vh] maxm:h-[35vh] slg:h-[35vh] h-auto shadow-lg text-center justify-center item-center mb-12">
                  <div className="flex justify-center items-center mx-auto">
                    <img 
                      src={item.photo} 
                      alt="" 
                      className="border-4 border-gray-300 w-28 h-28 rounded-full object-cover p-1" 
                    />
                  </div>
                  <div className='my-auto'>
                      <i className="fa-solid fa-quote-left text-yellow-500"></i>
                      <p className="leading-6 xl:leading-8 italic text-center xl:text-lg lg:text-base px-2 md:px-4 lg:p-1 xl:px-4 ">{item.paragraph || 'Description Not Available'}</p>
                      <i className="fa-solid fa-quote-right text-yellow-500"></i>
                      <h2 className="font-Cardo text-center text-lg mt-4">{item.name} ({item.companyname})</h2>
                      <div className='flex justify-center items-center gap-2 md:gap-8 p-3'>
                        <img className='w-7 h-4 md:w-[35px] md:h-6 border' src={item.flag} alt="Flag" />
                      </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <p>No testimonials available.</p>
        )}
      </div>
    </section>
  );
}

export default CoworkersList;