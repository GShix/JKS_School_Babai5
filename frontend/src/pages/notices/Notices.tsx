import { Link } from 'react-router-dom'
import Footer from '../../layouts/Footer'
import Header from '../../layouts/Header'

const Notices = () => {
    const allNotices = [
        {
            id: 1,
            title: "admission open"
        },
        {
            id: 2,
            title: "form open"
        },
        {
            id: 3,
            title: "class open"
        },
    ]
  return (
    <div>
        <Header/>
        <main className='min-h-screen px-3 sm:px-12 py-4'>
            <h1 className='font-bold text-2xl text-[#035CB0]'>Notices</h1>
            <h2 className='font-medium text-lg '>Notices of Janakalyan Secondary School:</h2>
            <h2 className='font-light text-md italic mt-4'>Showing 10 of 14 Results</h2>
            <div className="notice-section flex gap-4 max-sm:flex-col mt-10 order min-h-screen">
                <div className="md:w-2/3 ">
                    <div className="notices border-b border-gray-300 pb-2 mb-2">
                        <Link to={`/notices/1`} className='font-semibold text-lg hover:text-[#035CB0] cursor-pointer'>सिलबन्दी दरभाउपत्र आहवानकाे सूचना</Link>
                        <p className='author text-sm mt-2'>By <span className='text-md font-semibold text-[#035CB0]'>Kankali Secondary School </span><span>May 15, 2025</span></p>
                    </div>
                </div>
                <div className="md:w-1/3">
                    <h1 className='font-semibold text-lg mb-2'>Latest Notices</h1>
                    <div className="latest-notices w-full">
                        {allNotices.map((notice) => (
                            <div key={notice.id} className="notice pb-2 mb-4">
                                <Link to={`/notices/${notice.id}`} className='flex items-center gap-2 w-full'> 
                                    <img className='w-18 h-auto' src="/img/jkss_logo.png" alt="notice-title" />
                                    <h1 className='font-medium text-md mb-2 hover:text-[#035CB0]'>{notice.title}</h1>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {/* {allNotices.map((notice) => (
                <div key={notice.id} className="notice">
                    <Link to={`/notices/${notice.id}`}>
                        <h1>{notice.title}</h1>
                    </Link>
                </div>
            ))} */}
        </main>
        <Footer/>
    </div>
  )
}

export default Notices