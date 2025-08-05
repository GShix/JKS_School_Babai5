import { Link } from "react-router-dom";
import BlogCard from "../../components/BlogCard";
import Footer from "../../layouts/Footer";
import Header from "../../layouts/Header";
import axios from "axios";
import { useEffect, useState } from "react";

const AllBlogs = () => {
    const [blogs, setBlogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchBlogs = async () => {
        try {
            setLoading(true);
            const response = await axios.get("/api/blogs");
            console.log("API Response:", response.data);
            // Handle different possible response structures
            const blogData = response.data.data || [];
            setBlogs(Array.isArray(blogData) ? blogData : []);
            setError(null);
        } catch (err) {
            console.error("Error fetching blogs:", err);
            setError("Failed to fetch blogs");
            setBlogs([]); // Set to empty array on error
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBlogs();
    }, []);
    console.log(blogs)
  return (
    <div className="">
        <Header/>
        <div className="relative bg-gray-50 px-6 pt-10 pb-20 lg:px-8 lg:pt-20 lg:pb-20">
            <div className="absolute inset-0">
                <div className="h-1/3 bg-white sm:h-2/3" />
            </div>
            <div className="relative mx-auto max-w-7xl">
                <div className="text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-[#035CB0] sm:text-4xl">Our Blogs</h2>
                </div>
                <div className="create-blog flex items-center max-sm:justify-center justify-end">
                    <Link to="/blogs/create" className="mt-6 rounded-md bg-[#035CB0] px-4 py-2 text-base font-semibold text-white hover:bg-[#023f7a]">
                        Create New Blog
                    </Link>
                </div>

                {loading && (
                    <div className="text-center mt-12">
                        <p className="text-gray-600">Loading blogs...</p>
                    </div>
                )}

                {error && (
                    <div className="text-center mt-12">
                        <p className="text-red-600">{error}</p>
                        <button 
                            onClick={fetchBlogs}
                            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            Retry
                        </button>
                    </div>
                )}

                {!loading && !error && (
                    <div className="mx-auto mt-12 grid max-w-lg gap-5 lg:max-w-none lg:grid-cols-3">
                        {blogs.length > 0 ? (
                            blogs.map((blog, index) => (
                                <BlogCard key={blog.id || index} blog={blog} />
                            ))
                        ) : (
                            <div className="col-span-3 text-center">
                                <p className="text-gray-600">No blogs found.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
        <Footer/>
    </div>
  )
}

export default AllBlogs;