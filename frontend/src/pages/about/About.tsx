import { useState, useEffect } from "react"
import Footer from "../../layouts/Footer"
import Header from "../../layouts/Header"
import { contentService } from "../../api"
import type { SchoolProfile } from "../../api/services/contentService"
import { getErrorMessage } from "../../utils/errorHandler"

const About = () => {
  const [profile, setProfile] = useState<SchoolProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await contentService.getSchoolProfile();
      if (response.data) {
        setProfile(response.data);
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const defaultHeroImage = '/img/running-shield-blur.jpg';
  const defaultMapUrl = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3516.6370459737786!2d82.1354621!3d28.187951699999996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39981ddb63b5812f%3A0x459611dac3a9d5cc!2sJanakalyan%20H.S.S.%20Padampur!5e0!3m2!1sen!2snp!4v1757949161711!5m2!1sen!2snp';

  return (
    <div className="about-page">
      <Header/>
      <main className="min-h-screen">
        <div 
          className="about-top w-full h-[200px] bg-[#035CB0] flex items-center justify-start px-12" 
          style={{
            backgroundImage: `url(${profile?.heroImage || defaultHeroImage})`, 
            backgroundSize: 'cover', 
            color: 'yellow', 
            backgroundPosition: 'center', 
            opacity: 0.9
          }}
        >
          <div className="text-white">
            {profile?.schoolNameNepali && (
              <h1 className="text-5xl font-bold mb-2">{profile.schoolNameNepali}</h1>
            )}
            {profile?.schoolTypeNepali && (
              <h2 className="text-3xl font-medium">{profile.schoolTypeNepali}</h2>
            )}
            {!profile?.schoolNameNepali && <h1 className="text-5xl font-medium">About Us</h1>}
          </div>
        </div>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 mx-6 sm:mx-8 lg:mx-12 mt-4 rounded-md">
            {error}
          </div>
        )}
        
        <div className="short-about w-full mx-auto px-6 py-10 sm:px-8 lg:px-12 flex max-sm:flex-col gap-8">
          <div className="md:w-1/2">
            <h2 className="text-3xl font-semibold mb-4">Our Story</h2>
            <p className="text-lg text-gray-700 mb-6">
              {loading ? 'Loading...' : (profile?.aboutUsStory || "Our organization was founded with the mission to make a positive impact in our community. Over the years, we have grown and evolved, but our core values remain the same.")}
            </p>
          </div>
          <div className="md:w-1/2">
            <img src="/img/running-shield.jpg" alt="Running Shield" className="w-full h-auto object-cover" />
          </div>
        </div>
        <div className="detailed-about w-full bg-gray-100 px-6 py-10 sm:px-8 lg:px-12">
          <h2 className="text-3xl font-semibold mb-6">What We Do</h2>
          <p className="text-lg text-gray-700 mb-4">  
            {loading ? 'Loading...' : (profile?.aboutUsDescription || "We are committed to providing high-quality services that meet the needs of our clients. Our team works tirelessly to ensure customer satisfaction and deliver exceptional results.")}
          </p>
        </div>
        <div className="about-map flex max-sm:flex-col gap-8 px-6 py-10 sm:px-8 lg:px-12 sm:h-[400px]">
          <div className="md:w-1/2">
            <h2 className="text-3xl font-semibold mb-4">Location on Google Map</h2>
            <p className="text-lg text-gray-700 mb-6">
              {profile?.address || "Babai Rural Municipality-5, Padampur, Dang"}
            </p>
          </div>
          <div className="md:w-1/2">
            <iframe 
              src={profile?.mapUrl || defaultMapUrl}
              width="600" 
              height="320" 
              allowFullScreen={true} 
              loading="lazy" 
              className="border-0 w-full rounded-md"
              referrerPolicy="no-referrer-when-downgrade">
            </iframe>
          </div>
        </div>
      </main>
      <Footer/>
    </div>
  )
}

export default About