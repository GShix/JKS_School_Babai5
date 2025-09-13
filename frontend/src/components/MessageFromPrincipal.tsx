const MessageFromPrincipal = () => {
  return (
    <div className='max-sm:flex-col sm:flex px-4 sm:px-11 gap-4 w-full py-10 bg-gray0 mt-4'>
        <div className="photo sm:w-2/3 ]">
            <img className='w-full h-full rounded-md' src="/img/headmaster-2.jpg" alt="Headmaster" />
        </div>
        <div className="message sm:w-[95%]">
            <h2 className='text-3xl font-bold leading-none text-[#035CB0] mb-5'>Message from the Principal</h2>
            <p className='text-lg mt-2 text-justify'>Welcome to our school! We are dedicated to providing a nurturing and challenging environment for our students. Our mission is to foster a love for learning and to prepare our students for success in their future endeavors.
            </p>
            <button className='py-2.5 px-5 bg-[#035CB0] text-white rounded-md mt-3 hover:text-yellow-400 text-nowrap cursor-pointer'>Read More</button>
            <h1 className='mt-8 font-semibold text-xl'>Ganesh Bahadur K.C.</h1>
            <h2 className="font-medium">Headmaster</h2>
            <p className=''>Phone: 9844929502</p>
        </div>
    </div>
  )
}

export default MessageFromPrincipal
