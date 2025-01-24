import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { blogs } from '../data/blog';
import imagescover from '../../asset/img/CoverImages/Bcover.webp';
import Footer from '../footage/footage';
import Heading from '../Home/headings';
import { motion } from 'framer-motion';
import Contacts from '../contact/contacts';

const Blog = () => {
  const [visibleSections, setVisibleSections] = useState(new Array(blogs.length).fill(false));
  const [likeCounts, setLikeCounts] = useState(() => {
    const savedCounts = localStorage.getItem('likeCounts');
    return savedCounts ? JSON.parse(savedCounts) : new Array(blogs.length).fill(0);
  });
  const [shareCounts, setShareCounts] = useState(() => {
    const storedShares = localStorage.getItem('shareCounts');
    return storedShares ? JSON.parse(storedShares) : new Array(blogs.length).fill(0);
  });

  const [isShareVisible, setIsShareVisible] = useState(new Array(blogs.length).fill(false));

  const sortedBlogs = [...blogs].sort((a, b) => new Date(b.date) - new Date(a.date));

  const handleScroll = useCallback(() => {
    const newVisibleSections = sortedBlogs.map((_, index) => {
      const card = document.getElementById(`blog-details-${index}`);
      if (card) {
        const rect = card.getBoundingClientRect();
        return rect.top < window.innerHeight && rect.bottom >= 0;
      }
      return false;
    });
    setVisibleSections(newVisibleSections);
  }, [sortedBlogs]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  const handleLike = (index) => {
    const newLikeCounts = [...likeCounts];
    newLikeCounts[index] += 1;
    setLikeCounts(newLikeCounts);
    localStorage.setItem('likeCounts', JSON.stringify(newLikeCounts));
  };

  const totalLikesForBlog = (index) => {
    return likeCounts[index];
  };

  const handleShare = (index, title, url, platform) => {
    const newShareCounts = [...shareCounts];
    newShareCounts[index] += 1;
    setShareCounts(newShareCounts);
    localStorage.setItem('shareCounts', JSON.stringify(newShareCounts));

    const encodedTitle = encodeURIComponent(title);
    const encodedUrl = encodeURIComponent(url);
    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&title=${encodedTitle}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      email: `mailto:?subject=${encodedTitle}&body=${encodedUrl}`,
      telegram: `https://telegram.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
    };

    const shareWindow = window.open(shareUrls[platform], '_blank');
    if (shareWindow) {
      shareWindow.focus();
    }
  };

  const toggleShareButtons = (index) => {
    setIsShareVisible((prev) => {
      const newVisibility = [...prev];
      newVisibility[index] = !newVisibility[index];
      return newVisibility;
    });
  };

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
          {sortedBlogs.map((blog, index) => {
            const { title, detail, mediaType, mediaSrc, date } = blog;
            return (
              <motion.div
                key={index}
                id={`blog-details-${index}`}
                className="blog-details"
                initial={{ opacity: 0, y: 50 }}
                animate={visibleSections[index] ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                transition={{ duration: 0.5 }}
              >
                <div className="bmedia">
                  {mediaType === 'video' ? (
                    <video src={mediaSrc} controls />
                  ) : (
                    <img src={mediaSrc} alt={title || 'Blog media'} className='w-full h-full top-0' />
                  )}
                </div>
                <div className="grow p-[15px]">
                  <h3 className='text-xl mb-1 text-[#105f4e] font-semibold'>{title || 'Title Not Available'}</h3>
                  <p className="text-[#b9b9b9] font-light">{date}</p>
                  <p className='leading-7 mb-4'
                    dangerouslySetInnerHTML={{
                      __html: detail ? detail.substring(0, 100) + ' [...]' : 'Detail not available'
                    }}
                  />
                  <div className='blog-status'>
                    <Link
                      to="/blogdetail"
                      state={{
                        mediaSrc,
                        mediaType,
                        title,
                        detail,
                        dates: date,
                        likeCount: likeCounts[index],
                        shareCount: shareCounts[index],
                      }}
                      className='status text-[#007bff] inline-block hover:underline'
                      onClick={() => window.scrollTo(0, 0)}
                    >
                      Read more
                    </Link>
                  </div>
                  <div className="likes">
                    <button className="bg-transparent hover:bg-transparent text-gray-400" onClick={() => handleLike(index)}>
                      <i className="fa-regular fa-heart text-[brown]"></i> {totalLikesForBlog(index)}
                    </button>
                    <button className="bg-transparent hover:bg-transparent text-gray-400" onClick={() => toggleShareButtons(index)}>
                        <i className="fa-solid fa-share-nodes text-[#0888b3]"></i> {shareCounts[index]}
                      </button>
                    <div>
                      {isShareVisible[index] && (
                        <div className="share-buttons">
                          <button onClick={() => handleShare(index, title, window.location.href, 'facebook')}>
                            <i className="fa-brands fa-facebook"></i>
                          </button>
                          <button onClick={() => handleShare(index, title, window.location.href, 'twitter')}>
                            <i className="fa-brands fa-twitter"></i>
                          </button>
                          <button onClick={() => handleShare(index, title, window.location.href, 'email')}>
                            <i className="fa-solid fa-envelope"></i>
                          </button>
                          <button onClick={() => handleShare(index, title, window.location.href, 'telegram')}>
                            <i className="fa-brands fa-telegram"></i>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

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

export default Blog;