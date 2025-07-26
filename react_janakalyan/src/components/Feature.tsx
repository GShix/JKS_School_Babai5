
export default function Feature(){
    const features =[
        {
            icon:"/img/academic_excellence.png",
            title:"Academic Excellence",
            description:"Our school is dedicated to fostering a love of learning and helping students achieve academic success through a rigorous and comprehensive curriculum."
        },
        {
            icon:"/img/faculty.png",
            title:"Experienced Faculty",
            description:"We pride ourselves on having a team of highly qualified and experienced teachers who are committed to the intellectual and personal growth of each student."
        },
        {
            icon:"/img/development.png",
            title:"Holistic Development",
            description:"We promote all-around development through diverse extracurricular activities, including sports, arts, and clubs, to nurture students' talents and interests."
        },
        {
            icon:"/img/values_ethics.png",
            title:"Strong Values & Ethics",
            description:"We instill strong moral values and ethical principles in our students, preparing them to be responsible and compassionate global citizens."
        }
    ]
    return (
        <section className="py-5 pt-14 bg-white mb-10 px-11 flex justify-center w-full">
            <div className="mx-auto">
                <div className="text-center">
                    <div className="inline-flex justify-center px-4 py-1.5 mx-auto rounded-full bg-gradient-to-r from-fuchsia-600 to-blue-600">
                        <p className="text-xl font-semibold tracking-widest text-white uppercase">Why Janakalyan Secondary School</p>
                    </div>
                    <div className="feature flex justify-center w-full">
                        <h2 className="mt-3 text-xl leading-normal text-black w-full">Our school is dedicated to fostering a love of learning and helping students achieve academic success through a rigorous and comprehensive curriculum </h2>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-2 mt-5 sm:grid-cols-4 lg:mt-12 lg:gap-x-6 max-sm:p-4">
                    {features.map((feature,index)=>(
                    <div key={index} className="feature-item transition-all duration-200 rounded-md" style={{boxShadow:"0px 0px 10px 2px #e3d6b4"}}>
                        <div className="feature-box py-3 px-2 flex flex-col items-center text-center hover:text-[#c7ae6a] cursor-pointer">
                            <img className="px-2 py-2 bg-none text-[#e3d6b4] w-40 h-40" src={`${feature.icon}`}/>
                            <h3 className="mt-4 text-2xl font-semibold ">{feature.title}</h3>
                            <p className="mt-4 text-sm max-w-[80%] text-gray-600">{feature.description}</p>
                        </div>
                    </div>
                    ))}

                </div>
            </div>
        </section>
    )
}
