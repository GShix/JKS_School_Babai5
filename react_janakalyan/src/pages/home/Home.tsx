import ActivitiesGallery from '../../components/Activities_gallery';
import Banner from '../../components/Banner';
import FAQ from '../../components/FAQ';
import Feature from '../../components/Feature';
import Hero from '../../components/Hero'
import MessageFromPrincipal from '../../components/MessageFromPrincipal';
import OurTeam from '../../components/OurTeam';
import SchoolIntroduction_Notice from '../../components/SchoolIntroduction_Notice';
import UpcomingEvents from '../../components/UpcomingEvents';
import Footer from '../../layouts/Footer';
import Header from '../../layouts/Header';

const Home = ({posts}:any) =>{
    // console.log(posts)

// const scroll = new LocomotiveScroll();
// console.log(posts)
    return (
        <div className='h-full bg-white w-full'>
            {/* <h1 className="text-red-500">This is Home Page</h1> */}
            <Header/>

            <Hero/>
            <Banner/>
            <SchoolIntroduction_Notice/>
            <MessageFromPrincipal/>
            <UpcomingEvents/>
            <Feature/>
            <ActivitiesGallery/>
            <FAQ/>
            <OurTeam/>
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
