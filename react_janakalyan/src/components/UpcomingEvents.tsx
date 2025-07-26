// import { useState } from "react";

// function UpcomingEvents() {
//   const [events, setEvents] = useState([
//     {
//         img:"/img/event1.jpg",
//       title: "Session 09 - Offensive System and Network Security By Manan Jain",
//       host: "OWASP Patna Chapter",
//       date: "Sat, Aug 31 · 2:15 PM NPT",
//       attendees: "20 attendees",
//       entry: "Free",
//     },
//     {
//         img:"/img/event2.jpg",
//         title: "Introduction to Vector Search and Embeddings using Vertex AI",
//         host: "Machine Learning Hajipur",
//         date: "Sat, Aug 31 · 4:15 PM NPT",
//         attendees: "20 attendees",
//         entry: "Free",
//     },
//     {
//         img:"/img/event3.jpg",
//         title: "Nepal Cloud Meetup- Sept 2024",
//         host: "Nepal Cloud Professionals",
//         date: "Sat, Sep 21 · 1:00 PM NPT",
//         attendees: "16 attendees",
//         entry: "Free",
//     },
//     {
//         img:"/img/event4.jpg",
//         title: "GitHub Actions: Building and Deploying Apps with Docker",
//         host: "Docker Lucknow",
//         date: "Sat, Sep 21 · 12:45 PM NPT",
//         attendees: "67 attendees",
//         entry: "Free",
//     },
//   ]);

// //   const toggleFAQ = (index) => {
// //     const updatedFaqs = [...faqs];
// //     updatedFaqs[index].open = !updatedFaqs[index].open;
// //     setFaqs(updatedFaqs);
// //   };

// //   const handleSearch = (event) => {
// //     setFilter(event.target.value);
// //   };

//   return (
//     <div className="p-5 bg-white rounded shadow">
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:px-4">
//         <h1 className="text-3xl font-bold sm:mb-0">Upcoming Online Events</h1>
//         {/* <input
//           type="text"
//           value={filter}
//           onChange={handleSearch}
//           placeholder="Search FAQs"
//           className="w-full sm:w-1/3 p-2 mb-4 sm:mb-0 border rounded"
//         /> */}
//       </div>
//       <div className="sm:px-4 grid grid-cols-1 gap-5 mt-6 sm:grid-cols-4 lg:mt-10 lg:gap-x-12 overflow-hidden">
//         {events.map((event, index) => (
//           <div key={index} className="card w-full hover:bg-[#e3d6b4] rounded-md px-2.5 pt-2.5 pb-5 cursor-pointer max-sm:flex max-sm:flex-row-reverse items-center justify-between border-2 border-[#C7AE6A] max-sm:mb-3">
//             <div className="card-img max-sm:w-1/4 max-sm:h-full">
//                 <img className='w-full rounded-md mb-2 object-cover object-center max-sm:h-[80%]' src={event.img} alt="" sizes="" srcSet="" />
//             </div>
//             <div className="card-details max-sm:w-[70%]">
//                 <h1 className='font-bold text-lg hover:underline flex flex-wrap'>{event.title}</h1>
//                 <p className='font-bold text-sm mt-1 text-gray-600'>Hosted By: {event.host}</p>
//                 <div className="date mt-2 text-base px-1">
//                     <i className="ri-calendar-schedule-fill mr-2"></i>
//                     <span>{event.date}</span>
//                 </div>
//                 <div className="flex gap-6 mt-2 px-1">
//                     <div className="attendees">
//                         <i className="ri-user-heart-fill mr-2"></i>
//                         <span>{event.attendees}</span>
//                     </div>
//                     <div className="entry">
//                         <i className="ri-ticket-2-fill mr-2"></i>
//                         <span>{event.entry}</span>
//                     </div>
//                 </div>

//             </div>
//           </div>
//         ))}
//         </div>
//     </div>
//   );
// }

// export default UpcomingEvents;
