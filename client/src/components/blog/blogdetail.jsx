import React, { useState, useEffect } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import axios from 'axios';

const API = "http://localhost:4001/api";
const ImageSource = "http://localhost:4001";

const BlogDetail = () => {
  const { id } = useParams(); // get blog id from URL
  const location = useLocation();
  const stateBlog = location.state?.post; // Optional: blog passed from previous page

  const [blog, setBlog] = useState(stateBlog || null);
  const [currentLikeCount, setCurrentLikeCount] = useState(blog?.likeCount || 0);
  const [currentShareCount, setCurrentShareCount] = useState(blog?.shareCount || 0);
  const [latestBlogs, setLatestBlogs] = useState([]);

  // Fetch single blog by ID if not passed via state
  useEffect(() => {
    const fetchBlog = async () => {
      if (!blog) {
        try {
          const res = await axios.get(`${API}/blogsbyid/${id}`);
          setBlog(res.data);
          setCurrentLikeCount(res.data.likeCount || 0);
          setCurrentShareCount(res.data.shareCount || 0);
        } catch (err) {
          console.error("Error fetching blog:", err);
        }
      }
    };

    fetchBlog();
  }, [id, blog]);

  // Increment view count automatically
useEffect(() => {
    const incrementView = async () => {
      // FIX: Guard against undefined ID
      if (!id || id === "undefined") return; 

      try {
        await axios.put(`${API}/blogs/${id}/view`);
        // Optionally update local viewCount
        setBlog(prev => prev ? { ...prev, viewCount: (prev.viewCount || 0) + 1 } : prev);
      } catch (err) {
        console.error("Error incrementing view:", err);
      }
    };
    incrementView();
  }, [id]);

  // Fetch latest blogs for sidebar
  useEffect(() => {
    const fetchLatestBlogs = async () => {
      try {
        const response = await axios.get(`${API}/activeblogs`);
        const sorted = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setLatestBlogs(sorted.filter(b => b.id !== Number(id)).slice(0, 3));
      } catch (error) {
        console.error('Error fetching latest blogs:', error);
      }
    };
    fetchLatestBlogs();
  }, [id]);

  const formatDate = (isoString) => {
    if (!isoString) return 'Date not available';
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  // Like blog
  const handleLike = async () => {
    try {
      const liked = localStorage.getItem(`liked_${id}`);
      if (liked) return alert("You already liked this blog");

      await axios.put(`${API}/blogs/${id}/like`);
      localStorage.setItem(`liked_${id}`, true);
      setCurrentLikeCount(prev => prev + 1);
    } catch (err) {
      console.error(err);
    }
  };

  // Share blog
  const handleShare = async (platform) => {
    try {
      await axios.put(`${API}/blogs/${id}/share`);
      setCurrentShareCount(prev => prev + 1);

      const encodedTitle = encodeURIComponent(blog.blogTitle);
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

  if (!blog) return <p className="text-center mt-20">Loading blog...</p>;

  return (
    <div className="container mx-auto mt-20 flex flex-col items-center mb-8">
      <div className="border border-gray-200 shadow p-8 w-[90%] md:w-[55%] text-justify mb-5">
        <h2 className='text-4xl font-semibold'>{blog.blogTitle || 'Title Not Available'}</h2>
        <p className='text-gray-400'>{formatDate(blog.createdAt)}</p>

        <div className="media w-full h-[55vh] mb-5">
          {blog.mediaType === 'video' 
            ? <video src={`${ImageSource}${blog.mediaSrc}`} controls className="w-full h-full" /> 
            : <img src={`${ImageSource}${blog.mediaSrc}`} alt={blog.blogTitle} className="w-full h-full object-cover" />
          }
        </div>

        <div className="prose lg:prose-xl mx-auto my-4">
          <p className='leading-relaxed whitespace-pre-wrap' dangerouslySetInnerHTML={{ __html: blog.blogDescription || 'No detail found' }} />
        </div>

        <div className="flex space-x-4 mt-4">
          <button className='text-brown flex items-center' onClick={handleLike}>
            <i className="fa-regular fa-heart mr-1"></i> {currentLikeCount}
          </button>

          <button className='text-blue-500 flex items-center' onClick={() => handleShare('facebook')}>
            <i className="fa-solid fa-share mr-1"></i> {currentShareCount}
          </button>
        </div>
      </div>

      <h2 className='text-gray-400 m-0 text-2xl mb-2'>Other Blogs</h2>
      <div className="container flex flex-wrap m-auto justify-center">
        {latestBlogs.map((b) => (
          <div key={b.id} className="blog-details border mb-4 w-[90%] md:w-[30%] m-2">
            <div className="bmedia">
              {b.mediaType === 'video' 
                ? <video src={`${ImageSource}${b.mediaSrc}`} controls /> 
                : <img 
                    src={`${ImageSource}${b.mediaSrc}`} 
                    alt={b.blogTitle} 
                    className="w-full h-40 object-cover"
                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/400'; }}
                  />
              }
            </div>
            <div className="p-3">
              <h3 className='text-xl font-semibold'>{b.blogTitle || 'Title Not Available'}</h3>
              <p className="text-gray-400">{formatDate(b.createdAt)}</p>
              <p dangerouslySetInnerHTML={{ __html: b.blogDescription?.substring(0, 100) + ' [...]' }} />
              <Link
                to={`/blogdetail/${b.id}`}
                state={{ post: b }}
                className='text-blue-500 hover:underline'
              >
                Read more
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogDetail;
