import BlogCard from "../../components/BlogCard";
import Footer from "../../layouts/Footer";
import Header from "../../layouts/Header";
import { useEffect, useState } from "react";
import { API_BASE_URL, type Blog } from "../../api";
import axios from "axios";

const Blogs = () => {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchBlogs = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_BASE_URL}/blogs`);
            setBlogs(response.data.data || []);
        } catch (error) {
            setError('Failed to fetch blogs. Please try again later.');
            console.error('Error fetching blogs:', error);
            setBlogs([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBlogs();
    }, []);
    // console.log(blogs)
    return (
        <div className="">
            <Header />
            <div className="relative bg-gray-50 px-6 pt-10 pb-20 lg:px-8 lg:pt-20 lg:pb-20">
                <div className="absolute inset-0">
                    <div className="h-1/3 bg-white sm:h-2/3" />
                </div>
                <div className="relative mx-auto max-w-7xl">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold tracking-tight text-[#035CB0] sm:text-4xl">Our Blogs</h2>
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
                                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer"
                            >
                                Retry
                            </button>
                        </div>
                    )}

                    {!loading && !error && (
                        <div className="mx-auto mt-12 grid max-w-lg gap-5 lg:max-w-none lg:grid-cols-3">
                            {blogs.length > 0 ? (
                                blogs.map((blog, index) => (
                                    <BlogCard
                                        key={blog.id || index}
                                        blog={{
                                            id: blog.id,
                                            title: blog.blogTitle,
                                            content: blog.blogDescription,
                                            author: blog.blogAuthor,
                                            createdAt: blog.publishedDate || blog.createdAt,
                                            featuredImage: blog.blogImage,
                                            category: blog.blogCategory
                                        }}
                                    />
                                ))
                            ) : (
                                <div className="col-span-3 text-center">
                                    <p className="text-gray-600">No published blogs found.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default Blogs;