import { useState } from "react";

export const AcademicProgramsCard = () => {
    const [tab, setTab] = useState<string>("education");
    const content = {
        education: {
            title: "Education",
            description: "The Education program at this school provides a strong foundation in teaching and learning at the secondary level. Our curriculum follows the National Examination Board (NEB) syllabus, focusing on core subjects and practical teaching methods. Experienced faculty guide students to develop essential skills for further studies and future careers in education.",
        },
        agriculture: {
            title: "Agriculture",
            description: "The Agriculture program at this school offers secondary-level students a comprehensive introduction to agricultural science and practices. The curriculum is based on the NEB syllabus and includes hands-on learning, preparing students for higher studies or careers in agriculture and related fields.",
        },
        management: {
            title: "Management",
            description: "The Management program at this school equips secondary-level students with fundamental knowledge in business, economics, and management. Following the NEB syllabus, the program helps students build analytical and leadership skills for further education and future opportunities in management and commerce.",
        }
    }
    return (
        <section className="academic-programs px-4 sm:px-12 w-full h-full bg-[#F7F7F7] py-4">
            <h2 className="text-2xl sm:text-4xl mb-4 font-bold text-[#035CB0]">Academic Programs</h2>
            <div className="tab-and-contents flex max-sm:flex-col w-full">
                <div className="max-sm:w-full w-[40%] max-sm:hidden">
                    {tab == "education" && <img className="w-full h-full rounded-l-md" src="/img/aca-education.jpg" alt="Students in Education Program at this school" loading="lazy" />}
                    {tab == "agriculture" && <img className="w-full h-full rounded-l-md" src="/img/aca-agriculture.jpg" alt="Practical Agriculture Session at this school" loading="lazy" />}
                    {tab == "management" && <img className="w-full h-full rounded-l-md" src="/img/aca-management.jpeg" alt="Management Students Class" loading="lazy" />}
                </div>
                <div className="max-sm:w-full sm:w-[60%]">
                    <div className="tabs flex sm:text-2xl font-semibold flex-wrap" role="tablist">
                        <button
                            className={`px-5 py-4 cursor-pointer text-left border-0 ${tab === "education" ? "bg-[#035CB0] text-white" : "bg-white text-black "}`}
                            onClick={() => { setTab("education") }}
                            role="tab"
                            aria-selected={tab === "education"}
                        >
                            Education
                        </button>
                        <button
                            className={`px-5 py-4 cursor-pointer text-left border-0 ${tab === "agriculture" ? "bg-[#035CB0] text-white" : "bg-white text-black "}`}
                            onClick={() => { setTab("agriculture") }}
                            role="tab"
                            aria-selected={tab === "agriculture"}
                        >
                            Agriculture
                        </button>
                        <button
                            className={`px-5 py-4 cursor-pointer text-left border-0 ${tab === "management" ? "bg-[#035CB0] text-white" : "bg-white text-black "}`}
                            onClick={() => { setTab("management") }}
                            role="tab"
                            aria-selected={tab === "management"}
                        >
                            Management
                        </button>
                    </div>
                    <div className="tab-content bg-[#035CB0] text-white p-2 sm:p-6 min-h-[200px] sm:rounded-r-md max-sm:rounded-b-md text-justify" role="tabpanel">
                        {tab == "education" && (
                            <article>
                                <h3 className="font-semibold text-2xl mb-2">{content.education.title}</h3>
                                <p>{content.education.description}</p>
                            </article>
                        )}
                        {tab == "agriculture" && (
                            <article>
                                <h3 className="font-semibold text-2xl mb-2">{content.agriculture.title}</h3>
                                <p>{content.agriculture.description}</p>
                            </article>
                        )}
                        {tab == "management" && (
                            <article>
                                <h3 className="font-semibold text-2xl mb-2">{content.management.title}</h3>
                                <p>{content.management.description}</p>
                            </article>
                        )}
                    </div>
                </div>
            </div>
        </section>
    )
}
