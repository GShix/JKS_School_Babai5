import { useState } from "react";

export const AcademicPrograms = () => {
    const [tab, setTab] = useState<string>("education");
    const content = [
        education: {
            title: "Education",
            description: "Education is the most powerful weapon which you can use to change the world.",
        },
        agriculture: {
            title: "Agriculture",   
            description: "Agriculture is the backbone of our economy.",
        },
        management: {
            title: "Management",
            description: "Management is doing things right; leadership is doing the right things.",
        }
    ]
    return (
        <div className="academic-programs px-12 w-full">
            <h1 className="text-3xl mb-2 font-bold">Academic Programs</h1>
            <div className="tab-and-contents flex max-sm:flex-col gap-4 ">
                <div className="w-1/3">
                    {tab=="education" && <img src="/img/aca-education.jpg" alt="Education" />}
                    {tab=="agriculture" && <img src="/img/aca-agriculture.jpg" alt="Agriculture" />}
                    {tab=="management" && <img src="/img/aca-management.jpeg" alt="Management" />}
                </div>
                <div className="w">
                    <div className="tabs flex mb-4 text-2xl font-semibold cursor-pointer">
                        <h1 className={`px-5 py-4 ${tab === "education" ? "bg-white text-black" : "bg-[#035CB0] text-white"}`} onClick={() => {setTab("education")}}>Tab Education</h1>
                        <h1 className={`px-5 py-4 ${tab === "agriculture" ? "bg-white text-black" : "bg-[#035CB0] text-white"}`} onClick={() => {setTab("agriculture")}}>Tab Agriculture</h1>
                        <h1 className={`px-5 py-4 ${tab === "management" ? "bg-white text-black" : "bg-[#035CB0] text-white"}`} onClick={() => {setTab("management")}}>Tab Management</h1>
                    </div>
                    <div className="tab-content">
                        {tab=="education" && (
                            <div>
                                <h1></h1>
                            </div>
                        )}
                        {tab=="agriculture" && (
                            <div>
                                <h1>Agriculture Content</h1>
                            </div>
                        )}
                        {tab=="management" && (
                            <div>
                                <h1>Management Content</h1>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
