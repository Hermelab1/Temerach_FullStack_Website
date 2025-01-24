import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { blogs } from '../data/blog'; // Ensure the path is correct

const BlogDetail = () => {
    const location = useLocation();
    const { mediaSrc, title, mediaType, detail, dates, likeCount, shareCount } = location.state || {};

    const [currentLikeCount, setCurrentLikeCount] = useState(likeCount || 0);
    const [currentShareCount, setCurrentShareCount] = useState(shareCount || 0);

    // Initialize likes and shares from local storage
    const likeCounts = JSON.parse(localStorage.getItem('likeCounts')) || new Array(blogs.length).fill(0);
    const shareCounts = JSON.parse(localStorage.getItem('shareCounts')) || new Array(blogs.length).fill(0);
    const [isShareVisible, setIsShareVisible] = useState(new Array(blogs.length).fill(false));

    const toggleShareButtons = (index) => {
        setIsShareVisible((prev) => {
          const newVisibility = [...prev];
          newVisibility[index] = !newVisibility[index];
          return newVisibility;
        });
      };

      const totalLikesForBlog = (index) => {
        return likeCounts[index];
      };
    

    useEffect(() => {
        const blogIndex = blogs.findIndex(blog => blog.title === title);
        if (blogIndex !== -1) {
            setCurrentLikeCount(likeCounts[blogIndex]);
            setCurrentShareCount(shareCounts[blogIndex]);
        }
    }, [title, likeCounts, shareCounts]);

    const handleLike = () => {
        const newLikeCount = currentLikeCount + 1;
        setCurrentLikeCount(newLikeCount);

        const blogIndex = blogs.findIndex(blog => blog.title === title);
        if (blogIndex !== -1) {
            likeCounts[blogIndex] = newLikeCount;
            localStorage.setItem('likeCounts', JSON.stringify(likeCounts));
        }
    };

    const handleShare = () => {
        const encodedTitle = encodeURIComponent(title);
        const encodedUrl = encodeURIComponent(window.location.href);

        const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedTitle}`; // Default to Facebook
        window.open(shareUrl, '_blank').focus();
    };

    const otherBlogs = blogs
        .filter(blog => blog.title !== title)
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 3);

    return (
        <div className="container mx-auto mt-20 maxm:mt-[15%] slg:mt-[15%] lg:mt-20 flex flex-col items-center mb-8">
            <div className="border border-gray-200 shadow overflow-hidden lg:w-[60%] md:w-[60%] maxm:w-[95%] slg:w-[85%] w-[90%] text-justify mb-5 flex flex-col md:p-8 p-2">
                <h2 className='font-Cardo text-[2rem] leading-10 mb-2 font-semibold'>{title || 'Title Not Available'}</h2>
                <p className='text-gray-400 font-light'>{dates || 'Date Not Available'}</p>
                <div className="media w-full h-[55vh] mb-5 overflow-hidden flex justify-center">
                    {mediaType === 'video' ? (
                        <video src={mediaSrc} controls className="object-cover w-full h-full" />
                    ) : (
                        <img 
                            src={mediaSrc} 
                            alt={title || 'Blog media'} 
                            className="object-top object-cover w-full h-full" 
                        />
                    )}
                </div>
                <p dangerouslySetInnerHTML={{ __html: detail || 'No detail found' }} />
                <div className="flex space-x-4 mt-4">
                    <button className='text-[brown] hover:bg-transparent flex items-center bg-transparent' onClick={handleLike}>
                        <i className="fa-regular fa-heart"></i> {currentLikeCount}
                    </button>
                    <button className='text-blue-500 hover:bg-transparent flex items-center bg-transparent' onClick={handleShare}>
                        <i className="fa-solid fa-share"></i> {currentShareCount}
                    </button>
                </div>
            </div>
            <h2 className='text-gray-400 m-0 text-2xl mb-2'>Other Blogs</h2>
            <div className="container flex flex-wrap m-auto justify-center">
                {otherBlogs.map((blog, index) => {
                    const { title, detail, mediaType, mediaSrc, date } = blog;
                    return (
                        <div key={index} className="blog-details border mb-4">
                            <div className="bmedia">
                                {mediaType === 'video' ? (
                                    <video src={mediaSrc} controls />
                                ) : (
                                    <img src={mediaSrc} alt={title || 'Blog media'} className='w-full h-full' />
                                )}
                            </div>
                            <div className="grow p-[15px]">
                                <h3 className='text-xl mb-1 text-[#105f4e] font-semibold'>{title || 'Title Not Available'}</h3>
                                <p className="text-[#b9b9b9] font-light ">{date}</p>
                                <p className='leading-7 mb-4'
                                    dangerouslySetInnerHTML={{
                                        __html: detail ? detail.substring(0, 100) + ' [...]' : 'Detail not available'
                                    }}
                                />
                                <div className='blog-status-likes flex items-center'>
                                    <div className='blog-status flex'>
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
                                            className='status text-[#007bff] hover:underline'
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
                                        {isShareVisible[index] && (
                                            <div className="share-buttons flex space-x-2 ml-2">
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
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default BlogDetail;