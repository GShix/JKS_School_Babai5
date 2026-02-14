import {Link } from "react-router-dom";

interface BlogCardProps {
  blog: {
    id?: number;
    title?: string;
    content?: string;
    author?: string;
    createdAt?: string;
    featuredImage?: string;
    category?: string;
  };
}

const BlogCard = ({ blog }: BlogCardProps) => {
  // Extract plain text from HTML content for preview
  const getPlainText = (html: string) => {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  };

  return (
    <Link to={`/blogs/${blog.id}`} className="block hover:shadow-xl transition-shadow duration-300">
        <div className="flex flex-col overflow-hidden rounded-lg shadow-lg">
            <div className="flex-shrink-0">
                <img 
                    className="h-48 w-full object-cover" 
                    src={blog.featuredImage || "/img/jkss_logo.png"} 
                    alt={blog.title || "Blog post"} 
                />
            </div>
            <div className="flex flex-1 flex-col justify-between bg-white p-6">
                <div className="flex-1">
                    <p className="text-sm font-medium text-indigo-600">
                        <span className="hover:underline">{blog.category || "Blog Category"}</span>
                    </p>
                    <div className="mt-2 block">
                        <p className="text-xl font-semibold text-gray-900">{blog.title || "Untitled Blog Post"}</p>
                        <p className="mt-3 text-base text-gray-500">
                            {blog.content ? 
                                (() => {
                                  const plainText = getPlainText(blog.content);
                                  return plainText.length > 150 ? 
                                    plainText.substring(0, 150) + "..." : 
                                    plainText;
                                })() :
                                "No content available..."
                            }
                        </p>
                    </div>
                </div>
                <div className="mt-6 flex items-center">
                    <div className="flex-shrink-0">
                        <div>
                            <span className="sr-only">{blog.author || "Anonymous"}</span>
                            <img 
                                className="h-10 w-10 rounded-full" 
                                src="/img/jkss_logo.png" 
                                alt={blog.author || "Author"} 
                            />
                        </div>
                    </div>
                    <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">
                            <span className="hover:underline">{blog.author || "Anonymous"}</span>
                        </p>
                        <div className="flex space-x-1 text-sm text-gray-500">
                            <time dateTime={blog.createdAt}>
                                {blog.createdAt ? new Date(blog.createdAt).toLocaleDateString() : "Unknown date"}
                            </time>
                            <span aria-hidden="true">·</span>
                            <span>5 min read</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Link>
  )
}

export default BlogCard
