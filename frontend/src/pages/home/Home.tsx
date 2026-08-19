import React from 'react';
import { Bell } from 'lucide-react';
import { Link } from 'react-router-dom';

import FeaturedGallery from '../../components/FeaturedGallery';
import { AcademicProgramsCard } from '../../components/AcademicProgramsCard';
import Banner from '../../components/Banner';
import FAQ from '../../components/FAQ';
import Hero from '../../components/Hero';
import MessageFromPrincipal from '../../components/MessageFromPrincipal';
import SchoolIntroduction_Announcements from '../../components/SchoolIntroduction_Announcements';
import AnnouncementsModal from '../../components/AnnouncementsModal';
import ContactUs from '../../components/ContactUs';
import LoadingSpinner from '../../components/LoadingSpinner';

import {
    heroSlideService,
    announcementService,
    schoolProfileService,
    type HeroSlide,
    type SchoolProfile,
} from '../../api';

import type { Announcement } from '../../api/types';

type HomeProps = {
    schoolProfile?: SchoolProfile | null;
};

const Home = ({ schoolProfile: initialSchoolProfile }: HomeProps) => {
    //  HOME PAGE STATE

    const [showAnnouncementsModal, setShowAnnouncementsModal] =
        React.useState(false);

    const [heroSlides, setHeroSlides] = React.useState<HeroSlide[]>([]);
    const [heroLoading, setHeroLoading] = React.useState(true);

    const [announcements, setAnnouncements] = React.useState<Announcement[]>(
        []
    );

    const [schoolProfile, setSchoolProfile] =
        React.useState<SchoolProfile | null>(
            initialSchoolProfile || null
        );

    //  HEADER STATE

    const [clickMenu, setClickMenu] = React.useState(false);
    const [isSticky, setIsSticky] = React.useState(false);
    const [isAdmin, setIsAdmin] = React.useState(false);

    const [openSmallIndex, setOpenSmallIndex] = React.useState<number | null>(
        null
    );

    const navRef = React.useRef<HTMLDivElement | null>(null);
    const menuRef = React.useRef<HTMLDivElement | null>(null);

    //  SCHOOL NAME

    const schoolNameNepaliWords =
        schoolProfile?.schoolNameNepali?.trim().split(/\s+/) || [];

    //  NAVIGATION LINKS

    const navLinks = [
        {
            title: 'Home',
            href: '/',
        },
        {
            title: 'About',
            icon: 'ri-arrow-drop-down-line ml-1',
            href: '#',
            subNav: [
                {
                    title: 'About School',
                    href: '/about/intro',
                },
                {
                    title: 'Teachers',
                    href: '/about/teachers',
                },
                {
                    title: 'Staffs',
                    href: '/about/staffs',
                },
            ],
        },
        {
            title: 'Academic Programs',
            icon: 'ri-arrow-drop-down-line ml-1',
            href: '#',
            subNav: [
                {
                    title: 'Management',
                    href: '/academic-programs/management',
                },
                {
                    title: 'Education',
                    href: '/academic-programs/education',
                },
                {
                    title: 'Agriculture',
                    href: '/academic-programs/agriculture',
                },
                {
                    title: 'आधारभूत शिक्षा',
                    href: '/academic-programs/basic-level',
                },
                {
                    title: 'माध्यमिक शिक्षा',
                    href: '/academic-programs/secondary-level',
                },
            ],
        },
        {
            title: 'Announcements',
            href: '/announcements',
        },
        {
            title: 'Downloads',
            href: '/downloads',
        },
        {
            title: 'Gallery',
            href: '/gallery',
        },
        {
            title: 'Career',
            href: '/career',
        },
    ];

    //  FETCH SCHOOL PROFILE

    React.useEffect(() => {
        const fetchSchoolProfile = async () => {
            try {
                const response = await schoolProfileService.get();

                if (response.data) {
                    setSchoolProfile(response.data);
                }
            } catch (error) {
                console.error('Error fetching school profile:', error);

                // Keep initial profile if one was supplied.
                // Otherwise keep null and allow fallback UI.
                if (!initialSchoolProfile) {
                    setSchoolProfile(null);
                }
            }
        };

        fetchSchoolProfile();
    }, [initialSchoolProfile]);

    //  ADMIN CHECK

    React.useEffect(() => {
        const adminFlag =
            localStorage.getItem('isAdmin') ||
            sessionStorage.getItem('isAdmin');

        setIsAdmin(!!adminFlag);
    }, []);

    //  HERO SLIDES + ANNOUNCEMENTS
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

        const fetchAnnouncements = async () => {
            try {
                const highPriorityAnnouncements =
                    await announcementService.getHighPriority();

                setAnnouncements(highPriorityAnnouncements);
            } catch (error) {
                console.error('Error fetching announcements:', error);
            }
        };

        // Fetch both in parallel.
        fetchHeroSlides();
        fetchAnnouncements();
    }, []);

    //  ANNOUNCEMENT MODAL

    React.useEffect(() => {
        try {
            const dismissed = sessionStorage.getItem(
                'homeAnnouncementsDismissed'
            );

            if (!dismissed) {
                setShowAnnouncementsModal(true);
            }
        } catch (error) {
            setShowAnnouncementsModal(true);
        }
    }, []);

    const handleDismissAnnouncements = () => {
        try {
            sessionStorage.setItem(
                'homeAnnouncementsDismissed',
                '1'
            );
        } catch (error) {
            console.error(
                'Failed to save dismissal preference:',
                error
            );
        }

        setShowAnnouncementsModal(false);
    };

    //  HEADER: OUTSIDE CLICK

    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target as Node)
            ) {
                setClickMenu(false);
            }
        };

        document.addEventListener(
            'mousedown',
            handleClickOutside
        );

        return () => {
            document.removeEventListener(
                'mousedown',
                handleClickOutside
            );
        };
    }, []);

    //  HEADER: STICKY NAVIGATION

    React.useEffect(() => {
        const handleScroll = () => {
            if (!navRef.current) return;

            const navTop = navRef.current.offsetTop;
            const scrollTop = window.scrollY;

            setIsSticky(scrollTop > navTop);
        };

        window.addEventListener('scroll', handleScroll);

        // Check initial position.
        handleScroll();

        return () => {
            window.removeEventListener(
                'scroll',
                handleScroll
            );
        };
    }, []);

    //  MOBILE MENU HANDLERS

    const handleMobileMenuToggle = () => {
        setClickMenu((previous) => !previous);
    };

    const handleMobileLinkClick = () => {
        setClickMenu(false);
        setOpenSmallIndex(null);
    };

    const handleMobileSubmenuToggle = (index: number) => {
        setOpenSmallIndex((previous) =>
            previous === index ? null : index
        );
    };

    return (
        <div className="h-full bg-white w-full relative">

            {/* LOADING SPINNER */}

            {heroLoading && <LoadingSpinner />}

            <header className="header w-full">
                <div
                    className="
                        header-top
                        bg-[#035CB0]
                        text-white
                        flex
                        justify-between
                        items-center
                        w-full
                        gap-5
                        max-sm:text-2xl
                        py-2.5
                        px-3
                        sm:px-11
                        text-[15px]
                    "
                >
                    <ul
                        className="
                            header-top-list
                            flex
                            items-center
                            gap-3
                            sm:gap-5
                            justify-center
                            font-['poppins']
                            max-sm:text-sm
                        "
                    >
                        <li
                            className="
                                border-r-2
                                max-sm:pr-3
                                sm:pr-6
                                hover:text-yellow-400
                            "
                        >
                            <a
                                href={`tel:${schoolProfile?.phone ||
                                    '+977980000000'
                                    }`}
                                className="
                                    transition-all
                                    duration-500
                                    ease-in-out
                                "
                            >
                                <i className="ri-phone-fill mr-2"></i>

                                <span className="max-sm:text-xs text-nowrap">
                                    {schoolProfile?.phone ||
                                        '+977 9800000000'}
                                </span>
                            </a>
                        </li>

                        <li className="hover:text-yellow-400">
                            <a
                                href={`mailto:${schoolProfile?.email ||
                                    'school gmail'
                                    }`}
                            >
                                <i className="ri-mail-send-line mr-2"></i>

                                <span className="max-sm:text-xs info-text">
                                    {schoolProfile?.email ||
                                        'School G-mail'}
                                </span>
                            </a>
                        </li>
                    </ul>

                    {/* Desktop top links */}

                    <div
                        className="
                            header-top
                            flex
                            justify-between
                            gap-10
                            max-sm:hidden
                        "
                    >
                        <ul
                            className="
                                header-top-list
                                flex
                                items-center
                                gap-5
                                justify-content-center
                            "
                        >
                            <li className="border-r-2 pr-6 hover:text-yellow-400">
                                <Link to="/results">
                                    Result
                                </Link>
                            </li>

                            <li className="border-r-2 pr-6 hover:text-yellow-400">
                                <Link to="/admission">
                                    Admission
                                </Link>
                            </li>

                            <li className="hover:text-yellow-400">
                                <Link to="/blogs">
                                    Blogs
                                </Link>
                            </li>
                        </ul>

                        <ul className="header-top-social">
                            <li>
                                <a
                                    href={
                                        schoolProfile?.facebookUrl ||
                                        '#'
                                    }
                                    target="_blank"
                                    rel="noreferrer"
                                    aria-label="Facebook"
                                >
                                    <i className="ri-facebook-fill hover:text-yellow-400"></i>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
                <nav
                    ref={menuRef}
                    className="
                        navbar
                        relative
                        bg-white
                        text-white
                        w-full
                        gap-5
                        max-sm:text-3xl
                    "
                >

                    <div
                        className="
                            large-nav-logo
                            sm:flex
                            items-center
                            justify-between
                            w-full
                            max-sm:flex-col
                            py-4
                            sm:px-11
                        "
                    >
                        <div
                            className="
                                one
                                flex
                                max-sm:flex-col
                                items-center
                                gap-2.5
                                w-2/2
                            "
                        >
                            <Link
                                to="/"
                                className="
                                    flex
                                    max-sm:flex-col
                                    items-center
                                    gap-4
                                    text-center
                                "
                            >
                                <img
                                    className="
                                        h-20
                                        sm:h-24
                                        w-auto
                                        object-contain
                                    "
                                    src={
                                        schoolProfile?.logoUrl ||
                                        ''
                                    }
                                    alt={
                                        schoolProfile?.schoolName ||
                                        'School logo'
                                    }
                                />

                                <div className="schoolname sm:text-start">
                                    <h1
                                        className="
                                            text-[#035CB0]
                                            font-bold
                                            text-4xl
                                            text-nowrap
                                        "
                                    >
                                        {schoolNameNepaliWords
                                            .slice(0, 2)
                                            .join(' ') || 'School'}
                                    </h1>

                                    <h2
                                        className="
                                            text-red-500
                                            font-bold
                                            text-xl
                                            text-nowrap
                                        "
                                    >
                                        {schoolNameNepaliWords
                                            .slice(2)
                                            .join(' ') ||
                                            'Secondary School'}
                                    </h2>
                                </div>
                            </Link>
                        </div>


                        {/* ---------------------------------------------
                            LOCATION + ADMIN CTA
                        ---------------------------------------------- */}

                        <div
                            className="
                                two
                                flex
                                items-center
                                gap-2.5
                                w-2/2
                                justify-between
                            "
                        >
                            <a
                                href={
                                    schoolProfile?.mapUrl ||
                                    '#'
                                }
                                target="_blank"
                                rel="noreferrer"
                                className="
                                    nav-location
                                    hidden
                                    sm:flex
                                    gap-4
                                    items-center
                                    text-base
                                    text-gray-950
                                    md:ml-60
                                "
                            >
                                <i className="ri-road-map-line hover:text-yellow-400 text-nowrap"></i>

                                {schoolProfile?.address ||
                                    'Loading..'}
                            </a>

                            <div
                                className="
                                    nav-cta
                                    hidden
                                    sm:flex
                                    gap-5
                                    items-center
                                    text-sm
                                "
                            >
                                {isAdmin ? (
                                    <>
                                        <Link
                                            to="/admin/dashboard"
                                            className="
                                                py-2.5
                                                px-4
                                                bg-[#035CB0]
                                                rounded-md
                                                text-white
                                                hover:text-yellow-400
                                                text-nowrap
                                                font-['Poppins']
                                            "
                                        >
                                            <i className="ri-dashboard-line mr-1"></i>
                                            DASHBOARD
                                        </Link>

                                        <Link
                                            to="/admin/settings"
                                            className="
                                                py-2.5
                                                px-4
                                                bg-red-600
                                                rounded-md
                                                hover:bg-red-700
                                                text-white
                                                hover:text-yellow-400
                                                cursor-pointer
                                                text-nowrap
                                                font-['Poppins']
                                            "
                                        >
                                            <i className="ri-user-line mr-1"></i>
                                        </Link>
                                    </>
                                ) : (
                                    <Link
                                        to="/admin/login"
                                        className="
                                            py-2.5
                                            px-5
                                            bg-[#035CB0]
                                            rounded-md
                                            hover:bg-[#035CB0]
                                            hover:border
                                            hover:border-[#035CB0]
                                            hover:text-yellow-400
                                            text-nowrap
                                            font-['Poppins']
                                        "
                                    >
                                        <i className="fas fa-user mr-1 text-white"></i>
                                        LOG IN
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>

                    <div
                        ref={navRef}
                        className={`
                            navigations
                            bg-[#035CB0]
                            flex
                            gap-4
                            text-base
                            px-11
                            items-center
                            transition-all
                            duration-500
                            ease-in-out
                            max-sm:hidden
                            ${isSticky
                                ? 'fixed top-0 left-0 right-0 z-50 shadow-lg py-2'
                                : 'relative top-0 left-0 right-0 z-50'
                            }
                        `}
                    >
                        {isSticky && (
                            <img
                                className="
                                    h-12
                                    sm:h-14
                                    w-auto
                                    object-contain
                                    mr-4
                                    transition-all
                                    duration-500
                                    ease-out
                                "
                                src="/img/school_logo.png"
                                alt="Logo"
                            />
                        )}

                        <ul
                            className="
                                flex
                                items-center
                                justify-between
                                text-white
                                gap-8
                            "
                        >
                            {navLinks.map((link, index) => (
                                <li
                                    key={index}
                                    className="
                                        relative
                                        group
                                        flex
                                        items-center
                                    "
                                >
                                    <Link
                                        className="
                                            nav-link-item
                                            flex
                                            items-center
                                            font-sans
                                            leading-none
                                            font-semibold
                                            text-xl
                                            hover:text-yellow-400
                                            py-5
                                            px-1
                                        "
                                        to={link.href}
                                    >
                                        {link.title}

                                        {link.icon && (
                                            <i
                                                className={`${link.icon} text-md`}
                                            ></i>
                                        )}
                                    </Link>

                                    {/* Desktop dropdown */}

                                    {link.subNav &&
                                        link.subNav.length > 0 && (
                                            <ul
                                                className="
                                                    absolute
                                                    left-0
                                                    mt-2
                                                    top-13
                                                    w-48
                                                    bg-white
                                                    text-black
                                                    shadow-lg
                                                    opacity-0
                                                    invisible
                                                    group-hover:opacity-100
                                                    group-hover:visible
                                                    transition-opacity
                                                    duration-200
                                                "
                                            >
                                                {link.subNav.map(
                                                    (
                                                        subLink,
                                                        subIndex
                                                    ) => (
                                                        <li
                                                            key={
                                                                subIndex
                                                            }
                                                        >
                                                            <Link
                                                                to={
                                                                    subLink.href
                                                                }
                                                                className="
                                                                    block
                                                                    px-4
                                                                    py-2
                                                                    hover:bg-gray-100
                                                                    hover:text-[#035CB0]
                                                                "
                                                            >
                                                                {
                                                                    subLink.title
                                                                }
                                                            </Link>
                                                        </li>
                                                    )
                                                )}
                                            </ul>
                                        )}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div
                        className="
                            nav-menu
                            text-4xl
                            bg-[#035CB0]
                            p-2
                            h-auto
                            w-full
                            sm:hidden
                            relative
                            text-white
                            mt-2
                            flex
                            justify-between
                        "
                    >
                        <button
                            type="button"
                            aria-label={
                                clickMenu
                                    ? 'Close menu'
                                    : 'Open menu'
                            }
                            onClick={handleMobileMenuToggle}
                            className="
                                transition-transform
                                ease-in-out
                                cursor-pointer
                            "
                        >
                            <i
                                className={
                                    clickMenu
                                        ? 'ri-close-line'
                                        : 'ri-menu-fill'
                                }
                            ></i>
                        </button>

                        <Link
                            to="/downloads"
                            className="
                                flex
                                items-center
                                gap-2.5
                            "
                            aria-label="Downloads"
                        >
                            <Bell className="w-6 h-6" />
                        </Link>
                    </div>

                    {clickMenu && (
                        <div
                            className="
                                small-nav-link
                                bg-[#035CB0]
                                flex
                                flex-col
                                gap-4
                                absolute
                                left-0
                                right-0
                                top-65
                                z-50
                                text-base
                                sm:hidden
                                px-6
                                py-3
                            "
                        >
                            <ul>
                                {navLinks.map(
                                    (link, index) => (
                                        <li
                                            key={index}
                                            className="
                                                mb-3
                                                font-sans
                                            "
                                        >
                                            {link.subNav &&
                                                link.subNav.length >
                                                0 ? (
                                                <div
                                                    className="
                                                        nav-link-item
                                                        hover:text-yellow-400
                                                        flex
                                                        items-center
                                                        justify-between
                                                        cursor-pointer
                                                    "
                                                    onClick={() =>
                                                        handleMobileSubmenuToggle(
                                                            index
                                                        )
                                                    }
                                                >
                                                    <span className="block font-normal w-full">
                                                        {
                                                            link.title
                                                        }
                                                    </span>

                                                    <i
                                                        className={`
                                                            ${link.icon}
                                                            ml-2
                                                            transition-transform
                                                            ${openSmallIndex ===
                                                                index
                                                                ? 'rotate-180'
                                                                : ''
                                                            }
                                                        `}
                                                    ></i>
                                                </div>
                                            ) : (
                                                <Link
                                                    to={
                                                        link.href
                                                    }
                                                    className="
                                                        nav-link-item
                                                        hover:text-yellow-400
                                                        flex
                                                        items-center
                                                        justify-between
                                                        cursor-pointer
                                                        font-normal
                                                    "
                                                    onClick={
                                                        handleMobileLinkClick
                                                    }
                                                >
                                                    {link.title}

                                                    {link.icon && (
                                                        <i
                                                            className={`${link.icon} ml-2`}
                                                        ></i>
                                                    )}
                                                </Link>
                                            )}

                                            {/* Mobile submenu */}

                                            {openSmallIndex ===
                                                index &&
                                                link.subNav &&
                                                link.subNav
                                                    .length >
                                                0 && (
                                                    <ul
                                                        className="
                                                            transition-opacity
                                                            duration-200
                                                            mt-2
                                                            bg-white
                                                            rounded-md
                                                        "
                                                    >
                                                        {link.subNav.map(
                                                            (
                                                                subLink,
                                                                subIndex
                                                            ) => (
                                                                <li
                                                                    key={
                                                                        subIndex
                                                                    }
                                                                >
                                                                    <Link
                                                                        to={
                                                                            subLink.href
                                                                        }
                                                                        onClick={
                                                                            handleMobileLinkClick
                                                                        }
                                                                        className="
                                                                            block
                                                                            px-4
                                                                            py-2
                                                                            hover:bg-gray-100
                                                                            hover:text-[#035CB0]
                                                                            text-gray-800
                                                                        "
                                                                    >
                                                                        {
                                                                            subLink.title
                                                                        }
                                                                    </Link>
                                                                </li>
                                                            )
                                                        )}
                                                    </ul>
                                                )}
                                        </li>
                                    )
                                )}

                                {/* Blogs */}

                                <li>
                                    <Link
                                        to="/blogs"
                                        onClick={
                                            handleMobileLinkClick
                                        }
                                        className="
                                            block
                                            font-normal
                                            text-sm
                                            hover:text-yellow-400
                                        "
                                    >
                                        Blogs
                                    </Link>
                                </li>
                            </ul>


                            {/* Mobile admin CTA */}

                            <div
                                className="
                                    nav-cta
                                    w-full
                                    sm:hidden
                                    flex
                                    items-center
                                    justify-center
                                    gap-8
                                    h-12
                                "
                            >
                                {isAdmin ? (
                                    <>
                                        <Link
                                            to="/admin/dashboard"
                                            className="
                                                py-2.5
                                                rounded-md
                                                px-5
                                                bg-green-600
                                                text-yellow-400
                                                font-semibold
                                                hover:bg-green-700
                                                hover:border
                                                hover:border-white
                                            "
                                            onClick={
                                                handleMobileLinkClick
                                            }
                                        >
                                            <i className="ri-dashboard-line mr-1"></i>
                                            DASHBOARD
                                        </Link>

                                        <Link
                                            to="/admin/settings"
                                            className="
                                                py-2.5
                                                rounded-md
                                                px-5
                                                bg-red-600
                                                text-yellow-400
                                                font-semibold
                                                hover:bg-red-700
                                                hover:border
                                                hover:border-white
                                            "
                                            onClick={
                                                handleMobileLinkClick
                                            }
                                        >
                                            <i className="ri-user-line mr-1"></i>
                                        </Link>
                                    </>
                                ) : (
                                    <Link
                                        to="/admin/login"
                                        className="
                                            py-2.5
                                            rounded-md
                                            px-5
                                            bg-gray-100
                                            text-red-600
                                            font-semibold
                                            hover:border
                                            hover:border-white
                                            hover:bg-[#035CB0]
                                        "
                                        onClick={
                                            handleMobileLinkClick
                                        }
                                    >
                                        <i className="ri-login-full mr-1"></i>
                                        LOG IN
                                    </Link>
                                )}
                            </div>
                        </div>
                    )}
                </nav>
            </header>
            <AnnouncementsModal
                isOpen={showAnnouncementsModal}
                onClose={() =>
                    setShowAnnouncementsModal(false)
                }
                onDismiss={handleDismissAnnouncements}
                prefetchedAnnouncements={announcements}
            />
            <main>
                <Hero
                    slides={heroSlides}
                    loading={heroLoading}
                />

                <Banner />

                <SchoolIntroduction_Announcements />

                <div id="message_from_principal">
                    <MessageFromPrincipal />
                </div>

                <AcademicProgramsCard />

                <FeaturedGallery />

                <FAQ />

                <ContactUs />
            </main>

            <footer
                className="
                    bg-[#ffff]
                    w-full
                    border-t
                    border-gray-200
                "
            >
                <div
                    className="
                        footer-nav
                        flex
                        max-sm:flex-col
                        justify-between
                        gap-2
                        max-gap-10
                        px-6
                        py-5
                        sm:px-8
                        lg:px-11
                    "
                >
                    <div className="footer-info text-teal-600">
                        <ul
                            className="
                                list-none
                                flex
                                flex-col
                                items-start
                                gap-4
                                text-gray-900
                                text-start
                            "
                        >
                            <li className="list-none">
                                <Link
                                    to="/"
                                    className="
                                        flex
                                        gap-2
                                        items-center
                                        border-b
                                        border-gray-300
                                    "
                                >
                                    <img
                                        className="
                                            max-sm:h-24
                                            sm:h-32
                                            cursor-pointer
                                            mb-2
                                        "
                                        src={
                                            schoolProfile?.logoUrl ||
                                            ''
                                        }
                                        alt={
                                            schoolProfile?.schoolName ||
                                            'School Logo'
                                        }
                                    />
                                </Link>
                            </li>

                            <li>
                                <a
                                    href={`tel:${schoolProfile?.phone || ''}`}
                                    className="
                                        flex
                                        gap-2
                                        items-center
                                        transition-all
                                        duration-500
                                        ease-in-out
                                    "
                                >
                                    <i className="ri-phone-fill mr-2"></i>

                                    <span className="max-sm:text-sm text-nowrap">
                                        {schoolProfile?.phone ||
                                            'School Phone'}
                                    </span>
                                </a>
                            </li>

                            <li>
                                <a
                                    href={`mailto:${schoolProfile?.email ||
                                        ''
                                        }`}
                                    className="
                                        flex
                                        gap-2
                                        items-center
                                    "
                                >
                                    <i className="ri-mail-send-line mr-2"></i>

                                    <span className="max-sm:text-sm info-text">
                                        {schoolProfile?.email ||
                                            'School G-mail'}
                                    </span>
                                </a>
                            </li>

                            <li>
                                <a
                                    href={
                                        schoolProfile?.mapUrl ||
                                        '#'
                                    }
                                    target="_blank"
                                    rel="noreferrer"
                                    className="
                                        flex
                                        gap-2
                                        items-center
                                        max-sm:text-sm
                                    "
                                >
                                    <i className="ri-road-map-line hover:text-yellow-400 text-nowrap"></i>

                                    {schoolProfile?.address ||
                                        'loading..'}
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div className="footer-about max-sm:mt-5">
                        <h2 className="text-lg font-semibold mb-4">
                            About
                        </h2>

                        <ul>
                            <li className="flex flex-col gap-4">
                                <Link
                                    className="
                                        text-gray-900
                                        transition
                                        hover:text-[#035CB0]
                                    "
                                    to="/about/intro"
                                >
                                    About School
                                </Link>

                                <Link
                                    className="
                                        text-gray-900
                                        transition
                                        hover:text-[#035CB0]
                                    "
                                    to="/about/teachers"
                                >
                                    About Teachers
                                </Link>

                                <a
                                    className="
                                        text-gray-900
                                        transition
                                        hover:text-[#035CB0]
                                    "
                                    href="#message_from_principal"
                                >
                                    Study Materials
                                </a>

                                <Link
                                    className="
                                        text-gray-900
                                        transition
                                        hover:text-[#035CB0]
                                    "
                                    to="/gallery"
                                >
                                    School's Gallery
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div className="footer-academic-programs max-sm:mt-5">
                        <h2 className="text-lg font-semibold mb-4">
                            Academic Programs
                        </h2>

                        <ul>
                            <li className="flex flex-col gap-4">
                                <Link
                                    className="
                                        text-gray-900
                                        transition
                                        hover:text-[#035CB0]
                                    "
                                    to="/academic-programs/agriculture"
                                >
                                    Agriculture
                                </Link>

                                <Link
                                    className="
                                        text-gray-900
                                        transition
                                        hover:text-[#035CB0]
                                    "
                                    to="/academic-programs/management"
                                >
                                    Management
                                </Link>

                                <Link
                                    className="
                                        text-gray-900
                                        transition
                                        hover:text-[#035CB0]
                                    "
                                    to="/academic-programs/education"
                                >
                                    Education
                                </Link>

                                <Link
                                    className="
                                        text-gray-900
                                        transition
                                        hover:text-[#035CB0]
                                    "
                                    to="/academic-programs/basic-level"
                                >
                                    आधारभूत शिक्षा
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div className="footer-fb-page max-sm:mt-5">
                        <h2 className="text-lg font-semibold mb-4">
                            Official Facebook Page
                        </h2>

                        <iframe
                            src={
                                schoolProfile?.facebookUrl ||
                                ''
                            }
                            width="300"
                            height="300"
                            scrolling="no"
                            frameBorder="0"
                            className="
                                border-0
                                overflow-hidden
                            "
                            allowFullScreen
                            allow="
                                autoplay;
                                clipboard-write;
                                encrypted-media;
                                picture-in-picture;
                                web-share
                            "
                            title="Official Facebook Page"
                        />
                    </div>
                </div>

                <div
                    className="
                        copyright
                        bg-[#035CB0]
                        py-5
                        text-white
                        px-4
                    "
                >
                    <p
                        className="
                            w-full
                            text-center
                            text-sm
                            sm:text-md
                        "
                    >
                        &copy; 2025 |{' '}
                        {schoolProfile?.schoolName ||
                            'School Name'}{' '}
                        | All Rights Reserved
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default Home;