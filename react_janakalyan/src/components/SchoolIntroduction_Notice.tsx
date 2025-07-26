
const SchoolIntroduction_Notice = () => {
    const Notices=[
        {
            title: "School will be closed on Friday for maintenance.",
            date: "2025-01-01"
        },
        {
            title: "Parent-Teacher meeting scheduled for next week.",
            date: "2025-01-02"
        },
        {
            title: "New library books are available for checkout.",
            date: "2025-01-03"
        }
    ]
  return (
    <div className='w-full bg-white p-5 flex gap-14 px-11 mt-4'>
        <div className="intro w-2/3">
            <h1 className='text-3xl mb-2 font-bold'>School Introduction</h1>
            <p className='text-gray-700 font-light leading-7 text-justify'>Welcome to our school! We are dedicated to providing a high-quality education to our students.
                Our experienced faculty and innovative curriculum ensure that every child reaches their full potential.
                We offer a wide range of extracurricular activities to foster creativity and personal growth.
                Our state-of-the-art facilities and supportive community create a nurturing environment for learning.
                Join us in shaping the future of our students and empowering them to become leaders in their communities
            </p>
            <button className='py-2.5 px-5 bg-[#035CB0] text-white rounded-md mt-4 hover:text-yellow-400 text-nowrap'>Read More</button>
        </div>
        <div className="notice w-1/2 shadow-gray-600 shadow-lg h-80 rounded-md">
            <h1 className='text-xl font-bold p-4 bg-[#035CB0] text-white rounded-t-md'>Recent Notices</h1>
            <ul className='list-none p-5 flex flex-col gap-3'>
                {Notices.map((notice, index) => (
                    <li key={index} className='cursor-pointer hover:text-yellow-600 font-medium'>
                        <h1 className="border-l-4 border-[#035CB0] pl-2 py-1">{notice.title}</h1>
                        <span className='text-gray-500 ml-3 font-normal text-sm'>{notice.date}</span>
                    </li>
                ))}
            </ul>
        </div>
    </div>
  )
}

export default SchoolIntroduction_Notice
