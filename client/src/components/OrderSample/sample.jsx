import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Heading from '../Home/headings';
import Footer from '../footage/footage';
import CoverIma from '../../asset/img/CoverImages/Ocover.webp';
import { motion } from 'framer-motion';
import Contacts from '../contact/contacts';

const API_URL = 'http://localhost:4001/api';
const ImageSource = 'http://localhost:4001';

const SampleOrder = () => {
  const [visibleSections, setVisibleSections] = useState([]);
  const [products, setProducts] = useState([]);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API_URL}/avalibleproduct`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log('Fetched products:', data);
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const handleScroll = useCallback(() => {
    requestAnimationFrame(() => {
      const newVisibleSections = [...visibleSections];

      for (let index = 0; index < products.length; index++) {
        const card = document.getElementById(`order-card-${index}`);
        if (card) {
          const rect = card.getBoundingClientRect();
          newVisibleSections[index] = rect.top < window.innerHeight && rect.bottom >= 0;
        }
      }
      setVisibleSections(newVisibleSections);
    });
  }, [visibleSections, products]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Call the handler for the first time

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  const handleScrollToTop = () => {
    window.scrollTo(0, 0);
  };

  return (
    <section className='gallery-events'>
      <div className='covers'>
        <div className='imgs'>
          <img src={CoverIma} alt="Cover" className="w-full" />
        </div>
        <div className='slogan'>
          <Heading title="Reliable Quality" subtitle="Temerachi Coffee Export" />
        </div>
      </div>
      <div className="container m-auto justify-center md:my-6 my-0">
        <div className="flex flex-wrap justify-center">
          {products.length > 0 ? products.map((product, index) => {
            const imageUrl = `${ImageSource}${product.ItemImage}`?.replace(/^\//, '');
            return (
              <motion.div
                key={index}
                id={`order-card-${index}`}
                className="border-2 border-gray-300 w-72 h-80 bg-white shadow-md overflow-hidden m-5 flex flex-col relative"
                initial={{ opacity: 0, y: 50 }}
                animate={visibleSections[index] ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                transition={{ duration: 0.5 }}
              >
                <Link to="/orderd"
                  onClick={handleScrollToTop}
                  state={{
                    image: imageUrl,
                    cname: product.Itemname,
                    code: product.Itemcode,
                    //availability: product.IsAvalible,
                    description: product.Itemdescription,
                    titles: product.CatName || 'Title Not Available',
                    grades: product.GradeName || ['Grade Not Available'],
                    price: product.Price || 'Price Not Available'
                  }}
                  className='flex-1'
                >
                  <img 
                      src={imageUrl} 
                      alt={`Coffee Type: ${product.Itemname || 'Not Available'}`} 
                      className="h-full w-full object-cover" 
                  />
                </Link>
                <div className="bg-[#391f11] bg-opacity-75 text-white text-center absolute bottom-0 left-0 w-full p-2">
                  <h2 className="text-lg font-normal">{product.Itemname || 'Title Not Available'}</h2>
                </div>
              </motion.div>
            );
          }) : (
            <p>No products available.</p>
          )}
        </div>
      </div>
      <motion.div
        id="contactus"
        initial={{ opacity: 0, y: 200 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-[#f8f9fa]"
      >
        <Contacts />
      </motion.div>
      <Footer />
    </section>
  );
};

export default SampleOrder;