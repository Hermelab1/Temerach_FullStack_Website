import React from 'react';
import Footer from '../footage/footage';
import Heading from '../Home/headings';
import imagescover from '../../asset/img/CoverImages/Ecover.webp'; // Ensure the path is correct
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules'; 
import 'swiper/swiper-bundle.css';
import Contacts from '../contact/contacts';

// Function to import all images from a directory
const importAll = (r) => {
    let images = {};
    r.keys().forEach((item) => {
        images[item.replace('./', '')] = r(item);
    });
    return images;
};

// Import images from the directory
const imagesE = importAll(require.context('../../asset/img/Events', false, /\.(webp|jpg|jpeg|png)$/));
const imagesO = importAll(require.context('../../asset/img/Farms', false, /\.(webp|jpg|jpeg|png)$/));

// Calculate the total number of images dynamically
const totalItemsE = Object.keys(imagesE).length;
const totalItemsO = Object.keys(imagesO).length;

const Events = () => {
    return (
        <section className='gallery-events'>
            <div className="covers">
                <div className='imgs'>
                    <img src={imagescover} alt='Cover' />
                </div>
                <div className='slogan'>
                    <Heading title="Gallery" subtitle="Temerachi Coffee Export" />
                </div>
            </div>
            <div className='w-[80%] mx-auto justify-center items-center mb-6'>
                <div className="flex flex-wrap justify-center ">
                    <Heading title="Events" subtitle="Connect with fellow coffee lovers!"/>
                    <Swiper
                        spaceBetween={30}
                        modules={[Navigation, Autoplay]}
                        loop={true}
                        autoplay={{ delay: 5000 }}
                        breakpoints={{
                            480: { slidesPerView: 1 },
                            667: { slidesPerView: 2 },
                            768: { slidesPerView: 2 },
                            1024: { slidesPerView: 3 },
                            1280: { slidesPerView: 4 },
                        }}
                    >
                        {Array.from({ length: totalItemsE }, (_, index) => (
                            <SwiperSlide key={index}>
                                <motion.div
                                    id={`training-card-${index}`}
                                    className="relative border-2 border-gray-400 shadow-custom w-[300px] h-[360px] md:w-[320px] md:h-[400px] 2xl:h-[400px] 2xl:w-[310px] lg:w-[250px] lg:h-[340px] gap-0"
                                    transition={{ duration: 0.2 }}
                                >
                                    <img className='w-full h-full object-cover hover:scale-105'
                                        src={imagesE[Object.keys(imagesE)[index]]} 
                                        alt={`Event ${index}`}
                                    />
                                </motion.div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>

                <div className="flex flex-wrap justify-center">
                    <Heading title="Our Farm" subtitle="Discover the Essence of Our Farm"/>
                    <Swiper
                        spaceBetween={30}
                        modules={[Navigation, Autoplay]}
                        loop={true}
                        autoplay={{ delay: 6000 }}
                        breakpoints={{
                            480: { slidesPerView: 1 },
                            667: { slidesPerView: 2 },
                            768: { slidesPerView: 2 },
                            1024: { slidesPerView: 3 },
                            1250: { slidesPerView: 4 },
                        }}
                    >
                        {Array.from({ length: totalItemsO }, (_, index) => (
                            <SwiperSlide key={index}>
                                <motion.div
                                    id={`farm-card-${index}`}
                                    className="relative border-2 border-gray-400 shadow-custom w-[300px] h-[360px] md:w-[320px] md:h-[400px] 2xl:h-[400px] 2xl:w-[310px] lg:w-[250px] lg:h-[340px] gap-0"
                                    transition={{ duration: 0.2 }}
                                >
                                    <img className='w-full h-full object-cover hover:scale-105'
                                        src={imagesO[Object.keys(imagesO)[index]]} 
                                        alt={`Farm ${index}`}
                                    />
                                </motion.div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>

            {/* Removed duplicate Contacts and Footer */}
            <motion.div
                id="contactus"
                initial={{ opacity: 0, y: 200 }}
                animate={{ opacity: 1, y: 0 }} // You need to define your animation logic based on a state or prop
                transition={{ duration: 0.5 }}
                className="bg-[#f8f9fa]"
            >
                <Contacts />
            </motion.div>
            <Footer />
        </section>
    );
};

export default Events;