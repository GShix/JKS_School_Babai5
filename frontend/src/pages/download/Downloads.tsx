import React from 'react';
import Footer from '../../layouts/Footer'
import Header from '../../layouts/Header'

type Resource = {
  id: string;
  title: string;
  category: string;
  type: 'pdf' | 'image' | 'doc' | 'zip' | 'other';
  size?: string;
  url: string;
  date?: string;
}

const sampleResources: Resource[] = [
  { id: 'r1', title: 'Class XI - English Notes', category: 'Notes', type: 'pdf', size: '1.2 MB', url: '/files/class11-english-notes.pdf', date: '2024-06-10' },
  { id: 'r2', title: 'Mathematics Question Paper - 2079', category: 'Question Papers', type: 'pdf', size: '850 KB', url: '/files/math-2079.pdf', date: '2023-03-22' },
  { id: 'r3', title: 'School Admission Form (2025)', category: 'Forms', type: 'doc', size: '320 KB', url: '/files/admission-form-2025.docx', date: '2025-02-15' },
  { id: 'r4', title: 'Science Practical Solutions', category: 'Solutions', type: 'pdf', size: '2.1 MB', url: '/files/science-solutions.pdf', date: '2024-11-01' },
  { id: 'r5', title: 'Event Poster (PNG)', category: 'Images', type: 'image', size: '450 KB', url: '/img/event3.jpg', date: '2025-01-10' },
  { id: 'r6', title: 'Previous Year Papers (ZIP)', category: 'Question Papers', type: 'zip', size: '12 MB', url: '/files/previous-papers.zip', date: '2022-08-30' },
  { id: 'r7', title: 'Nepali Notes', category: 'Notes', type: 'pdf', size: '900 KB', url: '/files/nepali-notes.pdf', date: '2024-09-03' },
  { id: 'r8', title: 'Practical Exam Schedule', category: 'Forms', type: 'other', size: '50 KB', url: '/files/practical-schedule.txt', date: '2025-03-20' },
];

const Downloads = () => {
  const [query, setQuery] = React.useState('');
  const [typeFilter, setTypeFilter] = React.useState<'all' | Resource['type']>('all');
  const [categoryFilter, setCategoryFilter] = React.useState<'All' | string>('All');

  const categories = React.useMemo(() => {
    const cats = new Set(sampleResources.map(r => r.category));
    return ['All', ...Array.from(cats)];
  }, []);

  const types: (Resource['type'] | 'all')[] = ['all', 'pdf', 'image', 'doc', 'zip', 'other'];

  const filtered = React.useMemo(() => {
    return sampleResources.filter(r => {
      if (typeFilter !== 'all' && r.type !== typeFilter) return false;
      if (categoryFilter !== 'All' && r.category !== categoryFilter) return false;
      if (query.trim() && !r.title.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });
  }, [query, typeFilter, categoryFilter]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
            <div className="about-top w-full h-[300px] bg-[#035CB0] flex items-center justify-start max-sm:justify-center px-12" style={{backgroundImage: 'url(/img/running-shield-blur.jpg)', backgroundSize: 'cover', color: 'yellow', backgroundPosition: 'center', opacity:0.9}}>
              <h1 className="text-5xl font-medium text-center my-8 text-white">Downloads</h1>
            </div>
      <main className="container mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Main column */}
          <div className="flex-1">
            {/* <h1 className="text-2xl font-bold text-[#035CB0] mb-2">Downloads</h1> */}
            <p className="text-gray-600 mb-6">Find notes, PDFs, forms, images, question papers and solutions. Click the download button to save a copy.</p>

            {/* Filters */}
            <div className="bg-white p-4 rounded-md shadow-sm mb-6">
              <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
                <div className="flex gap-2 items-center">
                  <input
                    aria-label="Search resource"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    className="border rounded px-3 py-2 w-64"
                    placeholder="Search by title..."
                  />

                  <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="border rounded px-3 py-2">
                    {categories.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {types.map(t => (
                    <button
                      key={t}
                      onClick={() => setTypeFilter(t as any)}
                      className={`px-3 py-1 rounded ${typeFilter === t ? 'bg-[#035CB0] text-white' : 'bg-gray-100 text-gray-700'}`}
                    >
                      {t === 'all' ? 'All' : t.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Results grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map(r => (
                <div key={r.id} className="bg-white rounded shadow-sm p-4 flex flex-col">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded">
                      {/* simple file-type icon */}
                      {r.type === 'pdf' && <span className="text-red-600 font-bold">PDF</span>}
                      {r.type === 'image' && <span className="text-green-600">IMG</span>}
                      {r.type === 'doc' && <span className="text-blue-600">DOC</span>}
                      {r.type === 'zip' && <span className="text-yellow-600">ZIP</span>}
                      {r.type === 'other' && <span className="text-gray-600">FILE</span>}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">{r.title}</h3>
                      <div className="text-sm text-gray-500">{r.category} • {r.size} • {r.date}</div>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <a href={r.url} download className="inline-flex items-center gap-2 px-3 py-2 bg-[#035CB0] text-white rounded">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 14a1 1 0 011-1h3v2H5v1h10v-1h-2v-2h3a1 1 0 011 1v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-2z" clipRule="evenodd"/><path d="M7 9a1 1 0 012 0v3h2V9a1 1 0 112 0v3h1a1 1 0 010 2h-8a1 1 0 010-2h1V9z"/></svg>
                      Download
                    </a>
                    <a href={r.url} target="_blank" rel="noreferrer" className="text-sm text-gray-500 hover:underline">Preview</a>
                  </div>
                </div>
              ))}

              {filtered.length === 0 && (
                <div className="col-span-full bg-white p-6 rounded text-center text-gray-600">No resources found. Try changing filters or search terms.</div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="w-full md:w-80">
            <div className="bg-white rounded shadow-sm p-4 mb-4">
              <h4 className="font-semibold mb-2">Recent Uploads</h4>
              <ul className="space-y-3 text-sm text-gray-700">
                {sampleResources.slice(0,5).map(r => (
                  <li key={r.id} className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{r.title}</div>
                      <div className="text-xs text-gray-500">{r.date} • {r.size}</div>
                    </div>
                    <a href={r.url} download className="text-sm text-[#035CB0]">Download</a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded shadow-sm p-4">
              <h4 className="font-semibold mb-2">Categories</h4>
              <ul className="space-y-2 text-gray-700">
                {Array.from(new Set(sampleResources.map(r => r.category))).map(cat => (
                  <li key={cat}>
                    <button onClick={() => setCategoryFilter(cat)} className="text-left w-full hover:underline">{cat}</button>
                  </li>
                ))}
                <li>
                  <button onClick={() => setCategoryFilter('All')} className="text-left w-full hover:underline">Show All</button>
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Downloads