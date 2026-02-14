import { useState } from 'react';

function FAQ() {
  const [filter, setFilter] = useState('');
  const [faqs, setFaqs] = useState([
    {
      question: "Why education is important?",
      answer: "Education is important because it provides individuals with the knowledge and skills needed to succeed in life. It promotes critical thinking, creativity, and personal development.",
      open: false,
    },
    {
      question: "Which programs are available on Jankalyan Ma Vi?",
      answer: "Jankalyan Ma Vi offers a variety of programs including academic courses, skill development workshops, and extracurricular activities designed to enhance the overall learning experience.",
      open: false,
    },
    {
      question: "Can I participate in virtual events?",
      answer: "Absolutely! Jankalyan Ma Vi offers a range of free/paid virtual events that you can join or host. These events provide opportunities to network, learn, and collaborate with fellow students.",
      open: false,
    },

  ]);

  const filteredFaqs = faqs.filter((faq) => {
    const lowerCaseFilter = filter.toLowerCase();
    return (
      faq.question.toLowerCase().includes(lowerCaseFilter) ||
      faq.answer.toLowerCase().includes(lowerCaseFilter)
    );
  });

  const toggleFAQ = (index:any) => {
    const updatedFaqs = [...faqs];
    updatedFaqs[index].open = !updatedFaqs[index].open;
    setFaqs(updatedFaqs);
  };

  const handleSearch = (event:any) => {
    setFilter(event.target.value);
  };

  return (
    <div className="py-4 sm:py-8 px-5 sm:px-11 bg-white rounded shadow">
        <div className="flex justify-center w-full mb-4">
          <h1 className="text-lg text-[#035CB0] bg-gray-100 px-4 py-2 rounded-full">Frequently Asked Questions</h1>
        </div>
        <div className="view-all mb-6 sm:mt-0 flex justify-center w-full">
          <h1 className="text-2xl sm:text-4xl text-[#035CB0] font-bold">Explore More About Janakalyan</h1>
        </div>
      <div className="flex flex-col sm:flex-row justify-end items-center mb-6 max-sm:items-start">
        <input
          type="text"
          value={filter}
          onChange={handleSearch}
          placeholder="Search FAQs"
          className="w-full sm:w-1/3 p-2 mb-2 sm:mb-0 border rounded"
        />
      </div>
      <ul>
        {filteredFaqs.map((faq, index) => (
          <li key={index} className="mb-4">
            <button
              className="w-full text-left p-4 bg-gray-100 rounded-t cursor-pointer shadow hover:bg-[#035CB0] hover:text-white transition-colors duration-300 active:text-white"
              onClick={() => toggleFAQ(index)}>
              {index + 1}. <span className="question">{faq.question}</span>
            </button>
            {faq.open && (
              <div className="p-4 bg-white border-b rounded-md shadow-inner">
                <div className="answer max-sm:text-sm">{faq.answer}</div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default FAQ;
