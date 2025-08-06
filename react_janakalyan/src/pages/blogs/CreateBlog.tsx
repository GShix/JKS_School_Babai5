
// import Footer from "../../layouts/Footer"
// import Header from "../../layouts/Header"

// const CreateBlog = () => {
//   return (
//     <div className="create-blog">
//         <Header />
//         <div className="container p-4 mb-10 border-b border-gray-200">
//             {/* Page Title */}
//             <h1 className="text-3xl font-bold text-[#035CB0] mx-4 sm:p-4 max-sm:py-2 flex justify-center sm:mt-5 max-sm:my-4">Create new Blog</h1>
//             <div className="form w-full flex flex-col items-center">
//                 <form className="grid grid-cols-1 gap-6 shadow-lg bg-gray-50 p-4 sm:p-10 rounded-lg">
//                     {/* Title */}
//                     <div className="p-2">
//                     <input type="text" id="title" name="title" placeholder="Event Title" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2" style={{backgroundColor: '#f6f6f6'}} />
//                     </div>
//                     {/* Category */}
//                     <div className="p-2">
//                     <select id="category" name="category" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2" style={{backgroundColor: '#f6f6f6'}}>
//                         <option value="">Select a category</option>
//                         <option>Music</option>
//                         <option>Sports</option>
//                         <option>Arts</option>
//                         <option>Technology</option>
//                     </select>
//                     </div>
//                     {/* Description and Image Upload */}
//                     <div className="p-2 grid grid-cols-1 md:grid-cols-2 gap-6">
//                     {/* Description */}
//                     <div>
//                         <textarea id="description" name="description" rows={3} placeholder="Event Description" className="block w-full h-48 rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2" style={{backgroundColor: '#f6f6f6'}} defaultValue={""} />
//                     </div>
//                     {/* Image Upload */}
//                     <div>
//                         <label htmlFor="image-upload" className="w-full h-48 border-2 border-dashed border-gray-300 rounded-md cursor-pointer flex flex-col items-center justify-center bg-[#f6f6f6] hover:bg-gray-50">
//                         <div className="text-center">
//                             <div className="mb-2">
//                             <button type="button" className="bg-[#8c0327] hover:bg-[#6b0220] text-white rounded-full py-2 px-4">Select from the computer</button>
//                             </div>
//                             <p className="text-gray-500">or drag photo here</p>
//                             <p className="text-gray-500 text-sm mt-1">PNG, JPG, SVG</p>
//                         </div>
//                         </label>
//                         <input id="image-upload" name="image" type="file" accept="image/*" className="sr-only" />
//                     </div>
//                     </div>
//                     {/* Location */}
//                     <div className="p-2">
//                     <input type="text" id="location" name="location" placeholder="Location" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2" style={{backgroundColor: '#f6f6f6'}} />
//                     </div>
//                     {/* Organizer Name and Email */}
//                     <div className="p-2 grid grid-cols-1 md:grid-cols-2 gap-6">
//                     {/* Organizer Name */}
//                     <div>
//                         <input type="text" id="organizer-name" name="organizer-name" placeholder="Organizer Name" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2" style={{backgroundColor: '#f6f6f6'}} />
//                     </div>
//                     {/* Organizer Email */}
//                     <div>
//                         <input type="email" id="organizer-email" name="organizer-email" placeholder="Organizer Email" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2" style={{backgroundColor: '#f6f6f6'}} />
//                     </div>
//                     </div>
//                     {/* Organizer Address */}
//                     <div className="p-2">
//                     <input type="text" id="organizer-address" name="organizer-address" placeholder="Organizer Address" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2" style={{backgroundColor: '#f6f6f6'}} />
//                     </div>
//                     {/* Start Date and End Date */}
//                     <div className="p-2 grid grid-cols-1 md:grid-cols-2 gap-6">
//                     {/* Start Date */}
//                     <div className="flex items-center bg-[#f6f6f6] rounded-md p-2">
//                         <span className="flex-shrink-0 flex items-center mr-3 text-gray-500">
//                         <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v2M19 3v2M5 10h14M4 21h16a1 1 0 001-1V8a1 1 0 00-1-1H4a1 1 0 00-1 1v12a1 1 0 001 1z" />
//                         </svg>
//                         <span className="ml-2">Start Date</span>
//                         </span>
//                         <input type="datetime-local" id="start-date" name="start-date" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2" style={{backgroundColor: '#f6f6f6'}} />
//                     </div>
//                     {/* End Date */}
//                     <div className="flex items-center bg-[#f6f6f6] rounded-md p-2">
//                         <span className="flex-shrink-0 flex items-center mr-3 text-gray-500">
//                         <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v2M19 3v2M5 10h14M4 21h16a1 1 0 001-1V8a1 1 0 00-1-1H4a1 1 0 00-1 1v12a1 1 0 001 1z" />
//                         </svg>
//                         <span className="ml-2">End Date</span>
//                         </span>
//                         <input type="datetime-local" id="end-date" name="end-date" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2" style={{backgroundColor: '#f6f6f6'}} />
//                     </div>
//                     </div>
//                     {/* Status and Tags */}
//                     <div className="p-2 grid grid-cols-1 md:grid-cols-2 gap-6">
//                     {/* Status */}
//                     <div className="flex items-center bg-[#f6f6f6] rounded-md">
//                         <select id="status" name="status" className="block w-full h-12 rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50" style={{backgroundColor: '#f6f6f6', padding: 0}}>
//                         <option value="">Select Status</option>
//                         <option value="active">Active</option>
//                         <option value="inactive">Inactive</option>
//                         </select>
//                     </div>
//                     {/* Tags */}
//                     <div>
//                         <input type="text" id="tags" name="tags" placeholder="Tags (comma-separated)" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 h-12" style={{backgroundColor: '#f6f6f6'}} />
//                     </div>
//                     </div>
//                     {/* Registration Button */}
//                     <div className="col-span-full mt-6 p-2">
//                     <button type="submit" className="block w-full bg-[#8c0327] hover:bg-[#6b0220] text-white font-bold py-3 px-4 rounded-full">
//                         Register for Event
//                     </button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//         <Footer />
//     </div>

//   )
// }

// export default CreateBlog
import React, { useState } from 'react';
import Header from '../../layouts/Header';
import Footer from '../../layouts/Footer';
import { Link } from 'react-router-dom';

interface BlogFormData {
  blogTitle: string;
  blogDescription: string;
  blogAuthor: string;
  blogStatus: string;
  blogImage: string;
  blogCategory: string;
}

interface BlogFormProps {
  onSubmit?: (data: BlogFormData) => void;
}

const BlogForm: React.FC<BlogFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<BlogFormData>({
    blogTitle: '',
    blogDescription: '',
    blogAuthor: '',
    blogStatus: 'published',
    blogImage: '',
    blogCategory: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const categories = [
    'Technology',
    'Health',
    'Education',
    'Lifestyle',
    'Business',
    'Travel',
    'Food',
    'Sports',
    'Entertainment',
    'Politics',
    'Science',
    'Other'
  ];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      // Validate required fields
      if (!formData.blogTitle || !formData.blogDescription || !formData.blogAuthor) {
        throw new Error('Please fill in all required fields');
      }

      // Call API to create blog
      const response = await fetch('http://localhost:4000/api/blogs/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'Blog created successfully!' });
        // Reset form
        setFormData({
          blogTitle: '',
          blogDescription: '',
          blogAuthor: '',
          blogStatus: 'published',
          blogImage: '',
          blogCategory: ''
        });
        
        // Call parent callback if provided
        if (onSubmit) {
          onSubmit(formData);
        }
      } else {
        throw new Error(result.message || 'Failed to create blog');
      }
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'An error occurred' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      blogTitle: '',
      blogDescription: '',
      blogAuthor: '',
      blogStatus: 'published',
      blogImage: '',
      blogCategory: ''
    });
    setMessage(null);
  };

  return (
    <div className="create-blog">
        <Header />
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-5 mb-10 relative">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Create New Blog Post
        </h2>
        <Link to="/blogs" className="absolute top-4 right-5 text-blue-500 hover:bg-red-500 hover:text-white p-1 transition-colors duration-200">
            <i className="ri-close-line text-red-500 hover:text-white text-4xl cursor-pointer" onClick={handleReset}></i>
        </Link>
        
        {message && (
            <div className={`mb-6 p-4 rounded-md border ${
            message.type === 'success' 
                ? 'bg-green-50 border-green-200 text-green-800' 
                : 'bg-red-50 border-red-200 text-red-800'
            }`}>
            <div className="flex">
                <div className="flex-shrink-0">
                {message.type === 'success' ? (
                    <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                ) : (
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                )}
                </div>
                <div className="ml-3">
                <p className="font-medium">{message.text}</p>
                </div>
            </div>
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Blog Title */}
            <div>
            <label htmlFor="blogTitle" className="block text-sm font-medium text-gray-700 mb-2">
                Blog Title <span className="text-red-500">*</span>
            </label>
            <input
                type="text"
                id="blogTitle"
                name="blogTitle"
                value={formData.blogTitle}
                onChange={handleInputChange}
                placeholder="Enter an engaging blog title"
                required
                maxLength={200}
                className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            />
            </div>

            {/* Author and Category Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label htmlFor="blogAuthor" className="block text-sm font-medium text-gray-700 mb-2">
                Author <span className="text-red-500">*</span>
                </label>
                <input
                type="text"
                id="blogAuthor"
                name="blogAuthor"
                value={formData.blogAuthor}
                onChange={handleInputChange}
                placeholder="Enter author name"
                required
                maxLength={100}
                className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                />
            </div>

            <div>
                <label htmlFor="blogCategory" className="block text-sm font-medium text-gray-700 mb-2">
                Category
                </label>
                <select
                id="blogCategory"
                name="blogCategory"
                value={formData.blogCategory}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                >
                <option value="">Select a category</option>
                {categories.map(category => (
                    <option key={category} value={category}>
                    {category}
                    </option>
                ))}
                </select>
            </div>
            </div>

            {/* Status and Image Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label htmlFor="blogStatus" className="block text-sm font-medium text-gray-700 mb-2">
                Status
                </label>
                <select
                id="blogStatus"
                name="blogStatus"
                value={formData.blogStatus}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                >
                <option value="published">📝 Published</option>
                <option value="draft">📋 Draft</option>
                <option value="archived">📦 Archived</option>
                </select>
            </div>

            <div>
                <label htmlFor="blogImage" className="block text-sm font-medium text-gray-700 mb-2">
                Featured Image URL
                </label>
                <input
                type="url"
                id="blogImage"
                name="blogImage"
                value={formData.blogImage}
                onChange={handleInputChange}
                placeholder="https://example.com/image.jpg"
                className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                />
            </div>
            </div>

            {/* Blog Description */}
            <div>
            <label htmlFor="blogDescription" className="block text-sm font-medium text-gray-700 mb-2">
                Blog Description <span className="text-red-500">*</span>
            </label>
            <textarea
                id="blogDescription"
                name="blogDescription"
                value={formData.blogDescription}
                onChange={handleInputChange}
                placeholder="Write your blog content here... Share your thoughts, insights, and ideas!"
                required
                rows={8}
                maxLength={5000}
                className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 resize-y"
            />
            <div className="mt-2 flex justify-between text-sm text-gray-500">
                <span>Minimum 50 characters recommended</span>
                <span className={`${formData.blogDescription.length > 4500 ? 'text-red-500' : ''}`}>
                {formData.blogDescription.length}/5000 characters
                </span>
            </div>
            </div>

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row sm:justify-between gap-4 pt-6 border-t border-gray-200">
            <div className="buttons flex flex-col sm:flex-row sm:justify-between gap-4">
                <button
                    type="button"
                    onClick={handleReset}
                    disabled={isLoading}
                    className="cursor-pointer px-6 py-3 border border-gray-300 text-gray-700 hover:text-white rounded-md hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                    Reset Form
                </button>
                
                <button
                    type="submit"
                    disabled={isLoading}
                    className="cursor-pointer flex-1 sm:flex-none px-8 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium relative"
                >
                    {isLoading ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating Blog...
                    </>
                    ) : (
                    'Create Blog Post'
                    )}
                </button>
            </div>
            <div className="gotoallblogs flex justify-end">

                <Link to="/blogs" className='flex-1 flex justify-center px-8 py-3 bg-gray-500 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium relative'>
                    Go to All Blogs
                </Link>
            </div>
            </div>
        </form>

        {/* Preview Card (if image URL is provided) */}
        {formData.blogImage && (
            <div className="mt-8 p-4 border border-gray-200 rounded-lg bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Preview</h3>
            <div className="bg-white rounded-md p-4 shadow-sm">
                <img 
                src={formData.blogImage} 
                alt="Blog preview" 
                className="w-full h-48 object-cover rounded-md mb-4"
                onError={(e) => {
                    e.currentTarget.style.display = 'none';
                }}
                />
                <h4 className="text-xl font-semibold text-gray-800 mb-2">{formData.blogTitle}</h4>
                <p className="text-sm text-gray-500 mb-4">
                {new Date().toLocaleString('default', { month: 'long', day: 'numeric', year: 'numeric' })} 
                {' '}• {formData.blogAuthor} 
                {' '}• {formData.blogStatus === 'published' ? '✅ Published' : formData.blogStatus === 'draft' ? '📝 Draft' : '📦 Archived'}
                </p>
                <p className="text-gray-700 mb-4">{formData.blogDescription}</p>
                <div className="flex flex-wrap gap-2">
                {formData.blogCategory.split(',').map((category, index) => (
                    <span key={index} className="text-xs font-medium bg-blue-100 text-blue-800 rounded-full px-3 py-1">
                    {category.trim()}
                    </span>
                ))}
                </div>
            </div>
            </div>
        )}
        </div>
        <Footer />
    </div>
  );
};

export default BlogForm;



