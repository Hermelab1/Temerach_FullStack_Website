import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
 // Components
import Heading from '../Home/headings';
import Footer from '../footage/footage';
import Contacts from '../contact/contacts';

// Assets
import CoverIma from '../../asset/img/CoverImages/Ocover.webp';

// Configuration Constants
const API_URL = 'http://localhost:4001/api';
const IMAGE_BASE_URL = 'http://localhost:4001';

const SampleOrder = () => {
  const [products, setProducts] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  /**
   * Helper: Formats the full image path safely
   */
  const getFullImageUrl = useCallback((path) => {
    if (!path) return '';
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    return `${IMAGE_BASE_URL}/${cleanPath}`;
  }, []);

  /**
   * Fetch Active Products
   */
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API_URL}/getactiveitem`);
        if (!response.ok) throw new Error('Failed to fetch product catalog');
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Product Fetch Error:', error);
      } finally {
        setLoading(false);
      }
    };

    // Initial Cart Sync
    const existingCart = JSON.parse(localStorage.getItem('coffeeCart')) || [];
    setCartCount(existingCart.length);

    fetchProducts();
  }, []);

  /**
   * Handle Cart Addition
   */
const addToCart = useCallback((product) => {
    const newItem = {
      cartId: Date.now(),
      id: product.id, // Ensure this matches your API 'id'
      itemName: product.itemName,
      itemCode: product.itemCode,
      image: getFullImageUrl(product.imageUrl),
      description: product.description,
      quantity: 1,
      // Add these lines to fix the empty list:
      priceLevels: product.priceLevels, 
      uom: product.uom,
      uomId: product.uomId,
      isTaxable: product.isTaxable,
      price: 0, // Initial price until a grade is selected
      transactionAllowed: product.transactionAllowed,
    };

    const existingCart = JSON.parse(localStorage.getItem('coffeeCart')) || [];
    const updatedCart = [...existingCart, newItem];
    
    localStorage.setItem('coffeeCart', JSON.stringify(updatedCart));
    setCartCount(updatedCart.length);
    alert(`${product.itemName} added to selection!`); // Optional feedback
  }, [getFullImageUrl]);

  /**
   * Navigation Handler
   */
  const handleReviewOrder = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    navigate('/orderd');
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

      {/* Floating Action Button (Cart) */}
      <AnimatePresence>
        {cartCount > 0 && (
          <motion.button
            initial={{ scale: 0, opacity: 0, x: 50 }}
            animate={{ scale: 1, opacity: 1, x: 0 }}
            exit={{ scale: 0, opacity: 0, x: 50 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleReviewOrder}
            className="fixed bottom-8 right-8 z-50 bg-[#3e1c08] text-white pl-6 pr-4 py-4 rounded-full shadow-2xl flex items-center gap-3 transition-shadow hover:shadow-primary/20"
          >
            <span className="font-bold tracking-wider uppercase text-xs">Review Order</span>
            <div className="bg-white text-[#3e1c08] w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs">
              {cartCount}
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      <main className="container m-auto justify-center md:my-6 my-0">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row items-baseline justify-between mb-12 border-b border-gray-100 pb-8">
          <h2 className="text-2xl font-Cardo">Coffee Selection</h2>
          <p className="text-gray-400 text-xs uppercase tracking-[0.3em] mt-2 md:mt-0">
            {products.length} Professional Grades Available
          </p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center py-32 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#3e1c08] mb-6"></div>
            <p className="font-medium text-[#3e1c08] tracking-widest uppercase text-xs">Sourcing the finest beans...</p>
          </div>
        ) : (
          /* Product Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8 justify-items-center">
            {products.map((product) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                whileHover={{ y: -10 }}
                className="group relative w-full max-w-[350px] h-[400px] bg-neutral-100 overflow-hidden shadow-xl rounded-sm"
              >
                {/* Product Image */}
                <img
                  src={getFullImageUrl(product.imageUrl)}
                  alt={product.itemName}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />

                {/* Overlay Layers */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent" />

                {/* Badge */}
                <div className="absolute top-4 left-4">
                  <span className="bg-[#3e1c08] text-white text-[10px] px-3 py-1 uppercase tracking-widest font-bold">
                    ID: {product.itemCode}
                  </span>
                </div>

                {/* Content Overlay */}
                <div className="absolute bottom-0 left-0 w-full p-6 text-white translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-2xl font-bold tracking-tight">
                    {product.itemName}
                  </h3>

                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] uppercase tracking-widest text-gray-400">Premium Export Grade</span>
                  </div>

                  <button
                    onClick={() => addToCart(product)}
                    className="w-full bg-white text-[#3e1c08] py-3 rounded-sm font-bold uppercase text-[10px] tracking-[0.25em] hover:bg-[#c18c5d] hover:text-white transition-all duration-300 transform active:scale-95 shadow-lg"
                  >
                    Add to Selection
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      {/* Contact Section */}
      <motion.div
        id="contactus"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="bg-[#f8f9fa] border-t border-gray-100"
      >
        <Contacts />
      </motion.div>

      <Footer />
    </section>
  );
};

export default SampleOrder;