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
        <main className='min-h-screen px-10 py-2'>
            <h1 className='font-bold text-2xl text-[#035CB0]'>Recent Notices:</h1>
            {allNotices.map((notice) => (
                <div key={notice.id} className="notice">
                    <Link to={`/notices/${notice.id}`}>
                        <h1>{notice.title}</h1>
                    </Link>
                </div>
            ))}
        </main>
        <Footer/>
    </div>
  )
}

export default Notices