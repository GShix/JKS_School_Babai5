import React from 'react';
import Footer from '../../layouts/Footer'
import Header from '../../layouts/Header'

type Position = {
  id: string;
  title: string;
  department: string;
  type: string; // Full-time / Part-time
  location: string;
  posted: string;
  description: string;
  // optional notice file uploaded by admin (pdf/image)
  noticeFileName?: string;
  noticeFileUrl?: string;
}

const positions: Position[] = [
  {
    id: 'p1',
    title: 'Mathematics Teacher',
    department: 'Academics',
    type: 'Full-time',
    location: 'Padampur, Dang',
    posted: '2025-11-20',
    description: 'Teach Mathematics for Classes XI-XII, prepare lesson plans and evaluate students.'
  },
  {
    id: 'p2',
    title: 'Laboratory Assistant',
    department: 'Science',
    type: 'Part-time',
    location: 'Padampur, Dang',
    posted: '2025-10-01',
    description: 'Maintain science lab equipment and assist during practical sessions.'
  }
]

export default function Career() {
  const [selected, setSelected] = React.useState<Position | null>(null);
  const [viewing, setViewing] = React.useState<Position | null>(null);
  const [showIntro, setShowIntro] = React.useState(false);
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [cover, setCover] = React.useState('');
  const [resume, setResume] = React.useState<File | null>(null);
  const [submitting, setSubmitting] = React.useState(false);
  const [success, setSuccess] = React.useState<string | null>(null);
  const [errors, setErrors] = React.useState<Record<string,string>>({});

  const resetForm = () => {
    setName(''); setEmail(''); setPhone(''); setCover(''); setResume(null); setErrors({});
  }

  React.useEffect(() => {
    try {
      const dismissed = sessionStorage.getItem('careerIntroDismissed')
      if (!dismissed) setShowIntro(true)
    } catch (err) {
      // ignore sessionStorage errors
      setShowIntro(true)
    }
  }, [])

  const validate = () => {
    const e: Record<string,string> = {};
    if (!name.trim()) e.name = 'Name is required';
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) e.email = 'Valid email is required';
    if (!phone.trim() || phone.trim().length < 7) e.phone = 'Valid phone is required';
    if (!resume) e.resume = 'Please attach your resume (PDF/DOC)';
    return e;
  }

  const submitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length > 0) return;
    setSubmitting(true);
    setSuccess(null);

    // Mock upload / submit delay
    await new Promise(r => setTimeout(r, 1200));

    // In a real app you'd send `FormData` to an API here.
    setSubmitting(false);
    setSuccess('Application submitted successfully. We will contact you if you are shortlisted.');
    resetForm();
    setSelected(null);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="about-top w-full h-[300px] bg-[#035CB0] flex items-center justify-start max-sm:justify-center px-12" style={{backgroundImage: 'url(/img/running-shield-blur.jpg)', backgroundSize: 'cover', color: 'yellow', backgroundPosition: 'center', opacity:0.9}}>
        <h1 className="text-5xl font-medium text-center my-8 text-white">Career</h1>
      </div>
      {/* Intro modal shown on first open (can skip permanently) */}
      {showIntro && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white w-11/12 md:w-2/3 lg:w-1/2 p-6 rounded shadow-lg max-h-[80vh] overflow-auto">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-semibold">Current Openings</h2>
                <p className="text-sm text-gray-600">A quick list of available positions. You can view details or skip this popup.</p>
              </div>
              <button className="px-3 py-1 border rounded hover:bg-red-500 hover:text-white cursor-pointer" onClick={() => setShowIntro(false)}>Close</button>
            </div>

            <div className="mt-4 space-y-3">
              {positions.map(p => (
                <div key={p.id} className="p-3 border rounded flex items-start justify-between">
                  <div>
                    <div className="font-semibold">{p.title}</div>
                    <div className="text-sm text-gray-500">{p.department} • {p.type}</div>
                  </div>
                  <div className="flex gap-2">
                    {/* Open a read-only vacancy view (not the apply form) */}
                    <button className="px-3 py-1 bg-[#035CB0] text-white rounded text-sm" onClick={() => { setViewing(p); setShowIntro(false); }}>View</button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <button className="px-3 py-2 border rounded" onClick={() => setShowIntro(false)}>Read</button>
              <button className="px-3 py-2 bg-red-600 text-white rounded" onClick={() => { try { sessionStorage.setItem('careerIntroDismissed','1') } catch(e){} setShowIntro(false) }}>Skip (Don't show again)</button>
            </div>
          </div>
        </div>
      )}
      <main className="container mx-auto px-4 sm:px-12 py-8">
        <h1 className="text-2xl font-bold text-[#035CB0] mb-4">Careers at JKSS</h1>
        <p className="text-gray-700 mb-6">We occasionally have vacancies for teaching and non-teaching roles. Below are current openings — click a position to view details and apply online.</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {positions.map(pos => (
                <div key={pos.id} className="bg-white rounded shadow p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">{pos.title}</h3>
                      <div className="text-sm text-gray-500">{pos.department} • {pos.type} • {pos.location}</div>
                    </div>
                    <div className="text-sm text-gray-500">Posted: {pos.posted}</div>
                  </div>
                  <p className="mt-3 text-gray-600">{pos.description}</p>
                  <div className="mt-4 flex gap-2">
                    <button className="px-4 py-2 bg-[#035CB0] text-white rounded cursor-pointer" onClick={() => setSelected(pos)}>Apply</button>
                    <button className="px-4 py-2 border rounded" onClick={() => navigator.clipboard?.writeText(pos.title)}>Share</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <aside className="bg-white rounded shadow p-4">
            <h4 className="font-semibold mb-3">How to Apply</h4>
            <ol className="list-decimal pl-5 text-gray-700">
              <li>Choose the position you want to apply for.</li>
              <li>Fill the application form and upload your resume.</li>
              <li>Successful applicants will be contacted via email or phone.</li>
            </ol>

            <div className="mt-4">
              <h5 className="font-semibold">Contact HR</h5>
              <div className="text-sm text-gray-600">Email: jksschoolp5@gmail.com</div>
              <div className="text-sm text-gray-600">Phone: +977 9844929502</div>
            </div>
          </aside>
        </div>

        {/* Vacancy viewing modal (read-only) */}
        {viewing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40" onClick={() => setViewing(null)}>
            <div className="bg-white w-11/12 md:w-3/4 lg:w-2/5 p-6 rounded shadow-lg max-h-[90vh] overflow-auto" onClick={e => e.stopPropagation()}>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-semibold mb-1">{viewing.title}</h3>
                  <div className="text-sm text-gray-500">{viewing.department} • {viewing.type} • {viewing.location}</div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setViewing(null)} className="px-3 py-1 border rounded">Close</button>
                  <button onClick={() => { setSelected(viewing); setViewing(null); }} className="px-3 py-1 bg-[#035CB0] text-white rounded">Apply</button>
                </div>
              </div>
              <div className="mt-4 text-gray-700 whitespace-pre-line">{viewing.description}</div>
              {viewing.noticeFileUrl && (
                <div className="mt-4">
                  {/* simple preview: images inline, pdf as link/iframe */}
                  {/(\.jpg|\.jpeg|\.png|\.gif)$/i.test(viewing.noticeFileName || '') ? (
                    <img src={viewing.noticeFileUrl} alt={viewing.noticeFileName} className="w-full rounded" />
                  ) : /\.pdf$/i.test(viewing.noticeFileName || '') ? (
                    <div>
                      <a href={viewing.noticeFileUrl} target="_blank" rel="noreferrer" className="text-[#035CB0] underline">Open PDF Notice</a>
                      <iframe src={viewing.noticeFileUrl} className="w-full h-80 mt-2" title="notice-pdf" />
                    </div>
                  ) : (
                    <a href={viewing.noticeFileUrl} target="_blank" rel="noreferrer" className="text-[#035CB0] underline">Open Attachment</a>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Application form modal (centered) */}
        {selected && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
            onClick={() => { setSelected(null); resetForm(); }}
          >
            <div
              className="bg-white w-11/12 md:w-3/4 lg:w-2/5 p-6 rounded shadow-lg max-h-[90vh] overflow-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-semibold mb-1">Apply for: {selected.title}</h3>
                  <div className="text-sm text-gray-500">{selected.department} • {selected.type} • {selected.location}</div>
                </div>
                <button onClick={() => { setSelected(null); resetForm(); }} className="px-3 py-1 border rounded hover:bg-red-500 hover:text-white cursor-pointer">Close</button>
              </div>

              <form onSubmit={submitApplication} className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium">Full Name</label>
                  <input value={name} onChange={e => setName(e.target.value)} className="w-full border rounded px-3 py-2" />
                  {errors.name && <div className="text-red-600 text-sm mt-1">{errors.name}</div>}
                </div>

                <div>
                  <label className="block text-sm font-medium">Email</label>
                  <input value={email} onChange={e => setEmail(e.target.value)} className="w-full border rounded px-3 py-2" />
                  {errors.email && <div className="text-red-600 text-sm mt-1">{errors.email}</div>}
                </div>

                <div>
                  <label className="block text-sm font-medium">Phone</label>
                  <input value={phone} onChange={e => setPhone(e.target.value)} className="w-full border rounded px-3 py-2" />
                  {errors.phone && <div className="text-red-600 text-sm mt-1">{errors.phone}</div>}
                </div>

                <div>
                  <label className="block text-sm font-medium">Preferred Location</label>
                  <input value={selected.location} disabled className="w-full border rounded px-3 py-2 bg-gray-100" />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium">Cover Letter</label>
                  <textarea value={cover} onChange={e => setCover(e.target.value)} className="w-full border rounded px-3 py-2 h-28" />
                </div>

                <div>
                  <label className="block text-sm font-medium">Resume (PDF/DOC)</label>
                  <input type="file" accept=".pdf,.doc,.docx" onChange={e => setResume(e.target.files?.[0] ?? null)} className="w-full cursor-pointer hover:text-yellow-400" />
                  {errors.resume && <div className="text-red-600 text-sm mt-1">{errors.resume}</div>}
                  {resume && <div className="text-sm text-gray-600 mt-2">Selected: {resume.name}</div>}
                </div>

                <div className="md:col-span-2 flex items-center justify-between">
                  <div className="text-sm text-green-600">{success}</div>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => { setSelected(null); resetForm(); }} className="px-4 py-2 border rounded">Cancel</button>
                    <button type="submit" disabled={submitting} className="px-4 py-2 bg-[#035CB0] text-white rounded">{submitting ? 'Submitting...' : 'Submit Application'}</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}