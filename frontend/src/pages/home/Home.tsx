import React from 'react'
import FeaturedGallery from '../../components/FeaturedGallery';
import { AcademicProgramsCard } from '../../components/AcademicProgramsCard';
import Banner from '../../components/Banner';
import FAQ from '../../components/FAQ';
import Hero from '../../components/Hero'
import MessageFromPrincipal from '../../components/MessageFromPrincipal';
import SchoolIntroduction_Announcements from '../../components/SchoolIntroduction_Announcements';
import AnnouncementsModal from '../../components/AnnouncementsModal';
import ContactUs from '../../components/ContactUs';
import Footer from '../../layouts/Footer';
import Header from '../../layouts/Header';
import LoadingSpinner from '../../components/LoadingSpinner';
import { heroSlideService, type HeroSlide } from '../../api/services';

const Home = () => {
    const [showAnnouncementsModal, setShowAnnouncementsModal] = React.useState(false)
    const [heroSlides, setHeroSlides] = React.useState<HeroSlide[]>([]);
    const [heroLoading, setHeroLoading] = React.useState(true);

    // Fetch hero slides immediately when component mounts for faster loading
    React.useEffect(() => {
        const fetchHeroSlides = async () => {
            try {
                setHeroLoading(true);
                const response = await heroSlideService.getActive();
                if (response.data && response.data.length > 0) {
                    setHeroSlides(response.data);
                }
            } catch (error) {
                console.error('Error fetching hero slides:', error);
            } finally {
                setHeroLoading(false);
            }
        };

        fetchHeroSlides();
    }, []);

    React.useEffect(() => {
        try {
            const dismissed = sessionStorage.getItem('homeAnnouncementsDismissed')
            if (!dismissed) setShowAnnouncementsModal(true)
        } catch (err) {
            setShowAnnouncementsModal(true)
        }
    }, [])

    const handleDismissAnnouncements = () => {
        try {
            sessionStorage.setItem('homeAnnouncementsDismissed', '1')
        } catch (e) {
            console.error('Failed to save dismissal preference:', e)
        }
        setShowAnnouncementsModal(false)
    }

    // const scroll = new LocomotiveScroll();
    // console.log(posts)
    return (
        <div className='h-full bg-white w-full relative'>
            {/* Loading Spinner */}
            {heroLoading && <LoadingSpinner />}
            
            {/* <h1 className="text-red-500">This is Home Page</h1> */}
            <Header/>

            <Hero slides={heroSlides} loading={heroLoading} />
            
            {/* Announcements Modal - Shows high/urgent priority announcements on first visit */}
            <AnnouncementsModal
                isOpen={showAnnouncementsModal}
                onClose={() => setShowAnnouncementsModal(false)}
                onDismiss={handleDismissAnnouncements}
            />
            
            <Banner/>
            <SchoolIntroduction_Announcements/>
            <div id="message_from_principal">
                <MessageFromPrincipal/>
            </div>

            {/* <UpcomingEvents/> */}
            {/* <Feature/> */}
            <AcademicProgramsCard/>
            <FeaturedGallery/>
            <FAQ/>
            <ContactUs/>
            <Footer/>

        </div>
    );
}
// Home.layout = page => <Layout children ={page} />

export default Home;
