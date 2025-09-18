import { useState } from "react";

export const AcademicPrograms = () => {
    const [tab, setTab] = useState<string>("education");
    const content = {
        education: {
            title: "Education",
            description: "The Department of Education at JKSS (presumably referring to Kathmandu Model College) has been established since the institution’s inception, with a primary focus on providing in-depth knowledge of education at its level. The faculty’s main objective is to produce future educators and experts by offering comprehensive education in pedagogy and teaching methods. The department is led by reputed and professional academicians in the field of education who bring their expertise and experience to the classroom. The curriculum not only covers the National Examination Board (NEB) syllabus but also emphasizes competitive examinations such as CA (Chartered Accountancy) and BBA (Bachelor of Business Administration) courses. This approach provides students with a practical knowledge base and prepares them for a wide range of opportunities in the education field.",
        },
        agriculture: {
            title: "Agriculture",
            description: "The Department of Agriculture at JKSS (presumably referring to Kathmandu Model College) has been established since the institution’s inception, with a primary focus on providing in-depth knowledge of agriculture at its level. The faculty’s main objective is to produce future agriculturalists and experts by offering comprehensive education in agriculture. The department is led by reputed and professional academicians in the field of agriculture who bring their expertise and experience to the classroom. The curriculum not only covers the National Examination Board (NEB) syllabus but also emphasizes competitive examinations such as CA (Chartered Accountancy) and BBA (Bachelor of Business Administration) courses. This approach provides students with a practical knowledge base and prepares them for a wide range of opportunities in the agriculture field.",
        },
        management: {
            title: "Management",
            description: "The Department of Management at JKSS (presumably referring to Kathmandu Model College) has been established since the institution’s inception, with a primary focus on providing in-depth knowledge of management at its level. The faculty’s main objective is to produce future managers and chartered accountants by offering comprehensive management education. The department is led by reputed and professional academicians in the field of management who bring their expertise and experience to the classroom. The curriculum not only covers the National Examination Board (NEB) syllabus but also emphasizes competitive examinations such as CA (Chartered Accountancy) and BBA (Bachelor of Business Administration) courses. This approach provides students with a practical knowledge base and prepares them for a wide range of opportunities in the management field.",
        }
    }
    return (
        <div className="academic-programs px-4 sm:px-12 w-full h-full bg-[#F7F7F7] py-2 sm-mb-10">
            <h1 className="text-3xl mb-2 font-bold text-[#035CB0]">Academic Programs</h1>
            <div className="tab-and-contents flex max-sm:flex-col w-full">
                <div className="max-sm:w-full w-[40%] max-sm:hidden">
                    {tab=="education" && <img className="w-full h-full rounded-l-md" src="/img/aca-education.jpg" alt="Education" />}
                    {tab=="agriculture" && <img className="w-full h-100 rounded-l-md" src="/img/aca-agriculture.jpg" alt="Agriculture" />}
                    {tab=="management" && <img className="w-full h-full rounded-l-md" src="/img/aca-management.jpeg" alt="Management" />}
                </div>
                <div className="max-sm:w-full sm:w-[60%]">
                    <div className="tabs flex sm:text-2xl font-semibold flex-wrap">
                        <h1 className={`px-5 py-4 cursor-pointer ${tab === "education" ? "bg-[#035CB0] text-white" : "bg-white text-black "}`} onClick={() => {setTab("education")}}>Education</h1>
                        <h1 className={`px-5 py-4 cursor-pointer ${tab === "agriculture" ? "bg-[#035CB0] text-white" : "bg-white text-black "}`} onClick={() => {setTab("agriculture")}}>Agriculture</h1>
                        <h1 className={`px-5 py-4 cursor-pointer ${tab === "management" ? "bg-[#035CB0] text-white" : "bg-white text-black "}`} onClick={() => {setTab("management")}}>Management</h1>
                    </div>
                    <div className="tab-content bg-[#035CB0] text-white p-2 sm:p-6 min-h-[200px] sm:rounded-r-md max-sm:rounded-b-md text-justify">
                        {tab=="education" && (
                            <div>
                                <h1 className="font-semibold text-2xl mb-2">{content.education.title}</h1>
                                <p>{content.education.description}</p>
                            </div>
                        )}
                        {tab=="agriculture" && (
                            <div>
                                <h1 className="font-semibold text-2xl mb-2">{content.agriculture.title}</h1>
                                <p>{content.agriculture.description}</p>
                            </div>
                        )}
                        {tab=="management" && (
                            <div>
                                <h1 className="font-semibold text-2xl mb-2">{content.management.title}</h1>
                                <p>{content.management.description}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
