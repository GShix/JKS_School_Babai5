import { Link } from "react-router-dom"


const Footer = () => {
  return (
    <footer className="bg-[#ffff] w-full">
        <div className="footer-nav flex max-sm:flex-col justify-between max-gap-10 px-6 py-5 sm:px-8 lg:px-11">
            <div className="footer-info text-teal-600">
                <li className="list-none flex flex-col sm:items-center gap-4 text-gray-900">
                    <Link to="/" className="flex gap-2 items-center border-b border-gray-300">
                        <img className="max-sm:h-24 sm:h-32 cursor-pointer mb-2" src="/img/icon.png" alt="JanakalyanMaVi Logo"/>
                    </Link>
                    <Link to="tel:+9779844929502" className="flex gap-2 items-center ">
                        <i className="ri-phone-fill text-gray-900"></i>
                        <span className="info-text">+977 9844929502</span>
                    </Link>
                    <Link to="mailto:jksschoolp5@gmail.com" className="flex gap-2 items-center ">
                        <i className="ri-mail-fill text-gray-900"></i>
                        <span className="info-text">jksschoolp5@gmail.com</span>
                    </Link>
                    <Link to="address" className="flex gap-2 items-center ">
                        <i className="ri-map-pin-2-fill text-gray-900"></i>
                        <span className="info-text">Babai-5, Padampur, Dang</span>
                    </Link>
                    <Link to="https://www.facebook.com/janakalyana.ma.bi.padamapura.dana" rel="noreferrer" target="_blank" className="text-gray-900 transition hover:text-gray-900/75">
                        <i className="ri-facebook-circle-fill text-blue-600 text-2xl leading-none"></i>
                    </Link>
                </li>
            </div>
            <div className="footer-about max-sm:mt-5">
                <h1 className="text-lg font-semibold mb-4">About</h1>
                <ul>
                    <li className="flex flex-col gap-4">
                        <a className="text-gray-900 transition hover:text-[#035CB0]" href="#">About School</a>
                        <a className="text-gray-900 transition hover:text-[#035CB0]" href="#">School's Facilities</a>
                        <a className="text-gray-900 transition hover:text-[#035CB0]" href="#">Management Committee</a>
                        <a className="text-gray-900 transition hover:text-[#035CB0]" href="#">Faculty Members</a>
                        <a className="text-gray-900 transition hover:text-[#035CB0]" href="#">Message From Principal</a>
                        <a className="text-gray-900 transition hover:text-[#035CB0]" href="#">Message From Chairperson</a>
                    </li>
                </ul>
            </div>
            <div className="footer-academic-programs max-sm:mt-5">
                <h1 className="text-lg font-semibold mb-4">Academic Programs</h1>
                <ul className="">
                    <li className="flex flex-col gap-4">
                        <a className="text-gray-900 transition hover:text-[#035CB0]" href="#">Agriculture</a>
                        <a className="text-gray-900 transition hover:text-[#035CB0]" href="#">Management</a>
                        <a className="text-gray-900 transition hover:text-[#035CB0]" href="#">Education</a>
                        <a className="text-gray-900 transition hover:text-[#035CB0]" href="#">आधारभूत शिक्षा</a>
                    </li>
                </ul>
            </div>
            <div className="footer-important-links max-sm:mt-5">
                <h1 className="text-lg font-semibold mb-4">Important Links</h1>
                <ul className="">
                    <li className="flex flex-col gap-4">
                        <a className="text-gray-900 transition hover:text-[#035CB0]" href="#">Notices</a>
                        <a className="text-gray-900 transition hover:text-[#035CB0]" href="#">Contact Us</a>
                        <a className="text-gray-900 transition hover:text-[#035CB0]" href="#">FAQ's</a>
                        <a className="text-gray-900 transition hover:text-[#035CB0]" href="#">Admission</a>
                        <a className="text-gray-900 transition hover:text-[#035CB0]" href="#">Results</a>
                    </li>
                </ul>
            </div>
        </div>

        <div className="copyright bg-[#035CB0] py-5 text-white px-4">
            <p className="w-full text-center text-sm">&copy; 2025 | Janakalyan Secondary School | All Rights Reserved</p>
        </div>
    </footer>
  )
}

export default Footer