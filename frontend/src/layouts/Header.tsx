import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

const Header = () => {
    const [clickMenu, setClickMenu] = useState(false);
    const [isSticky, setIsSticky] = useState(false);
    const navRef = useRef<HTMLDivElement | null>(null);
    const navLinks = [
        {
            title:"Home",
            href:"/"
        },
        {
            title:"About",
            icon:"ri-arrow-drop-down-line ml-1",
            href:"#",
            subNav: [
                { title: "About JKSS", href: "/about/jkss" },
                { title: "JKSS Team", href: "/about/jkss-team" },
            ]
        },
        {
            title:"Academic Programs",
            icon:"ri-arrow-drop-down-line ml-1",
            href:"#",
            subNav: [
                { title: "Management", href: "/academic-programs/management" },
                { title: "Education", href: "/academic-programs/education" },
                { title: "Agriculture", href: "/academic-programs/agriculture" },
                { title: "आधारभूत शिक्षा", href: "/academic-programs/आधारभूत शिक्षा" },
                { title: "माध्यमिक शिक्षा", href: "/academic-programs/माध्यमिक शिक्षा" },

            ]
        },
        {
            title:"Notice",
            // icon:"ri-arrow-drop-down-line ml-1",
            href:"/notices"
        },
        {
            title:"Download",
            // icon:"ri-arrow-drop-down-line ml-1",
            href:"/downloads"
        },
        {
            title:"Gallery",
            // icon:"ri-arrow-drop-down-line ml-1",
            href:"/gallery"
        },
        {
            title:"Career",
            // icon:"ri-arrow-drop-down-line ml-1",
            href:"/career"
        },

    ]
    // which small-nav (mobile) submenu is open; null = none
    const [openSmallIndex, setOpenSmallIndex] = useState<number | null>(null);
    // console.log(navLinks)
    const menuRef = useRef<HTMLDivElement | null>(null); // Reference to the nav menu

    useEffect(() => {
        // Function to check and handle clicks outside of the menu
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setClickMenu(false);
            }
        };

        // Sticky navigation handler
        const handleScroll = () => {
            if (navRef.current) {
                const navTop = navRef.current.offsetTop;
                const scrollTop = window.scrollY;
                setIsSticky(scrollTop > navTop);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        window.addEventListener('scroll', handleScroll);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

  return (
    <div className="header w-full">
        <div className="header-top bg-[#035CB0] text-white flex justify-between items-center w-full gap-5 max-sm:text-2xl py-2.5 px-3 sm:px-11 text-[15px]">
            <ul className="header-top-list flex items-center gap-3 sm:gap-5 justify-center font-['poppins'] max-sm:text-sm">
                <li className="border-r-2 max-sm:pr-3 sm:pr-6 hover:text-yellow-400">
                    <a href="tel" className=" transition-all duration-500 ease-in-out">
                        <i className="ri-phone-fill mr-2"></i>
                        <span className="max-sm:text-xs text-nowrap">+977 9844929502</span>
                    </a>
                </li>
                <li className=" hover:text-yellow-400">
                    <a href="mailto">
                        <i className="ri-mail-send-line mr-2"></i>
                        <span className="max-sm:text-xs info-text ">jksschoolp5@gmail.com</span>
                    </a>
                </li>
            </ul>

            <div className="header-top flex justify-between gap-10 max-sm:hidden">
                <ul className="header-top-list flex items-center gap-5 justify-content-center">
                    <li className="border-r-2 pr-6 hover:text-yellow-400hover:text-yellow-400">
                        <Link to="/results" className="">Result</Link>
                    </li>
                    <li className="border-r-2 pr-6 hover:text-yellow-400">
                        <Link to="#">Admission</Link>
                    </li>
                    <li className=" hover:text-yellow-400">
                        <Link to="/blogs">Blogs</Link>
                    </li>
                </ul>
                <ul className="header-top-social">
                    <li><Link to="https://www.facebook.com/janakalyana.ma.bi.padamapura.dana" target="_blank"><i className="ri-facebook-fill hover:text-yellow-400"></i></Link></li>
                </ul>
            </div>
        </div>

        <nav className="navbar relative bg-white text-white w-full gap-5 max-sm:text-3xl">

            {/* Large Nav Link */}
            <div className="large-nav-logo sm:flex items-center justify-between w-full max-sm:flex-col py-4 sm:px-11">
                <Link to="/" className="one flex max-sm:flex-col items-center gap-2.5 w-2/2">
                    <img className="h-24" src="/img/jkss_logo.png" alt="" srcSet="" />
                    <div className="schoolname max-sm:text-center">
                        <h1 className="text-[#035CB0] font-bold text-4xl text-nowrap">श्री जनकल्याण</h1>
                        <h2 className="text-red-500 font-bold text-xl">माध्यमिक विद्यालय</h2>
                    </div>
                </Link>
                <div className="two flex  items-center gap-2.5 w-2/2 justify-between">
                    <div className="nav-location hidden sm:flex gap-4 items-center text-base text-gray-950 md:ml-60">
                        <i className="ri-road-map-line hover:text-yellow-400 text-nowrap"></i>बबई-५, पदमपुर, दाङ
                    </div>
                    <div className="nav-cta hidden sm:flex gap-5 items-center text-sm">
                        <Link to="/admin/login" className="py-2.5 px-5 bg-[#035CB0] rounded-md hover:bg-[#035CB0] hover:border hover:border-[#035CB0] hover:text-yellow-400 text-nowrap font-['Poppins']"><i className="fas fa-user mr-1 text-yellow-400"></i> LOG IN</Link>
                    </div>
                </div>

            </div>
            <div
                ref={navRef}
                className={`navigations bg-[#035CB0] flex gap-4 text-base bg-trnsparent max-sm:hidden px-11 items-center transition-all duration-500 ease-in-out ${isSticky ? 'fixed top-0 left-0 right-0 z-50 shadow-lg py-2' : 'relative top-0 left-0 right-0 z-50'}`}
            >
                {isSticky && (
                    <img className="h-16 mr-4 transition-all duration-500 ease-out" src="/img/jkss_logo.png" alt="Logo" />
                )}
                <ul className="flex items-center justify-between text-white gap-8">
                    {navLinks.map((link, index) => (
                        <li
                        key={index}
                        className="relative group flex items-center">
                            <Link
                                className="nav-link-item flex items-center font-sans leading-none font-semibold text-xl hover:text-yellow-400 py-5 px-1"
                                to={link.href}>
                                {link.title} {<i className={`${link.icon} text-md`}></i>}
                            </Link>

                            {/* dropdown */}
                            {link.subNav && link.subNav.length > 0 && (
                                <ul
                                className="
                                    absolute left-0 mt-2 top-13 w-48 bg-white text-black rounded- shadow-lg 
                                    opacity-0 invisible group-hover:opacity-100 group-hover:visible 
                                    transition-opacity duration-200">
                                {link.subNav.map((subLink, subIndex) => (
                                    <li key={subIndex}>
                                    <Link
                                        to={subLink.href}
                                        className="block px-4 py-2 hover:bg-gray-100 hover:text-[#035CB0]"
                                    >
                                        {subLink.title}
                                    </Link>
                                    </li>
                                ))}
                                </ul>
                            )}
                        </li>
                    ))}
                </ul>

            </div>
            
            {/* Small Nav */}
            <div className="nav-menu text-4xl bg-[#035CB0] p-2 h-auto w-full sm:hidden relative text-white mt-4 flex justify-between" >
                <i className={`${ clickMenu?"ri-close-line":"ri-menu-fill"} transition-transform ease-in-out cursor-pointer`}onClick={() => setClickMenu(!clickMenu)}></i>
                <Link to="/results" className="flex items-center gap-2.5 text-lg">Result</Link>
            </div>
            {clickMenu ? (
            <div className="small-nav-link bg-[#035CB0] flex flex-col gap-4 absolute left-0 right-0 top-69 z-50 text-base sm:hidden px-4 py-3 mx-2">
                <ul>
                    {navLinks.map((link,index)=>(
                    <li key={index} className="mb-3 font-sans">
                            <div
                                className="nav-link-item hover:text-yellow-400 flex items-center justify-between cursor-pointer"
                                onClick={() => {
                                    // if this nav item has a submenu, toggle only this submenu
                                    if (link.subNav && link.subNav.length > 0) {
                                        setOpenSmallIndex(openSmallIndex === index ? null : index);
                                    } else {
                                        // no submenu: close mobile menu after navigating
                                        setClickMenu(false);
                                    }
                                }}
                            >
                                <Link to={link.href} className="block font-normal">
                                    {link.title}
                                </Link>
                                <i className={`${link.icon} ml-2`}></i>
                            </div>
                            {/* dropdown for this item */}
                            {openSmallIndex === index && link.subNav && link.subNav.length > 0 && (
                                <ul className="transition-opacity duration-200 mt-2">
                                {link.subNav.map((subLink, subIndex) => (
                                        <li key={subIndex}>
                                        <Link
                                                to={subLink.href}
                                                onClick={() => setClickMenu(false)}
                                                className="block px-4 py-2 hover:bg-gray-100 hover:text-[#035CB0]"
                                        >
                                                {subLink.title}
                                        </Link>
                                        </li>
                                ))}
                                </ul>
                            )}
                    </li>
                    ))}
                    <li><Link to="/blogs" className="block font-normal text-sm hover:text-yellow-400">Blogs</Link></li>
                </ul>
                <div className="nav-cta w-full sm:hidden flex items-center justify-center gap-8 h-12">
                    <Link to="/admin/login" className="py-2.5 rounded-md px-5 bg-gray-100 text-red-600 font-semibold hover:border hover:border-white hover:bg-[#035CB0]">
                        <i className="ri-login-full mr-1"></i>
                        LOG IN
                    </Link>
                </div>
            </div>
            ) : ""}
        </nav>
        {/* <div className="header-low"> */}
        {/* <div className="large-nav-link bg-[#035CB0] max-sm:hidden flex justify-between font-normal border-r border-r-1 mx-10 py-5 px-20">
            <ul className="flex items-center gap-20 text-[#fff]">
            {navLinks.map((link,index)=>(
                <li key={index}>
                    <Link className="nav-link-item hover:text-yellow-400 flex flex-col items-center" href={link.href}>
                        <i className={link.icon}></i>
                        <span className="block font-sans leading-none font-semibold md:text-lg text-nowrap">{link.title}</span>
                    </Link>
                </li>
            ))}
            </ul>
        </div> */}
    </div>
  )
}

export default Header