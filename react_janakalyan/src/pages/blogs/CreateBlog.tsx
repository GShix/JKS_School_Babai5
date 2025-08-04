
import Footer from "../../layouts/Footer"
import Header from "../../layouts/Header"

const CreateBlog = () => {
  return (
    <div className="create-blog">
        <Header />
        <div className="container p-4 mb-10 border-b border-gray-200">
            {/* Page Title */}
            <h1 className="text-3xl font-bold text-[#035CB0] mx-4 sm:p-4 max-sm:py-2 flex justify-center sm:mt-5 max-sm:my-4">Create new Blog</h1>
            <div className="form w-full flex flex-col items-center">
                <form className="grid grid-cols-1 gap-6 shadow-lg bg-gray-50 p-4 sm:p-10 rounded-lg">
                    {/* Title */}
                    <div className="p-2">
                    <input type="text" id="title" name="title" placeholder="Event Title" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2" style={{backgroundColor: '#f6f6f6'}} />
                    </div>
                    {/* Category */}
                    <div className="p-2">
                    <select id="category" name="category" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2" style={{backgroundColor: '#f6f6f6'}}>
                        <option value="">Select a category</option>
                        <option>Music</option>
                        <option>Sports</option>
                        <option>Arts</option>
                        <option>Technology</option>
                    </select>
                    </div>
                    {/* Description and Image Upload */}
                    <div className="p-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Description */}
                    <div>
                        <textarea id="description" name="description" rows={3} placeholder="Event Description" className="block w-full h-48 rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2" style={{backgroundColor: '#f6f6f6'}} defaultValue={""} />
                    </div>
                    {/* Image Upload */}
                    <div>
                        <label htmlFor="image-upload" className="w-full h-48 border-2 border-dashed border-gray-300 rounded-md cursor-pointer flex flex-col items-center justify-center bg-[#f6f6f6] hover:bg-gray-50">
                        <div className="text-center">
                            <div className="mb-2">
                            <button type="button" className="bg-[#8c0327] hover:bg-[#6b0220] text-white rounded-full py-2 px-4">Select from the computer</button>
                            </div>
                            <p className="text-gray-500">or drag photo here</p>
                            <p className="text-gray-500 text-sm mt-1">PNG, JPG, SVG</p>
                        </div>
                        </label>
                        <input id="image-upload" name="image" type="file" accept="image/*" className="sr-only" />
                    </div>
                    </div>
                    {/* Location */}
                    <div className="p-2">
                    <input type="text" id="location" name="location" placeholder="Location" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2" style={{backgroundColor: '#f6f6f6'}} />
                    </div>
                    {/* Organizer Name and Email */}
                    <div className="p-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Organizer Name */}
                    <div>
                        <input type="text" id="organizer-name" name="organizer-name" placeholder="Organizer Name" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2" style={{backgroundColor: '#f6f6f6'}} />
                    </div>
                    {/* Organizer Email */}
                    <div>
                        <input type="email" id="organizer-email" name="organizer-email" placeholder="Organizer Email" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2" style={{backgroundColor: '#f6f6f6'}} />
                    </div>
                    </div>
                    {/* Organizer Address */}
                    <div className="p-2">
                    <input type="text" id="organizer-address" name="organizer-address" placeholder="Organizer Address" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2" style={{backgroundColor: '#f6f6f6'}} />
                    </div>
                    {/* Start Date and End Date */}
                    <div className="p-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Start Date */}
                    <div className="flex items-center bg-[#f6f6f6] rounded-md p-2">
                        <span className="flex-shrink-0 flex items-center mr-3 text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v2M19 3v2M5 10h14M4 21h16a1 1 0 001-1V8a1 1 0 00-1-1H4a1 1 0 00-1 1v12a1 1 0 001 1z" />
                        </svg>
                        <span className="ml-2">Start Date</span>
                        </span>
                        <input type="datetime-local" id="start-date" name="start-date" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2" style={{backgroundColor: '#f6f6f6'}} />
                    </div>
                    {/* End Date */}
                    <div className="flex items-center bg-[#f6f6f6] rounded-md p-2">
                        <span className="flex-shrink-0 flex items-center mr-3 text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v2M19 3v2M5 10h14M4 21h16a1 1 0 001-1V8a1 1 0 00-1-1H4a1 1 0 00-1 1v12a1 1 0 001 1z" />
                        </svg>
                        <span className="ml-2">End Date</span>
                        </span>
                        <input type="datetime-local" id="end-date" name="end-date" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2" style={{backgroundColor: '#f6f6f6'}} />
                    </div>
                    </div>
                    {/* Status and Tags */}
                    <div className="p-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Status */}
                    <div className="flex items-center bg-[#f6f6f6] rounded-md">
                        <select id="status" name="status" className="block w-full h-12 rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50" style={{backgroundColor: '#f6f6f6', padding: 0}}>
                        <option value="">Select Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        </select>
                    </div>
                    {/* Tags */}
                    <div>
                        <input type="text" id="tags" name="tags" placeholder="Tags (comma-separated)" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 h-12" style={{backgroundColor: '#f6f6f6'}} />
                    </div>
                    </div>
                    {/* Registration Button */}
                    <div className="col-span-full mt-6 p-2">
                    <button type="submit" className="block w-full bg-[#8c0327] hover:bg-[#6b0220] text-white font-bold py-3 px-4 rounded-full">
                        Register for Event
                    </button>
                    </div>
                </form>
            </div>
        </div>
        <Footer />
    </div>

  )
}

export default CreateBlog