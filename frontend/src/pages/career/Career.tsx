import React from 'react';
import Footer from '../../layouts/Footer'
import Header from '../../layouts/Header'
import { careerService } from '../../api/services';
import type { CareerPosition } from '../../api/types';
import { SERVER_URL } from '../../api/config';

export default function Career() {
  const [positions, setPositions] = React.useState<CareerPosition[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [selected, setSelected] = React.useState<CareerPosition | null>(null);
  const [viewing, setViewing] = React.useState<CareerPosition | null>(null);
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [cover, setCover] = React.useState('');
  const [resume, setResume] = React.useState<File | null>(null);
  const [submitting, setSubmitting] = React.useState(false);
  const [success, setSuccess] = React.useState<string | null>(null);
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  // Fetch active positions on mount
  React.useEffect(() => {
    fetchPositions();
  }, []);

  const fetchPositions = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await careerService.getActivePositions();
      if (response.data) {
        setPositions(response.data);
      }
    } catch (err) {
      console.error('Error fetching career positions:', err);
      setError('Failed to load career positions. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setName(''); setEmail(''); setPhone(''); setCover(''); setResume(null); setErrors({});
  }

  const validate = () => {
    const e: Record<string, string> = {};
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

    if (!selected) return;

    setSubmitting(true);
    setSuccess(null);

    try {
      const formData = new FormData();
      formData.append('positionId', selected.id.toString());
      formData.append('applicantName', name.trim());
      formData.append('email', email.trim());
      formData.append('phone', phone.trim());
      if (cover.trim()) {
        formData.append('coverLetter', cover.trim());
      }
      if (resume) {
        formData.append('resume', resume);
      }

      const response = await careerService.submitApplication(formData);

      if (response.message) {
        setSuccess(response.message);
      } else {
        setSuccess('Application submitted successfully. We will contact you if you are shortlisted.');
      }

      resetForm();

      // Close modal after 2 seconds
      setTimeout(() => {
        setSelected(null);
        setSuccess(null);
      }, 2000);

    } catch (error: any) {
      console.error('Error submitting application:', error);
      setErrors({ submit: error.response?.data?.message || 'Failed to submit application. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="about-top w-full h-[200px] bg-[#035CB0] flex items-center justify-start max-sm:justify-center px-12" style={{ backgroundImage: 'url(/img/running-shield-blur.jpg)', backgroundSize: 'cover', color: 'yellow', backgroundPosition: 'center', opacity: 0.9 }}>
        <h1 className="text-5xl font-medium text-center my-8 text-white">Career</h1>
      </div>
      {/* Intro modal shown on first open (can skip permanently) */}
      {/* {showIntro && (
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
      )} */}
      <main className="container mx-auto px-4 sm:px-12 py-8">
        <p className="text-gray-700 mb-6">We occasionally have vacancies for teaching and non-teaching roles. Below are current openings — click a position to view details and apply online.</p>

        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#035CB0]"></div>
            <p className="mt-4 text-gray-600">Loading positions...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {!loading && !error && positions.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No job openings available at the moment. Please check back later.</p>
          </div>
        )}

        {!loading && !error && positions.length > 0 && (
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
                      <div className="text-sm text-gray-500">
                        Posted: {new Date(pos.postedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </div>
                    </div>
                    <p className="mt-3 text-gray-600 line-clamp-3">{pos.description}</p>
                    {pos.applicationDeadline && (
                      <div className="mt-2 text-sm text-red-600">
                        Application Deadline: {new Date(pos.applicationDeadline).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </div>
                    )}
                    <div className="mt-4 flex gap-2">
                      <button className="px-4 py-2 bg-[#035CB0] text-white rounded cursor-pointer hover:bg-blue-700" onClick={() => setSelected(pos)}>Apply</button>
                      <button className="px-4 py-2 border rounded hover:bg-gray-100" onClick={() => setViewing(pos)}>View Details</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <aside className="bg-white rounded shadow p-4 h-fit">
              <h4 className="font-semibold mb-3">How to Apply</h4>
              <ol className="list-decimal pl-5 text-gray-700">
                <li>Choose the position you want to apply for.</li>
                <li>Fill the application form and upload your resume.</li>
                <li>Successful applicants will be contacted via email or phone.</li>
              </ol>

              <div className="mt-4">
                <h5 className="font-semibold">Contact HR</h5>
                <div className="text-sm text-gray-600">Email: jankalyanbasicscl2056@gmail.com</div>
                <div className="text-sm text-gray-600">Phone: +977 9844929502</div>
              </div>
            </aside>
          </div>
        )}

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
                  <button onClick={() => setViewing(null)} className="px-3 py-1 border rounded hover:bg-gray-100">Close</button>
                  <button onClick={() => { setSelected(viewing); setViewing(null); }} className="px-3 py-1 bg-[#035CB0] text-white rounded hover:bg-blue-700">Apply</button>
                </div>
              </div>

              <div className="mt-4">
                <h4 className="font-semibold mb-2">Description</h4>
                <div className="text-gray-700 whitespace-pre-line">{viewing.description}</div>
              </div>

              {viewing.requirements && (
                <div className="mt-4">
                  <h4 className="font-semibold mb-2">Requirements</h4>
                  <div className="text-gray-700 whitespace-pre-line">{viewing.requirements}</div>
                </div>
              )}

              {viewing.responsibilities && (
                <div className="mt-4">
                  <h4 className="font-semibold mb-2">Responsibilities</h4>
                  <div className="text-gray-700 whitespace-pre-line">{viewing.responsibilities}</div>
                </div>
              )}

              {viewing.salaryRange && (
                <div className="mt-4">
                  <h4 className="font-semibold mb-2">Salary Range</h4>
                  <div className="text-gray-700">{viewing.salaryRange}</div>
                </div>
              )}

              <div className="mt-4 flex gap-4">
                <div>
                  <span className="font-semibold">Vacancies:</span> {viewing.vacancies}
                </div>
                {viewing.applicationDeadline && (
                  <div>
                    <span className="font-semibold">Deadline:</span> {new Date(viewing.applicationDeadline).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </div>
                )}
              </div>

              {viewing.noticeFileUrl && (
                <div className="mt-4">
                  <h4 className="font-semibold mb-2">Notice/Attachment</h4>
                  {/(\.jpg|\.jpeg|\.png|\.gif|\.webp)$/i.test(viewing.noticeFileName || '') ? (
                    <img src={`${SERVER_URL}${viewing.noticeFileUrl}`} alt={viewing.noticeFileName} className="w-full rounded border" />
                  ) : /\.pdf$/i.test(viewing.noticeFileName || '') ? (
                    <div>
                      <a href={`${SERVER_URL}${viewing.noticeFileUrl}`} target="_blank" rel="noreferrer" className="text-[#035CB0] underline hover:text-blue-700">Open PDF Notice ({viewing.noticeFileName})</a>
                      <iframe src={`${SERVER_URL}${viewing.noticeFileUrl}`} className="w-full h-96 mt-2 border rounded" title="notice-pdf" />
                    </div>
                  ) : (
                    <a href={`${SERVER_URL}${viewing.noticeFileUrl}`} target="_blank" rel="noreferrer" className="text-[#035CB0] underline hover:text-blue-700">Open Attachment ({viewing.noticeFileName})</a>
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
                {errors.submit && (
                  <div className="md:col-span-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                    {errors.submit}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium">Full Name</label>
                  <input value={name} onChange={e => setName(e.target.value)} className="w-full border rounded px-3 py-2" />
                  {errors.name && <div className="text-red-600 text-sm mt-1">{errors.name}</div>}
                </div>

                <div>
                  <label className="block text-sm font-medium">Email</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full border rounded px-3 py-2" />
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
                  <label className="block text-sm font-medium">Cover Letter (Optional)</label>
                  <textarea value={cover} onChange={e => setCover(e.target.value)} className="w-full border rounded px-3 py-2 h-28" placeholder="Tell us why you're a good fit for this position..." />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium">Resume (PDF/DOC/DOCX) *</label>
                  <input type="file" accept=".pdf,.doc,.docx" onChange={e => setResume(e.target.files?.[0] ?? null)} className="w-full cursor-pointer hover:text-yellow-400" />
                  {errors.resume && <div className="text-red-600 text-sm mt-1">{errors.resume}</div>}
                  {resume && <div className="text-sm text-gray-600 mt-2">Selected: {resume.name}</div>}
                </div>

                <div className="md:col-span-2 flex items-center justify-between">
                  {success && <div className="text-sm text-green-600 font-medium">{success}</div>}
                  <div className="flex gap-2 ml-auto">
                    <button type="button" onClick={() => { setSelected(null); resetForm(); }} className="px-4 py-2 border rounded hover:bg-gray-100">Cancel</button>
                    <button type="submit" disabled={submitting} className="px-4 py-2 bg-[#035CB0] text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">{submitting ? 'Submitting...' : 'Submit Application'}</button>
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