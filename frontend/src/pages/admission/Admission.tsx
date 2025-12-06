import React from 'react';
import Header from '../../layouts/Header';
import Footer from '../../layouts/Footer';
import { Link } from 'react-router-dom';

type AdmissionLevel = {
  id: string;
  title: string;
  grades: string;
  ageRequirement: string;
  seats: number;
  deadline: string;
  description: string;
}

const admissionLevels: AdmissionLevel[] = [
  {
    id: 'early-years',
    title: 'Early Years (Nursery, LKG, UKG)',
    grades: 'Nursery, LKG, UKG',
    ageRequirement: '3-5 years',
    seats: 30,
    deadline: '2025-12-31',
    description: 'Foundation program with play-based learning and early development activities.'
  },
  {
    id: 'primary',
    title: 'Primary Level (Grade 1-5)',
    grades: 'Grade 1 to Grade 5',
    ageRequirement: '6-10 years',
    seats: 40,
    deadline: '2025-12-31',
    description: 'Comprehensive curriculum focusing on core subjects and skill development.'
  },
  {
    id: 'lower-secondary',
    title: 'Lower Secondary (Grade 6-8)',
    grades: 'Grade 6 to Grade 8',
    ageRequirement: '11-13 years',
    seats: 40,
    deadline: '2025-12-31',
    description: 'Preparation for secondary education with expanded subject offerings.'
  },
  {
    id: 'secondary',
    title: 'Secondary Level (Grade 9-10)',
    grades: 'Grade 9, Grade 10',
    ageRequirement: '14-15 years',
    seats: 50,
    deadline: '2026-01-15',
    description: 'Available in General and Agriculture medium, preparing students for SLC.'
  },
  {
    id: 'plus-two',
    title: 'Plus Two / Class 11-12',
    grades: 'Class XI, Class XII',
    ageRequirement: '16-18 years',
    seats: 120,
    deadline: '2026-01-31',
    description: 'Specialized streams: Agriculture, Education, and Management.'
  }
];

type FAQ = {
  question: string;
  answer: string;
}

const faqs: FAQ[] = [
  {
    question: 'What documents are required for admission?',
    answer: 'You need: Birth certificate, previous school marksheet/character certificate, passport-size photos (4 copies), transfer certificate (if applicable), and parent/guardian ID proof.'
  },
  {
    question: 'Is there an entrance exam?',
    answer: 'For Grade 1-8, a simple assessment is conducted. For Grade 9-12, an entrance test covering previous grade subjects is mandatory.'
  },
  {
    question: 'What is the admission fee structure?',
    answer: 'Admission fees vary by level. Please contact the administration office or download the fee structure from our Downloads page for detailed information.'
  },
  {
    question: 'Can I apply online?',
    answer: 'Yes! Fill out the online application form below and submit required documents digitally. The admission team will contact you within 3-5 business days.'
  },
  {
    question: 'Are scholarships available?',
    answer: 'Yes, merit-based and need-based scholarships are available for eligible students. Apply during the admission process and submit supporting documents.'
  }
];

export default function Admission() {
  const [showForm, setShowForm] = React.useState(false);

  // Application form state
  const [studentName, setStudentName] = React.useState('');
  const [dob, setDob] = React.useState('');
  const [gender, setGender] = React.useState('Male');
  const [applyingFor, setApplyingFor] = React.useState('');
  const [previousSchool, setPreviousSchool] = React.useState('');
  const [parentName, setParentName] = React.useState('');
  const [parentPhone, setParentPhone] = React.useState('');
  const [parentEmail, setParentEmail] = React.useState('');
  const [address, setAddress] = React.useState('');
  const [documents, setDocuments] = React.useState<File[]>([]);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [submitting, setSubmitting] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

  const resetForm = () => {
    setStudentName(''); setDob(''); setGender('Male'); setApplyingFor('');
    setPreviousSchool(''); setParentName(''); setParentPhone('');
    setParentEmail(''); setAddress(''); setDocuments([]); setErrors({});
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!studentName.trim()) e.studentName = 'Student name is required';
    if (!dob) e.dob = 'Date of birth is required';
    if (!applyingFor) e.applyingFor = 'Please select a level';
    if (!parentName.trim()) e.parentName = 'Parent/guardian name is required';
    if (!parentPhone.trim() || parentPhone.trim().length < 10) e.parentPhone = 'Valid phone number is required';
    if (!parentEmail.trim() || !/^\S+@\S+\.\S+$/.test(parentEmail)) e.parentEmail = 'Valid email is required';
    if (!address.trim()) e.address = 'Address is required';
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length > 0) return;

    setSubmitting(true);
    setSuccess(false);

    // Mock submission delay
    await new Promise(r => setTimeout(r, 1500));

    // In real app, send FormData with documents to server
    setSubmitting(false);
    setSuccess(true);
    
    // Auto-close form after success
    setTimeout(() => {
      setShowForm(false);
      resetForm();
      setSuccess(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Banner */}
      <div className="about-top w-full h-[300px] bg-[#035CB0] flex items-center justify-center px-12" 
           style={{backgroundImage: 'url(/img/running-shield-blur.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.9}}>
        <div className="text-center">
          <h1 className="text-5xl font-medium text-white mb-3">Admissions Open</h1>
          <p className="text-white text-lg">Academic Year 2082 BS (2025/26 AD)</p>
        </div>
      </div>

      <main className="container mx-auto px-4 sm:px-8 py-8">
        
        {/* Introduction Section */}
        <section className="bg-white rounded-lg shadow px-2 py-3 text-justify mb-8">
          <h2 className="text-2xl font-bold text-[#035CB0] mb-4">Welcome to Janakalyan Secondary School</h2>
          <p className="text-gray-700 mb-4">
            We are delighted to invite applications for admission to our school for the academic year 2082 BS. 
            Janakalyan Secondary School is committed to providing quality education with a focus on academic excellence, 
            character development, and holistic growth.
          </p>
          <p className="text-gray-700">
            Our experienced faculty, modern facilities, and comprehensive curriculum ensure that every student receives 
            the best possible education. We offer programs from Nursery to Class XII with specialized streams in 
            Agriculture, Education, and Management.
          </p>
        </section>

        {/* Admission Levels */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-[#035CB0] mb-6">Admission Information by Level</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 hover:shadow-xl">
            {admissionLevels.map(level => (
              <div key={level.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-5">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{level.title}</h3>
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div><strong>Grades:</strong> {level.grades}</div>
                  <div><strong>Age:</strong> {level.ageRequirement}</div>
                  <div><strong>Seats Available:</strong> {level.seats}</div>
                  <div><strong>Deadline:</strong> {new Date(level.deadline).toLocaleDateString()}</div>
                </div>
                <p className="text-gray-700 text-sm mb-4">{level.description}</p>
                <button 
                  onClick={() => { setApplyingFor(level.title); setShowForm(true); }}
                  className="w-full px-4 py-2 bg-[#035CB0] text-white rounded hover:text-yellow-400 transition cursor-pointer"
                >
                  Apply Now
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Admission Process */}
        <section className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-2xl font-bold text-[#035CB0] mb-6">Admission Process</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#035CB0] text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-3">1</div>
              <h4 className="font-semibold mb-2">Fill Application</h4>
              <p className="text-sm text-gray-600">Complete the online or offline application form with accurate details.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#035CB0] text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-3">2</div>
              <h4 className="font-semibold mb-2">Submit Documents</h4>
              <p className="text-sm text-gray-600">Upload or submit required documents at the school office.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#035CB0] text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-3">3</div>
              <h4 className="font-semibold mb-2">Entrance Test</h4>
              <p className="text-sm text-gray-600">Attend the assessment/entrance exam as per schedule.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#035CB0] text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-3">4</div>
              <h4 className="font-semibold mb-2">Confirmation</h4>
              <p className="text-sm text-gray-600">Receive admission confirmation and complete fee payment.</p>
            </div>
          </div>
        </section>

        {/* Important Dates & Downloads */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <section className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-[#035CB0] mb-4">Important Dates</h2>
            <ul className="space-y-3">
              <li className="flex justify-between border-b pb-2">
                <span className="font-medium">Application Start</span>
                <span className="text-gray-600">December 1, 2025</span>
              </li>
              <li className="flex justify-between border-b pb-2">
                <span className="font-medium">Early Years Deadline</span>
                <span className="text-gray-600">December 31, 2025</span>
              </li>
              <li className="flex justify-between border-b pb-2">
                <span className="font-medium">Grade 9-10 Deadline</span>
                <span className="text-gray-600">January 15, 2026</span>
              </li>
              <li className="flex justify-between border-b pb-2">
                <span className="font-medium">Class 11-12 Deadline</span>
                <span className="text-gray-600">January 31, 2026</span>
              </li>
              <li className="flex justify-between">
                <span className="font-medium">Entrance Exams</span>
                <span className="text-gray-600">February 2026</span>
              </li>
            </ul>
          </section>

          <section className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-[#035CB0] mb-4">Downloads & Resources</h2>
            <ul className="space-y-3">
              <li>
                <a href="/files/admission-form.pdf" download className="flex items-center text-[#035CB0] hover:underline">
                  <i className="ri-file-pdf-line mr-2 text-xl"></i>
                  Admission Application Form
                </a>
              </li>
              <li>
                <a href="/files/fee-structure.pdf" download className="flex items-center text-[#035CB0] hover:underline">
                  <i className="ri-file-pdf-line mr-2 text-xl"></i>
                  Fee Structure 2082
                </a>
              </li>
              <li>
                <a href="/files/prospectus.pdf" download className="flex items-center text-[#035CB0] hover:underline">
                  <i className="ri-file-pdf-line mr-2 text-xl"></i>
                  School Prospectus
                </a>
              </li>
              <li>
                <a href="/files/document-checklist.pdf" download className="flex items-center text-[#035CB0] hover:underline">
                  <i className="ri-file-pdf-line mr-2 text-xl"></i>
                  Document Checklist
                </a>
              </li>
              <li>
                <Link to="/downloads" className="flex items-center text-[#035CB0] hover:underline">
                  <i className="ri-folder-line mr-2 text-xl"></i>
                  View All Downloads
                </Link>
              </li>
            </ul>
          </section>
        </div>

        {/* FAQs */}
        <section className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-2xl font-bold text-[#035CB0] mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <details key={idx} className="border-b pb-4">
                <summary className="font-semibold text-gray-800 cursor-pointer hover:text-[#035CB0]">
                  {faq.question}
                </summary>
                <p className="mt-2 text-gray-600 pl-4">{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Contact Information */}
        <section className="bg-gradient-to-r from-[#035CB0] to-blue-700 text-white rounded-lg shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <i className="ri-phone-line text-4xl mb-2"></i>
              <h4 className="font-semibold mb-1">Call Us</h4>
              <p>+977 9844929502</p>
              <p className="text-sm">Mon-Fri: 8AM - 5PM</p>
            </div>
            <div>
              <i className="ri-mail-line text-4xl mb-2"></i>
              <h4 className="font-semibold mb-1">Email Us</h4>
              <p>jksschoolp5@gmail.com</p>
              <p className="text-sm">We reply within 24 hours</p>
            </div>
            <div>
              <i className="ri-map-pin-line text-4xl mb-2"></i>
              <h4 className="font-semibold mb-1">Visit Us</h4>
              <p>Padampur-5, Dang</p>
              <p className="text-sm">Nepal</p>
            </div>
          </div>
        </section>

      </main>

      {/* Application Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4" onClick={() => { setShowForm(false); resetForm(); }}>
          <div className="bg-white w-full max-w-3xl rounded-lg shadow-2xl max-h-[90vh] overflow-auto" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-[#035CB0]">Online Admission Application</h3>
              <button onClick={() => { setShowForm(false); resetForm(); }} className="text-gray-500 hover:text-red-600 text-2xl">
                <i className="ri-close-line hover:text-red-500 cursor-pointer"></i>
              </button>
            </div>

            {success ? (
              <div className="p-6 text-center">
                <i className="ri-checkbox-circle-line text-6xl text-green-600 mb-4"></i>
                <h4 className="text-2xl font-semibold text-gray-800 mb-2">Application Submitted!</h4>
                <p className="text-gray-600">Thank you for applying. Our admission team will contact you within 3-5 business days.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Student Full Name *</label>
                    <input value={studentName} onChange={e => setStudentName(e.target.value)} 
                           className="w-full border rounded px-3 py-2" placeholder="Enter full name" />
                    {errors.studentName && <div className="text-red-600 text-sm mt-1">{errors.studentName}</div>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Date of Birth *</label>
                    <input type="date" value={dob} onChange={e => setDob(e.target.value)} 
                           className="w-full border rounded px-3 py-2" />
                    {errors.dob && <div className="text-red-600 text-sm mt-1">{errors.dob}</div>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Gender *</label>
                    <select value={gender} onChange={e => setGender(e.target.value)} 
                            className="w-full border rounded px-3 py-2">
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Applying For *</label>
                    <select value={applyingFor} onChange={e => setApplyingFor(e.target.value)} 
                            className="w-full border rounded px-3 py-2">
                      <option value="">Select Level</option>
                      {admissionLevels.map(lvl => <option key={lvl.id} value={lvl.title}>{lvl.title}</option>)}
                    </select>
                    {errors.applyingFor && <div className="text-red-600 text-sm mt-1">{errors.applyingFor}</div>}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">Previous School (if any)</label>
                    <input value={previousSchool} onChange={e => setPreviousSchool(e.target.value)} 
                           className="w-full border rounded px-3 py-2" placeholder="Name of previous school" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Parent/Guardian Name *</label>
                    <input value={parentName} onChange={e => setParentName(e.target.value)} 
                           className="w-full border rounded px-3 py-2" placeholder="Full name" />
                    {errors.parentName && <div className="text-red-600 text-sm mt-1">{errors.parentName}</div>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Parent Phone *</label>
                    <input value={parentPhone} onChange={e => setParentPhone(e.target.value)} 
                           className="w-full border rounded px-3 py-2" placeholder="+977 9800000000" />
                    {errors.parentPhone && <div className="text-red-600 text-sm mt-1">{errors.parentPhone}</div>}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">Parent Email *</label>
                    <input type="email" value={parentEmail} onChange={e => setParentEmail(e.target.value)} 
                           className="w-full border rounded px-3 py-2" placeholder="email@example.com" />
                    {errors.parentEmail && <div className="text-red-600 text-sm mt-1">{errors.parentEmail}</div>}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">Address *</label>
                    <textarea value={address} onChange={e => setAddress(e.target.value)} 
                              className="w-full border rounded px-3 py-2 h-20" 
                              placeholder="Ward No., Village/Town, District"></textarea>
                    {errors.address && <div className="text-red-600 text-sm mt-1">{errors.address}</div>}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">Upload Documents (Birth certificate, marksheet, photos)</label>
                    <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" 
                           onChange={e => setDocuments(Array.from(e.target.files || []))}
                           className="w-full border rounded px-3 py-2" />
                    {documents.length > 0 && (
                      <div className="text-sm text-gray-600 mt-2">
                        {documents.length} file(s) selected
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-3 justify-end pt-4 border-t">
                  <button type="button" onClick={() => { setShowForm(false); resetForm(); }} 
                          className="cursor-pointer px-6 py-2 border rounded hover:bg-gray-100">
                    Cancel
                  </button>
                  <button type="submit" disabled={submitting} 
                          className="cursor-pointer px-6 py-2 bg-[#035CB0] text-white rounded hover:bg-blue-700 disabled:opacity-50">
                    {submitting ? 'Submitting...' : 'Submit Application'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
