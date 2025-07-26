

export default function Banner() {
    // const [visible,setVisible] = useState(true);

    // // if(!visible){
    // //     return null;
    // // }
    //     const [clickMenu, setClickMenu] = useState(false);
    const navLinks = [
        {
            title:"Academic Excellence",
            icon:"ri-trophy-fill text-5xl",
            href:"/"
        },
        {
            title:"Extracurricular Activities",
            icon:"ri-medal-fill text-5xl",
            href:"/"
        },
        {
            title:"Equipped Labs & Classrooms",
            icon:"ri-flask-fill text-5xl",
            href:"/"
        },
        {
            title:"Qualified Teachers",
            icon:"ri-user-fill text-5xl",
            href:"/"
        },
    ]
  return (
    <div className="large-nav-link bg-[#035CB0] flex justify-between font-normal mx-4 sm:mx-11 py-8 px-10 sm:px-20 rounded-md mt-2">
        <ul className="flex max-sm:flex-col items-center gap-10 sm:gap-20 text-[#fff]">
        {navLinks.map((link,index)=>(
            <li key={index} className=''>
                <a className="nav-div-item hover:text-yellow-400 flex max-sm:flex-col justify-center items-center" href={link.href}>
                    <i className={`${link.icon} mr-3`}></i>
                    <span className="block font-sans leading-7 font-semibold text-xl">{link.title}</span>
                </a>
            </li>
        ))}
        </ul>
    </div>
    // visible && <div className="flex mb-10 items-center gap-x-6 bg-gradient-to-r from-[#c7ae6a] to-[#1a1a1a] px-5 py-3 sm:px-5 w-full">
    //     <div className="flex justify-center lg:gap-20 w-full lg:px-10 items-center">
    //         <div className="banner-details flex flex-wrap gap-y-2 items-center">
    //             <p className='text-sm sm:text-base text-gray-100'><span className='font-bold'>Workshop on : </span>Career on Web Development in Nepal</p>
    //             <a href="" className='rounded-full ml-3 bg-gray-900 px-3.5 py-1 text-sm font-semibold text-gray-200 shadow-sm hover:bg-[#c7ae6a] hover:text-black'>
    //                 Register now <span aria-hidden="true">&rarr;</span>
    //             </a>
    //         </div>
    //         <div className="h-full">
    //             <button type="button" className="focus-visible:outline-offset-[-4px] flex items-center" onClick={()=>setVisible(false)}>
    //                 <span className="sr-only">Dismiss</span>
    //                 <XMarkIcon aria-hidden="true" className="h-7 w-7 text-red-500 hover:bg-gray-50 rounded-full" />
    //             </button>
    //         </div>
    //     </div>
    // </div>
  )
}
