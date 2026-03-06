import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import imagescover from '../../asset/img/CoverImages/Bcover.webp';
import Footer from '../footage/footage';
import Heading from '../Home/headings';
import { motion } from 'framer-motion';
import Contacts from '../contact/contacts';
import axios from 'axios';

const API = "http://localhost:4001/api";
const ImageSource = "http://localhost:4001";

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [visibleSections, setVisibleSections] = useState([]);
  const [isShareVisible, setIsShareVisible] = useState([]);

  // Fetch blogs from API
  const fetchBlogs = async () => {
    try {
      const res = await axios.get(`${API}/activeblogs`);
      setBlogs(res.data);
      setVisibleSections(new Array(res.data.length).fill(false));
      setIsShareVisible(new Array(res.data.length).fill(false));
    } catch (err) {
      console.error('Error fetching blogs:', err);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // Format date
  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Scroll animation
  const handleScroll = useCallback(() => {
    const newVisible = blogs.map((_, index) => {
      const card = document.getElementById(`blog-details-${index}`);
      if (!card) return false;
      const rect = card.getBoundingClientRect();
      return rect.top < window.innerHeight && rect.bottom >= 0;
    });
    setVisibleSections(newVisible);
  }, [blogs]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Handle like
  const handleLike = async (id) => {
    try {
      const liked = localStorage.getItem(`blogs${id}/like`);
      if (liked) return alert("You already liked this blog");
      await axios.put(`${API}/blogs/${id}/like`);
      localStorage.setItem(`liked_${id}`, true);
      fetchBlogs();
    } catch (err) {
      console.error(err);
    }
  };

  // Handle share
  const handleShare = async (id, title, platform) => {
    try {
      await axios.put(`${API}/blogs/${id}/share`);
      fetchBlogs();

      const encodedTitle = encodeURIComponent(title);
      const encodedUrl = encodeURIComponent(window.location.href);
      const shareUrls = {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedTitle}`,
        twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
        email: `mailto:?subject=${encodedTitle}&body=${encodedUrl}`,
        telegram: `https://telegram.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
      };
      const shareWindow = window.open(shareUrls[platform], '_blank');
      if (shareWindow) shareWindow.focus();
    } catch (err) {
      console.error(err);
    }
  };

  const toggleShareButtons = (index) => {
    setIsShareVisible(prev => {
      const copy = [...prev];
      copy[index] = !copy[index];
      return copy;
    });
  };

  // Sort blogs by createdAt
  const sortedBlogs = [...blogs].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <section className="blog">
      <div className="covers">
        <div className='imgs'>
          <img src={imagescover} alt="Cover" />
        </div>
        <div className='slogan'>
          <Heading title="Blog" subtitle="Temerachi Coffee Export" />
        </div>
      </div>

      <section>
        <div className="container flex flex-wrap m-auto justify-center md:my-6 my-0">
          {sortedBlogs.map((post, index) => (
            <motion.div
              key={post.id}
              id={`blog-details-${index}`}
              className="blog-details border rounded shadow-md mb-6 w-full md:w-[30%] m-2"
              initial={{ opacity: 0, y: 50 }}
              animate={visibleSections[index] ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.5 }}
            >
              <div className="bmedia">
                {post.mediaType === 'video' 
                  ? <video src={`${ImageSource}${post.mediaSrc}`} controls className="w-full h-64 object-cover" />
                  : <img 
                      src={`${ImageSource}${post.mediaSrc}`} 
                      alt={post.blogTitle} 
                      className="w-full h-64 object-cover"
                      onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/400'; }}
                    />
                }
              </div>

              <div className="grow p-[15px]">
                <h3 className='text-xl mb-1 text-[#105f4e] font-semibold'>{post.blogTitle}</h3>
                <p className="text-[#b9b9b9] font-light">{post.createdAt ? formatDate(post.createdAt) : 'Date not found'}</p>
                <p className='leading-7 mb-4' dangerouslySetInnerHTML={{ __html: post.blogDescription?.substring(0, 100) + ' [...]' }} />

                <div className='blog-status mb-2'>
                  <Link
                    to={`/blogdetail/${post.id}`}
                    state={{ post }}
                    className='status text-[#007bff] inline-block hover:underline'
                    onClick={() => window.scrollTo(0, 0)}
                  >
                    Read more
                  </Link>
                </div>

                <div className="flex justify-between items-center">
                  <button className="bg-transparent text-gray-400" onClick={() => handleLike(post.id)}>
                    <i className="fa-regular fa-heart text-[brown]"></i> {post.likeCount}
                  </button>

                  <button className="bg-transparent text-gray-400" onClick={() => toggleShareButtons(index)}>
                    <i className="fa-solid fa-share-nodes text-[#0888b3]"></i> {post.shareCount}
                  </button>

                  {isShareVisible[index] && (
                    <div className="flex gap-2 mt-2">
                      <button onClick={() => handleShare(post.id, post.blogTitle, 'facebook')}>
                        <i className="fa-brands fa-facebook"></i>
                      </button>
                      <button onClick={() => handleShare(post.id, post.blogTitle, 'twitter')}>
                        <i className="fa-brands fa-twitter"></i>
                      </button>
                      <button onClick={() => handleShare(post.id, post.blogTitle, 'email')}>
                        <i className="fa-solid fa-envelope"></i>
                      </button>
                      <button onClick={() => handleShare(post.id, post.blogTitle, 'telegram')}>
                        <i className="fa-brands fa-telegram"></i>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

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

export default Blog;
