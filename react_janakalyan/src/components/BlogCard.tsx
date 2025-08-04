
const BlogCard = () => {
  return (
    <div className="flex flex-col overflow-hidden rounded-lg shadow-lg">
        <div className="flex-shrink-0">
            <img className="h-48 w-full object-cover" src="https://images.unsplash.com/photo-1492724441997-5dc865305da7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1679&q=80" alt="" />
        </div>
        <div className="flex flex-1 flex-col justify-between bg-white p-6">
            <div className="flex-1">
                <p className="text-sm font-medium text-indigo-600">
                <a href="#" className="hover:underline">Case Study</a>
                </p>
                <a href="#" className="mt-2 block">
                <p className="text-xl font-semibold text-gray-900">Improve your customer experience</p>
                <p className="mt-3 text-base text-gray-500">Lorem ipsum dolor sit amet consectetur adipisicing elit. Sint
                    harum rerum voluptatem quo recusandae magni placeat saepe molestiae, sed excepturi cumque corporis
                    perferendis hic.</p>
                </a>
            </div>
            <div className="mt-6 flex items-center">
                <div className="flex-shrink-0">
                <a href="#">
                    <span className="sr-only">Daniela Metz</span>
                    <img className="h-10 w-10 rounded-full" src="https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />
                </a>
                </div>
                <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">
                    <a href="#" className="hover:underline">Daniela Metz</a>
                </p>
                <div className="flex space-x-1 text-sm text-gray-500">
                    <time dateTime="2020-02-12">Feb 12, 2020</time>
                    <span aria-hidden="true">·</span>
                    <span>11 min read</span>
                </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default BlogCard