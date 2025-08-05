
interface BlogCardProps {
  blog: {
    id?: string;
    blogTitle?: string;
    blogDescription?: string;
    blogAuthor?: string;
    blogCreatedAt?: string;
    blogImage?: string;
    blogCategory?: string;
  };
}

const BlogCard = ({ blog }: BlogCardProps) => {
  return (
    <div className="flex flex-col overflow-hidden rounded-lg shadow-lg">
        <div className="flex-shrink-0">
            <img 
                className="h-48 w-full object-cover" 
                src={blog.blogImage || "https://images.unsplash.com/photo-1492724441997-5dc865305da7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1679&q=80"} 
                alt={blog.blogTitle || "Blog post"} 
            />
        </div>
        <div className="flex flex-1 flex-col justify-between bg-white p-6">
            <div className="flex-1">
                <p className="text-sm font-medium text-indigo-600">
                    <a href="#" className="hover:underline">{blog.blogCategory || "Blog Post"}</a>
                </p>
                <a href="#" className="mt-2 block">
                    <p className="text-xl font-semibold text-gray-900">{blog.blogTitle || "Untitled Blog Post"}</p>
                    <p className="mt-3 text-base text-gray-500">
                        {blog.blogDescription ? 
                            (blog.blogDescription.length > 150 ? 
                                blog.blogDescription.substring(0, 150) + "..." : 
                                blog.blogDescription
                            ) : 
                            "No content available..."
                        }
                    </p>
                </a>
            </div>
            <div className="mt-6 flex items-center">
                <div className="flex-shrink-0">
                    <a href="#">
                        <span className="sr-only">{blog.blogAuthor || "Anonymous"}</span>
                        <img 
                            className="h-10 w-10 rounded-full" 
                            src="https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
                            alt={blog.blogAuthor || "Author"} 
                        />
                    </a>
                </div>
                <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">
                        <a href="#" className="hover:underline">{blog.blogAuthor || "Anonymous"}</a>
                    </p>
                    <div className="flex space-x-1 text-sm text-gray-500">
                        <time dateTime={blog.blogCreatedAt}>
                            {blog.blogCreatedAt ? new Date(blog.blogCreatedAt).toLocaleDateString() : "Unknown date"}
                        </time>
                        <span aria-hidden="true">·</span>
                        <span>5 min read</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default BlogCard