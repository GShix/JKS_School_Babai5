import React from 'react'
// import ActivitiesGallery from '../../components/Activities_gallery';

import { AcademicProgramsCard } from '../../components/AcademicProgramsCard';
import Banner from '../../components/Banner';
import FAQ from '../../components/FAQ';
import Hero from '../../components/Hero'
import MessageFromPrincipal from '../../components/MessageFromPrincipal';
import SchoolIntroduction_Notice from '../../components/SchoolIntroduction_Notice';
// import UpcomingEvents from '../../components/UpcomingEvents';
import Footer from '../../layouts/Footer';
import Header from '../../layouts/Header';
import { initialNotices } from '../notices/Notices';
import { Link } from 'react-router-dom';

const Home = () =>{
    // console.log(posts)
    const [showNoticesIntro, setShowNoticesIntro] = React.useState(false)

    React.useEffect(() => {
        try {
            const dismissed = sessionStorage.getItem('homeNoticesDismissed')
            if (!dismissed) setShowNoticesIntro(true)
        } catch (err) {
            setShowNoticesIntro(true)
        }
    }, [])

// const scroll = new LocomotiveScroll();
// console.log(posts)
    return (
        <div className='h-full bg-white w-full relative'>
            {/* <h1 className="text-red-500">This is Home Page</h1> */}
            <Header/>

            <Hero/>
            {/* Notices intro modal on first open */}
            {showNoticesIntro && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                    <div className="bg-white w-11/12 md:w-2/3 lg:w-1/2 p-6 rounded shadow-lg h-screen overflow-auto">
                        <div className="flex items-start justify-between">
                            <div>
                                <h2 className="text-xl font-semibold">Recent Notices</h2>
                            </div>
                            <button className="px-3 py-1 border rounded hover:bg-red-500 hover:text-white cursor-pointer" onClick={() => setShowNoticesIntro(false)}>Close</button>
                        </div>

                        <div className="mt-4 space-y-3 max-h-80">
                            <img src="/img/notice.jpg" alt="Notices" className="w-full h-full object-cover rounded" />
                            {/* {initialNotices.slice(0,5).map(n => (
                                <div key={n.id} className="p-3 border rounded flex items-start justify-between">
                                    <div>
                                        <div className="font-semibold">{n.title}</div>
                                        <div className="text-sm text-gray-500">{n.category} • {new Date(n.date).toLocaleDateString()}</div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Link to="/notices" className="px-3 py-1 bg-[#035CB0] text-white rounded text-sm">Read</Link>
                                    </div>
                                </div>
                            ))} */}
                        </div>

                        {/* <div className="mt-4 flex justify-end gap-2">
                            <button className="px-3 py-2 border rounded" onClick={() => setShowNoticesIntro(false)}>Read</button>
                            <button className="px-3 py-2 bg-red-600 text-white rounded" onClick={() => { try { sessionStorage.setItem('homeNoticesDismissed','1') } catch(e){} setShowNoticesIntro(false) }}>Skip (Don't show again)</button>
                        </div> */}
                    </div>
                </div>
            )}
            <Banner/>
            <SchoolIntroduction_Notice/>
            <div id="message_from_principal">
                <MessageFromPrincipal/>
            </div>

            {/* <UpcomingEvents/> */}
            {/* <Feature/> */}
            <AcademicProgramsCard/>
            {/* <ActivitiesGallery/> */}
            <FAQ/>
            <Footer/>
            {/* <CTA/> */}
            {/* <div className="text-black">
               { posts.data.map((post,index)=>(
                    <div key={index} className="text-red-500 border-2 border-black">
                        <span>Created At: {new Date(post.created_at).toLocaleDateString()}</span>
                        <p>{post.body}</p>
                    </div>
               ))}
            </div> */}
            {/* <div className="pagination text-black">
                {posts.links.map((link)=>(
                    link.url ? (
                        <Link key={link.label} href={link.url} dangerouslySetInnerHTML={{ __html:link.label }} className={`p-1 mx-1 ${link.active?"text-blue-500 font-bold":""}`}/>
                    ):(
                        <span key={link.label} dangerouslySetInnerHTML={{ __html:link.label }} className='text-gray-400'></span>
                    )
                ))}
            </div> */}

            {/* <Link preserveScroll href="/" className="flex justify-center title mt-[700px]">
                {new Date().toLocaleTimeString()}
            </Link> */}
        </div>
    );
}
// Home.layout = page => <Layout children ={page} />

export default Home;
