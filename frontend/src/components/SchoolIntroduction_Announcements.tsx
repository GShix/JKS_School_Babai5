
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { schoolProfileService, announcementService } from '../api';
import type { SchoolProfile, Announcement } from '../api';

const SchoolIntroduction_Announcements = () => {
    const [schoolProfile, setSchoolProfile] = useState<SchoolProfile | null>(null);
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            
            // Fetch school profile
            const profileResponse = await schoolProfileService.get();
            if (profileResponse.data) {
                setSchoolProfile(profileResponse.data);
            }
            
            // Fetch recent announcements (limit to 3)
            const announcementsResponse = await announcementService.getAll();
            if (announcementsResponse.data) {
                setAnnouncements(announcementsResponse.data.slice(0, 3));
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            // Use fallback data if API fails
            setSchoolProfile({
                id: 1,
                schoolName: 'JKSS School',
                schoolNameNepali: 'श्री जनकल्याण माध्यमिक विद्यालय',
                phone: '+977 9844929502',
                email: 'jksschoolp5@gmail.com',
                address: 'Padampur, Dang',
                introduction: 'Welcome to our school! We are dedicated to providing a high-quality education to our students. Our experienced faculty and innovative curriculum ensure that every child reaches their full potential. We offer a wide range of extracurricular activities to foster creativity and personal growth. Our state-of-the-art facilities and supportive community create a nurturing environment for learning. Join us in shaping the future of our students and empowering them to become leaders in their communities.'
            });
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    };

    if (loading) {
        return (
            <div className="w-full bg-white px-4 sm:px-11 mt-4 py-8">
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            </div>
        );
    }

    return (
        <div className='w-full bg-white sm:flex max-sm:flex-col gap-14 px-4 sm:px-11 mt-4'>
            <div className="intro sm:w-2/3">
                <h1 className='text-3xl mb-2 font-bold'>School Introduction</h1>
                <p className='text-gray-700 text-lg leading-7 text-justify'>
                    {schoolProfile?.introduction || 'Welcome to our school!'}
                </p>
                <Link to="/about/jkss">
                    <button className='py-2.5 px-5 bg-[#035CB0] text-white rounded-md mt-4 hover:text-yellow-400 cursor-pointer text-nowrap'>
                        Read More
                    </button>
                </Link>
            </div>
            <div className="announcements sm:w-1/2 shadow-gray-600 shadow-lg sm:h-80 rounded-md max-sm:mt-4">
                <h1 className='text-xl font-bold p-4 bg-[#035CB0] text-white rounded-t-md'>Recent Announcements</h1>
                {announcements.length > 0 ? (
                    <ul className='list-none p-5 flex flex-col gap-3'>
                        {announcements.map((announcement) => (
                            <li key={announcement.id} className='cursor-pointer hover:text-yellow-600 font-medium'>
                                <h1 className="border-l-4 border-[#035CB0] pl-2 py-1">{announcement.title}</h1>
                                <span className='text-gray-500 ml-3 font-normal text-sm'>
                                    {formatDate(announcement.startDate || announcement.createdAt || new Date().toISOString())}
                                </span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="p-5 text-center text-gray-500">
                        <p>No announcements available at the moment.</p>
                    </div>
                )}
                <div className="px-5 pb-4">
                    <Link 
                        to="/announcements" 
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                        View all announcements →
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default SchoolIntroduction_Announcements;
