import { Link } from "react-router-dom"


const Footer = () => {
  return (
    <footer className="bg-[#ffff] w-full border-t border-gray-200">
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
                        <i className="ri-map-pin-2-fill text-gray-900 md:pl-2"></i>
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
            <div className="footer-fb-page max-sm:mt-5">
                <h1 className="text-lg font-semibold mb-4">Official Facebeook Page</h1>
                <iframe src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fjanakalyana.ma.bi.padamapura.dana&tabs=timeline&width=400&height=300&small_header=true&adapt_container_width=true&hide_cover=true&show_facepile=true&appId" width="400" height="300" scrolling="no" frameBorder="0" 
                className="border-0 overflow-hidden"
                allowFullScreen={true} allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"></iframe>
                {/* <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3516.6370459737786!2d82.1354621!3d28.187951699999996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39981ddb63b5812f%3A0x459611dac3a9d5cc!2sJanakalyan%20H.S.S.%20Padampur!5e0!3m2!1sen!2snp!4v1757949161711!5m2!1sen!2snp" width="600" height="450" allowFullScreen={true} loading="lazy" 
                className="border-0 w-full h-48 rounded-md"
                referrerPolicy="no-referrer-when-downgrade"></iframe> */}
                {/* <ul className="">
                    <li className="flex flex-col gap-4">
                        <a className="text-gray-900 transition hover:text-[#035CB0]" href="#">Notices</a>
                        <a className="text-gray-900 transition hover:text-[#035CB0]" href="#">Contact Us</a>
                        <a className="text-gray-900 transition hover:text-[#035CB0]" href="#">FAQ's</a>
                        <a className="text-gray-900 transition hover:text-[#035CB0]" href="#">Admission</a>
                        <a className="text-gray-900 transition hover:text-[#035CB0]" href="#">Results</a>
                    </li>
                </ul> */}
            </div>
        </div>

        <div className="copyright bg-[#035CB0] py-5 text-white px-4">
            <p className="w-full text-center text-sm">&copy; 2025 | Janakalyan Secondary School | All Rights Reserved</p>
        </div>
    </footer>
  )
}

export default Footer