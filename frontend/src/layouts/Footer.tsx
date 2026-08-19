import { useEffect, useState } from "react";
import { Link } from "react-router-dom"
import { schoolProfileService, type SchoolProfile } from "../api";


const Footer = () => {
    const [schoolProfile, setSchoolProfile] = useState<SchoolProfile | null>(null);

    useEffect(() => {
        // Fetch school profile
        const fetchSchoolProfile = async () => {
            try {
                const response = await schoolProfileService.get();
                if (response.data) {
                    setSchoolProfile(response.data);
                }
            } catch (error) {
                console.error('Error fetching school profile:', error);
                // Use fallback data
                setSchoolProfile({});
            }
        };

        fetchSchoolProfile();

    }, []);

    return (
        <footer className="bg-[#ffff] w-full border-t border-gray-200">
            <div className="footer-nav flex max-sm:flex-col justify-between gap-2 max-gap-10 px-6 py-5 sm:px-8 lg:px-11">
                <div className="footer-info text-teal-600">
                    <li className="list-none flex flex-col items-start gap-4 text-gray-900 text-start">
                        <Link to="/" className="flex gap-2 items-center border-b border-gray-300">
                            <img className="max-sm:h-24 sm:h-32 cursor-pointer mb-2" src={`${schoolProfile?.logoUrl || 'School Logo'}`} alt={`${schoolProfile?.schoolName || 'School Logo'}`} />
                        </Link>
                        <Link to={`tel:${schoolProfile?.phone}`} className="flex gap-2 items-center transition-all duration-500 ease-in-out">
                            <i className="ri-phone-fill mr-2"></i>
                            <span className="max-sm:text-sm text-nowrap">{schoolProfile?.phone || 'School Phone'}</span>
                        </Link>
                        <Link to={`mailto:${schoolProfile?.email || 'School Gmail'}`} className="flex gap-2 items-center ">
                            <i className="ri-mail-send-line mr-2"></i>
                            <span className="max-sm:text-sm info-text ">{schoolProfile?.email || 'School G-mail'}</span>
                        </Link>
                        <Link to={`${schoolProfile?.mapUrl}`}
                            target="blank"
                            className="flex gap-2 items-center max-sm:text-sm">
                            <i className="ri-road-map-line hover:text-yellow-400 text-nowrap"></i>
                            {schoolProfile?.address || 'loading..'}
                        </Link>
                        {/* <Link to="https://www.facebook.com/janakalyana.ma.bi.padamapura.dana" rel="noreferrer" target="_blank" className="text-gray-900 transition hover:text-gray-900/75">
                        <i className="ri-facebook-circle-fill text-blue-600 text-2xl leading-none"></i>
                    </Link> */}
                    </li>
                </div>
                <div className="footer-about max-sm:mt-5">
                    <h1 className="text-lg font-semibold mb-4">About</h1>
                    <ul>
                        <li className="flex flex-col gap-4">
                            <a className="text-gray-900 transition hover:text-[#035CB0]" href="/about/intro">About School</a>
                            <a className="text-gray-900 transition hover:text-[#035CB0]" href="/about/teachers">About Teachers</a>
                            <a className="text-gray-900 transition hover:text-[#035CB0]" href="#message_from_principal">Study Materials</a>
                            <a className="text-gray-900 transition hover:text-[#035CB0]" href="#">School's Gallery</a>
                        </li>
                    </ul>
                </div>
                <div className="footer-academic-programs max-sm:mt-5">
                    <h1 className="text-lg font-semibold mb-4">Academic Programs</h1>
                    <ul className="">
                        <li className="flex flex-col gap-4">
                            <a className="text-gray-900 transition hover:text-[#035CB0]" href="/academic-programs/agriculture">Agriculture</a>
                            <a className="text-gray-900 transition hover:text-[#035CB0]" href="/academic-programs/management">Management</a>
                            <a className="text-gray-900 transition hover:text-[#035CB0]" href="/academic-programs/education">Education</a>
                            <a className="text-gray-900 transition hover:text-[#035CB0]" href="/academic-programs/आधारभूत शिक्षा">आधारभूत शिक्षा</a>
                        </li>
                    </ul>
                </div>
                <div className="footer-fb-page max-sm:mt-5">
                    <h1 className="text-lg font-semibold mb-4">Official Facebeook Page</h1>
                    <iframe src={`${schoolProfile?.facebookUrl}`} width="300" height="300" scrolling="no" frameBorder="0"
                        className="border-0 overflow-hidden"
                        allowFullScreen={true} allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"></iframe>
                    {/* <ul className="">
                    <li className="flex flex-col gap-4">
                        <a className="text-gray-900 transition hover:text-[#035CB0]" href="#">Announcements</a>
                        <a className="text-gray-900 transition hover:text-[#035CB0]" href="#">Contact Us</a>
                        <a className="text-gray-900 transition hover:text-[#035CB0]" href="#">FAQ's</a>
                        <a className="text-gray-900 transition hover:text-[#035CB0]" href="#">Admission</a>
                        <a className="text-gray-900 transition hover:text-[#035CB0]" href="#">Results</a>
                    </li>
                </ul> */}
                </div>
            </div>

            <div className="copyright bg-[#035CB0] py-5 text-white px-4">
                <p className="w-full text-center text-sm sm:text-md">&copy; 2025 | {`${schoolProfile?.schoolName || 'School Name'}`} | All Rights Reserved</p>
            </div>
        </footer>
    )
}

export default Footer