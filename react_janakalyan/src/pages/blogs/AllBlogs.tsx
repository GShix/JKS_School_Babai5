import { Link } from "react-router-dom";
import BlogCard from "../../components/BlogCard";
import Footer from "../../layouts/Footer";
import Header from "../../layouts/Header";

const AllBlogs = () => {
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
                <div className="mx-auto mt-12 grid max-w-lg gap-5 lg:max-w-none lg:grid-cols-3">
                <BlogCard />
                <BlogCard />
                <BlogCard />
                </div>
            </div>
        </div>
        <Footer/>
    </div>
  )
}

export default AllBlogs;