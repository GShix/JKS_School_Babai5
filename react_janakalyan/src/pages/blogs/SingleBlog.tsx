import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Header from "../../layouts/Header";
import Footer from "../../layouts/Footer";

interface Blog {
  blogTitle: string;
  blogAuthor: string;
  authorImage?: string;
  blogDescription: string;
  blogCreatedAt: string;
  blogImage: string;
  blogCategory: string;
  id?: string;
}

const SingleBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(`/api/blogs/${id}`);
        setBlog(res.data.data || res.data);
      } catch (err) {
        setError('Failed to fetch blog');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  const handleLike = () => {
    setLiked(!liked);
  };

  const handleBookmark = () => {
    setBookmarked(!bookmarked);
  };

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const title = blog?.blogTitle || 'Check out this blog';
    
    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        alert('Link copied to clipboard!');
        break;
    }
    setShowShareMenu(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getReadingTime = (text: string) => {
    const wordsPerMinute = 200;
    const words = text.split(' ').length;
    const readingTime = Math.ceil(words / wordsPerMinute);
    return readingTime;
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#035CB0] mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading blog...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Blog</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button 
              onClick={() => navigate('/blogs')}
              className="bg-[#035CB0] text-white px-6 py-2 rounded-lg hover:bg-[#023f7a] transition-colors"
            >
              Back to Blogs
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="text-gray-400 text-6xl mb-4">📝</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Blog Not Found</h2>
            <p className="text-gray-600 mb-6">The blog you're looking for doesn't exist.</p>
            <button 
              onClick={() => navigate('/blogs')}
              className="bg-[#035CB0] text-white px-6 py-2 rounded-lg hover:bg-[#023f7a] transition-colors"
            >
              Back to Blogs
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <div className="relative h-96 bg-gradient-to-r from-[#035CB0] to-blue-600">
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        <div className="relative z-10 flex items-center justify-center h-full px-4">
          <div className="text-center text-white max-w-4xl">
            <div className="mb-4">
              <span className="inline-block bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm font-medium">
                {blog.blogCategory}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              {blog.blogTitle}
            </h1>
            <div className="flex items-center justify-center space-x-6 text-sm">
              <div className="flex items-center space-x-2">
                <img 
                  src={blog.authorImage || "/img/icon.png"} 
                  alt={blog.blogAuthor}
                  className="w-8 h-8 rounded-full border-2 border-white"
                />
                <span>{blog.blogAuthor}</span>
              </div>
              <span>•</span>
              <span>{formatDate(blog.blogCreatedAt)}</span>
              <span>•</span>
              <span>{getReadingTime(blog.blogDescription)} min read</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link 
              to="/blogs" 
              className="flex items-center text-gray-600 hover:text-[#035CB0] transition-colors"
            >
              <i className="ri-arrow-left-line mr-2"></i>
              Back to Blogs
            </Link>
            
            <div className="flex items-center space-x-4">
              {/* Like Button */}
              <button 
                onClick={handleLike}
                className={`flex items-center space-x-1 px-3 py-1 rounded-lg transition-colors ${
                  liked ? 'text-red-500 bg-red-50' : 'text-gray-600 hover:text-red-500 hover:bg-red-50'
                }`}
              >
                <i className={`${liked ? 'ri-heart-fill' : 'ri-heart-line'}`}></i>
                <span>Like</span>
              </button>

              {/* Bookmark Button */}
              <button 
                onClick={handleBookmark}
                className={`flex items-center space-x-1 px-3 py-1 rounded-lg transition-colors ${
                  bookmarked ? 'text-blue-500 bg-blue-50' : 'text-gray-600 hover:text-blue-500 hover:bg-blue-50'
                }`}
              >
                <i className={`${bookmarked ? 'ri-bookmark-fill' : 'ri-bookmark-line'}`}></i>
                <span>Save</span>
              </button>

              {/* Share Button */}
              <div className="relative">
                <button 
                  onClick={() => setShowShareMenu(!showShareMenu)}
                  className="flex items-center space-x-1 px-3 py-1 rounded-lg text-gray-600 hover:text-[#035CB0] hover:bg-blue-50 transition-colors"
                >
                  <i className="ri-share-line"></i>
                  <span>Share</span>
                </button>

                {/* Share Dropdown */}
                {showShareMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-50">
                    <div className="py-2">
                      <button 
                        onClick={() => handleShare('facebook')}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <i className="ri-facebook-fill text-blue-600 mr-3"></i>
                        Share on Facebook
                      </button>
                      <button 
                        onClick={() => handleShare('twitter')}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <i className="ri-twitter-fill text-blue-400 mr-3"></i>
                        Share on Twitter
                      </button>
                      <button 
                        onClick={() => handleShare('linkedin')}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <i className="ri-linkedin-fill text-blue-700 mr-3"></i>
                        Share on LinkedIn
                      </button>
                      <button 
                        onClick={() => handleShare('copy')}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <i className="ri-file-copy-line text-gray-600 mr-3"></i>
                        Copy Link
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <article className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Featured Image */}
          {blog.blogImage && (
            <div className="w-full h-64 md:h-96 relative">
              <img 
                src={blog.blogImage} 
                alt={blog.blogTitle}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
          )}

          {/* Content */}
          <div className="p-6 md:p-8">
            {/* Author Info */}
            <div className="flex items-center space-x-4 mb-8 pb-6 border-b">
              <img 
                src={blog.authorImage || "/img/icon.png"} 
                alt={blog.blogAuthor}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <h3 className="font-semibold text-lg text-gray-900">{blog.blogAuthor}</h3>
                <p className="text-gray-600">Published on {formatDate(blog.blogCreatedAt)}</p>
              </div>
            </div>

            {/* Blog Content */}
            <div className="prose prose-lg max-w-none">
              <div className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                {blog.blogDescription}
              </div>
            </div>

            {/* Tags */}
            <div className="mt-8 pt-6 border-t">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-500">Category:</span>
                <span className="inline-block bg-[#035CB0] text-white px-3 py-1 rounded-full text-sm">
                  {blog.blogCategory}
                </span>
              </div>
            </div>
          </div>
        </article>

        {/* Call to Action */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6 text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-2">Enjoyed this article?</h3>
          <p className="text-gray-600 mb-4">Check out more of our blogs</p>
          <Link 
            to="/blogs" 
            className="inline-block bg-[#035CB0] text-white px-6 py-3 rounded-lg hover:bg-[#023f7a] transition-colors"
          >
            View All Blogs
          </Link>
        </div>
      </div>

      <Footer />

      {/* Click outside to close share menu */}
      {showShareMenu && (
        <div 
          className="fixed inset-0 z-30" 
          onClick={() => setShowShareMenu(false)}
        ></div>
      )}
    </div>
  );
};

export default SingleBlog