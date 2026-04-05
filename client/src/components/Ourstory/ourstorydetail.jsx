import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import img1 from '../../asset/img/HeadingImages/CompanyPhoto.webp';
import img from '../../asset/img/HeadingImages/CompanyPhoto1.webp';
import img2 from '../../asset/img/HeadingImages/CompanyPhoto2.webp';
import photo1 from '../../asset/img/ManagementImages/bothmanager.webp';
import Heading from '../Home/headings';
import Footer from '../footage/footage';
import Contacts from '../contact/contacts';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules'; 
import 'swiper/swiper-bundle.css';

const API_URL = 'http://localhost:4001/api';
const ImageSource = 'http://localhost:4001';

const getElementRect = (id) => {
  const element = document.getElementById(id);
  return element ? element.getBoundingClientRect() : null;
};

const useDebounce = (callback, delay) => {
  const timerRef = useRef(null);
  return (...args) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => callback(...args), delay);
  };
};

const images = [img1, img, img2];

const OurStoryDetail = ({ interval = 3000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleSections, setVisibleSections] = useState({
    about: false, leaders: false, teamMembers: false, contact: false, footer: false,
  });
  
  // Initialize as empty arrays to prevent .map errors
  const [management, setManagement] = useState([]); 
  const [teammembers, setTeamMembers] = useState([]); 
  const imgRef = useRef(null);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentIndex((prevIdx) => (prevIdx + 1) % images.length);
    }, interval);
    return () => clearInterval(intervalId);
  }, [interval]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const mgmtRes = await fetch(`${API_URL}/employeebycat`);
        const mgmtData = await mgmtRes.json();
        // Check if data is an array before setting state
        setManagement(Array.isArray(mgmtData) ? mgmtData : []);

        const teamRes = await fetch(`${API_URL}/activeemployee`);
        const teamData = await teamRes.json();
        setTeamMembers(Array.isArray(teamData) ? teamData : []);
      } catch (error) {
        console.error('Fetch error:', error);
      }
    };
    fetchData();
  }, []);

  const handleScroll = () => {
    const sections = ['ourhistory', 'leaders', 'teammembers', 'contactus', 'footer'];
    const visibility = {};
    sections.forEach(id => {
      const rect = getElementRect(id);
      visibility[id === 'ourhistory' ? 'about' : id === 'teammembers' ? 'teamMembers' : id === 'contactus' ? 'contact' : id] = 
        rect && rect.top < window.innerHeight && rect.bottom >= 0;
    });
    setVisibleSections(prev => ({ ...prev, ...visibility }));
  };

  const handleDebouncedScroll = useDebounce(handleScroll, 100);

  useEffect(() => {
    window.addEventListener('scroll', handleDebouncedScroll);
    handleScroll(); 
    return () => window.removeEventListener('scroll', handleDebouncedScroll);
  }, [handleDebouncedScroll]);

  return (
    <>
      <section className='ourstorydetail'>
        <div className='covers'>
          <div className='imgs'>
            <img src={images[currentIndex]} alt="Slideshow" ref={imgRef} />
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
            initial={{ opacity: 0, y: 200 }}
            animate={visibleSections.about ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.5 }}
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
          initial={{ opacity: 0, y: 200 }}
          animate={visibleSections.leaders ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.5 }}
          className='container mx-auto text-center mb-8'
        >
          <Heading title="Founders" subtitle="Visionary Creators" />
          <div className='xl:w-[80%] mx-auto mt-8'>
            <Swiper
              modules={[Pagination, Autoplay]}
              pagination={{ clickable: true }}
              spaceBetween={30}
              autoplay={{ delay: 6000 }}
              breakpoints={{ 667: { slidesPerView: 2 } }}
            >
              {/* Added safe array check */}
              {Array.isArray(management) && management.map((founder, index) => (
                <SwiperSlide key={`founder-${index}`}>
                  <div className="p-4">
                    <img 
                      src={`${ImageSource}${founder.EmpImage}`} 
                      alt={founder.FullName} 
                      className="w-[250px] h-[300px] object-cover mx-auto shadow-lg" 
                    />
                    <h2 className="text-xl font-bold mt-4 text-[#105f4e]">{founder.FullName}</h2>
                    <p className='mt-2 text-gray-600'>{founder.Memo}</p>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </motion.div>
      </section>

      <section className="py-12">
        <div className='container mx-auto'>
          <motion.div
            id="teammembers"
            initial={{ opacity: 0, y: 200 }}
            animate={visibleSections.teamMembers ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.5 }}
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
            {/* Added safe array check */}
            {Array.isArray(teammembers) && teammembers.map((member, index) => (
              <SwiperSlide key={`team-${index}`}>
                <div className="border-2 border-gray-200 shadow-custom relative h-[45vh] 2xl:h-[45vh] xl:h-[40vh] lg:h-[52vh]  md:h-[35vh] mb-16">
                  <img src={`${ImageSource}${member.EmpImage}`} alt={member.FullName} className="w-full h-full object-cover" />
                    <div className="bg-[#391f11] bg-opacity-75 text-white text-center absolute bottom-0 left-0 w-full p-2 ">
                      <h2 className='font-semibold text-[1.2rem]'>{member.FullName}</h2>
                    <p className='text-center text-white text-[0.97rem]'>{member.Positions}</p>
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
          initial={{ opacity: 0, y: 200 }}
          animate={visibleSections.contact ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.5 }}
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