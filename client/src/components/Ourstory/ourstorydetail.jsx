import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import img1 from '../../asset/img/HeadingImages/CompanyPhoto.webp';
import img from '../../asset/img/HeadingImages/CompanyPhoto1.webp';
import img2 from '../../asset/img/HeadingImages/CompanyPhoto2.webp';
import photo1 from '../../asset/img/ManagementImages/bothmanager.webp';
import Heading from '../Home/headings';
import Footer from '../footage/footage';
import { management } from '../data/management';
import { teammembers } from '../data/teammembers';
import Contacts from '../contact/contacts';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules'; 
import 'swiper/swiper-bundle.css';

const getElementRect = (id) => {
  const element = document.getElementById(id);
  return element ? element.getBoundingClientRect() : null;
};

const useDebounce = (callback, delay) => {
  const timerRef = useRef(null);
  const debouncedCallback = (...args) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => callback(...args), delay);
  };
  return debouncedCallback;
};

const images = [img1, img, img2];

const OurStoryDetail = ({ interval = 3000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleSections, setVisibleSections] = useState({
    about: false,
    leaders: false,
    teamMembers: false,
    contact: false,
    footer: false,
  });
  const imgRef = useRef(null);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, interval);
    return () => clearInterval(intervalId);
  }, [interval]);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        observer.disconnect();
      }
    });

    const currentImgRef = imgRef.current;

    if (currentImgRef) {
      observer.observe(currentImgRef);
    }

    return () => {
      if (currentImgRef) {
        observer.unobserve(currentImgRef);
      }
    };
  }, []);

  const handleScroll = () => {
    const aboutRect = getElementRect('ourhistory');
    const leadersRect = getElementRect('leaders');
    const teamMembersRect = getElementRect('teammembers');
    const contactRect = getElementRect('contactus');
    const footerRect = getElementRect('footer');

    setVisibleSections({
      about: aboutRect && aboutRect.top < window.innerHeight && aboutRect.bottom >= 0,
      leaders: leadersRect && leadersRect.top < window.innerHeight && leadersRect.bottom >= 0,
      teamMembers: teamMembersRect && teamMembersRect.top < window.innerHeight && teamMembersRect.bottom >= 0,
      contact: contactRect && contactRect.top < window.innerHeight && contactRect.bottom >= 0,
      footer: footerRect && footerRect.top < window.innerHeight && footerRect.bottom >= 0,
    });
  };

  const handleDebouncedScroll = useDebounce(handleScroll, 100);

  useEffect(() => {
    window.addEventListener('scroll', handleDebouncedScroll);
    handleScroll(); 

    return () => {
      window.removeEventListener('scroll', handleDebouncedScroll);
    };
  }, [handleDebouncedScroll]);

  return (
    <>
      <section className='ourstorydetail'>
        <div className='covers'>
          <div className='imgs'>
            <img src={images[currentIndex]} alt="Company Slideshow" ref={imgRef} />
          </div>
          <div className='slogan'>
            <Heading title="Our Journey" subtitle="Temerachi Coffee Export" />
          </div>
        </div>
      </section>
      
      <section>
        <div className="container md:flex mx-auto lg:my-[4%] my-8">
          <motion.div
            id="ourhistory"
            initial={{ opacity: 0, y: 300 }}
            animate={visibleSections.about ? { opacity: 1, y: 0 } : { opacity: 0, y: 70 }} // Apply animation based on visibility
            transition={{ duration: 1 }}
            className="flex flex-col md:flex-row xl:gap-24 lg:gap-16 md:gap-8 gap-4 justify-center items-center"
          >
            <div className='about-text w-[90%] xl:w-[42%] 2xl:w-[40%] lg:w-[48%] md:w-[55%]'>
              <p className="first-letter:text-[130px] first-letter:font-Cardo first-letter:font-[450] first-letter:text-[#176756] first-letter:float-left first-letter:leading-[80px] first-letter:top-[-20px]">
                  Founded in 2018 by two enterprising brothers who had exposure to coffee cultivation and a decade of expertise in the worldwide coffee business. Temerachi Coffee, a leading Ethiopian coffee exporter, collaborates with smallholder farmers in Yirgacheffe, Gedeb, Sidama, Bonga, Jimma and Guji to ensure quality and traceability in their coffee cherries. This approach drives brand growth and value for both the company and the farming communities we work with. 
                  <br />
                  Temerachi's business model prioritizes corporate social responsibility and environmental stewardship, promoting eco-friendly practices among coffee farmers. The company aims to become a recognized specialty coffee brand globally and educate the next generation of professionals to thrive in the dynamic coffee industry.
              </p>
            </div>
            <div className='w-[60%] xl:w-[22%] xl:h-[60vh] lg:w-[28%] lg:h-[70vh] md:w-[35%] md:h-[55vh] maxm:h-[45vh] slg:h-[40vh] h-[50vh] animate-rightToLeft flex items-center justify-center'>
              <img src={photo1} alt="Company Manager" className='shadow-custom w-full h-full' />
            </div>
          </motion.div>
        </div>
      </section>
      <section className='bg-[#f8f9fa] flex justify-center items-center'>
        <motion.div
          id="leaders"
          initial={{ opacity: 0, y: 300 }}
          animate={visibleSections.leaders ? { opacity: 1, y: 0 } : { opacity: 0, y: 70 }} // Apply animation based on visibility
          transition={{ duration: 1 }}
          className='container mx-auto text-center mb-8'
        >
          <Heading title="Founders" subtitle="Visionary Creators" />

          <div className='justify-center items-center xl:w-[80%] lg:w-[90%] mx-auto md:my-12 my-0 px-4 md:p-4'>
            <Swiper
              className='custom-swiper'
              modules={[Pagination, Autoplay]}
              pagination={{ clickable: true }}
              loop={true}
              spaceBetween={30}
              autoplay={{
                delay: 6000,
                disableOnInteraction: false,
              }}
              grabCursor={true}
              breakpoints={{
                480: { slidesPerView: 1 },
                667: { slidesPerView: 2 },
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 2 },
              }}
            >
              {management.map((founder, index) => (
                <SwiperSlide key={`founder-${index}`} className="flex justify-center items-center">
                  <div className="w-full lg:w-[85%]">
                    <div className="flex justify-center items-center md:p-1 p-0">
                      <img src={founder.photo} alt={`Founder ${founder.name}`} className="lg:w-[55%] lg:h-[35vh] maxm:h-[25vh] slg:h-[25vh] w-[60%] h-[33vh] object-cover border border-white shadow-custom mx-auto" />
                    </div>
                    <div className='aboutF-text text-center p-2'>
                      <h2 className="text-[25px] font-bold tracking-wide text-[#105f4e] p-2 m-2">{founder.name}</h2>
                      <p className='mb-4'>{founder.text}</p>
                    </div>
                  </div>
                </SwiperSlide>
              ))}

              <div className="absolute top-[15%] left-[50%] transform -translate-x-1/2 hidden md:block">
                <p className='text-[90px] italic'>&</p>
              </div>
            </Swiper>
          </div>
        </motion.div>
      </section>

      <section>
        <div className='container mx-auto'>
          <motion.div
            id="teammembers"
            initial={{ opacity: 0, y: 300 }}
            animate={visibleSections.teamMembers ? { opacity: 1, y: 0 } : { opacity: 0, y: 70 }} // Apply animation based on visibility
            transition={{ duration: 1 }}
            className="custom-swiper text-center mx-12 md:mx-24"
          >
            <Heading title="Meet Our Team" subtitle="The Faces Behind the Excellence" />

            <Swiper
              modules={[Pagination, Autoplay]}
              pagination={{ clickable: true }}
              loop={true}
              spaceBetween={20}
              autoplay={{
                delay: interval,
                disableOnInteraction: false,
              }}
              breakpoints={{
                480: { slidesPerView: 1 },
                667: { slidesPerView: 2 },
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
                1280: { slidesPerView: 4 },
                1300: { slidesPerView: 4 },
              }}
            >
              {teammembers.map((member, index) => (
                <SwiperSlide key={`teammember-${index}`}>
                  <div className="border-2 border-gray-200 shadow-custom relative h-[45vh] 2xl:h-[45vh] xl:h-[40vh] lg:h-[52vh]  md:h-[35vh] mb-16">
                    <img src={member.photo} alt={member.name} className="w-full h-full object-cover" />
                    <div className="bg-[#391f11] bg-opacity-75 text-white text-center absolute bottom-0 left-0 w-full p-2 ">
                      <h2 className='font-semibold text-[1.2rem]'>{member.name}</h2>
                      <p className='text-center text-white text-[0.97rem]'>{member.position}</p>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

          </motion.div>
        </div>
      </section>

      <section className='bg-[#f8f9fa]'>
        <motion.div
          id="contactus"
          initial={{ opacity: 0, y: 300 }}
          animate={visibleSections.contact ? { opacity: 1, y: 0 } : { opacity: 0, y: 70 }} // Apply animation based on visibility
          transition={{ duration: 1 }}
          className="contactus"
        >
          <Contacts />
          <Footer />
        </motion.div>
      </section>
    </>
  );
};

export default OurStoryDetail;