import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Header from "../../layouts/Header";
import Footer from "../../layouts/Footer";

interface Blog {
  id?: string;
  blogTitle: string;
  blogDescription: string;
  blogAuthor: string;
  publishedDate?: string;
  createdAt: string;
  blogImage?: string;
  blogCategory: string;
  blogStatus?: string;
  views?: number;
  tags?: string;
}

const BlogDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [showShareMenu, setShowShareMenu] = useState<boolean>(false);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(`/api/blogs/${id}`);
        setBlog(res.data.data || res.data);
      } catch (err) {
        setError("Failed to fetch blog");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchBlog();
  }, [id]);

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const title = blog?.blogTitle || "Check out this blog";
    switch (platform) {
      case "facebook":
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, "_blank");
        break;
      case "twitter":
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`, "_blank");
        break;
      case "linkedin":
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, "_blank");
        break;
      case "copy":
        navigator.clipboard.writeText(url);
        alert("Link copied to clipboard!");
        break;
      default:
        break;
    }
    setShowShareMenu(false);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
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
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Blog</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => navigate("/blogs")}
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
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="text-gray-400 text-6xl mb-4">📝</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Blog Not Found</h2>
            <p className="text-gray-600 mb-6">The blog you're looking for doesn't exist.</p>
            <button
              onClick={() => navigate("/blogs")}
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
      <div className="relative bg-white shadow-md max-w-3xl mx-auto mt-10 rounded-lg overflow-hidden">
        {blog.blogImage && (
          <img
            src={blog.blogImage}
            alt={blog.blogTitle}
            className="w-full h-72 object-cover"
            loading="lazy"
          />
        )}
        <div className="p-6 md:p-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
            <div className="flex items-center gap-3">
              <span className="inline-block bg-[#035CB0] text-white px-3 py-1 rounded-full text-xs font-semibold">
                {blog.blogCategory}
              </span>
              <span className="text-gray-500 text-xs">{formatDate(blog.publishedDate || blog.createdAt)}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowShareMenu((prev) => !prev)}
                className="flex items-center px-3 py-1 rounded-lg text-gray-600 hover:text-[#035CB0] hover:bg-blue-50 transition-colors font-medium border border-gray-200"
                aria-label="Share blog"
              >
                <i className="ri-share-line mr-1"></i>
                <span>Share</span>
              </button>
              {showShareMenu && (
                <div className="absolute right-6 mt-12 w-48 bg-white rounded-lg shadow-lg border z-50 animate-fade-in">
                  <div className="py-2">
                    <button
                      onClick={() => handleShare("facebook")}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <i className="ri-facebook-fill text-blue-600 mr-3"></i>
                      Facebook
                    </button>
                    <button
                      onClick={() => handleShare("twitter")}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <i className="ri-twitter-fill text-blue-400 mr-3"></i>
                      Twitter
                    </button>
                    <button
                      onClick={() => handleShare("linkedin")}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <i className="ri-linkedin-fill text-blue-700 mr-3"></i>
                      LinkedIn
                    </button>
                    <button
                      onClick={() => handleShare("copy")}
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
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
            {blog.blogTitle}
          </h1>
          <div className="flex items-center gap-3 mb-6">
            <span className="text-sm text-gray-700 font-medium">By {blog.blogAuthor}</span>
          </div>
          <div
            className="prose prose-lg max-w-none text-gray-800 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: blog.blogDescription }}
          />
          <div className="mt-8 flex justify-between items-center border-t pt-6">
            <Link
              to="/blogs"
              className="inline-block bg-[#035CB0] text-white px-6 py-2 rounded-lg hover:bg-[#023f7a] transition-colors font-medium"
            >
              ← Back to Blogs
            </Link>
            <span className="text-xs text-gray-400">School Blog</span>
          </div>
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

export default BlogDetail;
