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
    <div className="py-8 px-5 sm:px-8 bg-white rounded shadow">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 max-sm:items-start">
        <h1 className="text-2xl font-bold mb-4 sm:mb-0 max-sm:hidden">Frequently Asked Questions</h1>
        <h1 className="text-2xl font-bold mb-4 sm:hidden sm:mb-0">FAQs</h1>
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
              className="w-full text-left p-4 bg-gray-100 rounded-t shadow hover:bg-[#E3D6B4]"
              onClick={() => toggleFAQ(index)}>
              {index + 1}. <span className="question">{faq.question}</span>
            </button>
            {faq.open && (
              <div className="p-4 bg-white border rounded-b shadow-inner">
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
