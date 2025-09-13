export default function CTA() {
    return (
      <div className="bg-[#e3d6b4] w-full px-5 py-16 flex justify-center items-center">
        <div className="connect-section flex flex-col items-center gap-10 text-black text-center">
            <h3 className="sm:text-4xl text-xl lg:px-64 leading-normal">Join with <span className="font-bold">thousands of students</span> around the <span className="font-bold">Nepal</span> and achieve your <span className="font-bold">goal together.</span></h3>
            <div className="connect-btn">
                <a href="/login" className="py-2.5 px-5 bg-[#000000] rounded-md hover:bg-[#b99a45] hover:border-2 hover:border-[#1a1a1a] text-white font-bold text-base sm:text-xl">Connect Together now</a>
            </div>
        </div>
      </div>
    )
  }
