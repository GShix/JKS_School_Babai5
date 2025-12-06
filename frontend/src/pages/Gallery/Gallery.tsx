
import React from 'react';
import Header from '../../layouts/Header'
import Footer from '../../layouts/Footer'

type ImageItem = {
  id: string;
  title: string;
  category: string;
  src: string;
  date?: string;
}

const sampleImages: ImageItem[] = [
  { id: 'g1', title: 'Science Tour 2024', category: 'Tours', src: '/img/event1.jpg', date: '2024-05-12' },
  { id: 'g2', title: 'Annual Program - Stage', category: 'Programs', src: '/img/event2.jpg', date: '2024-03-10' },
  { id: 'g3', title: 'Friday Activity: Sports', category: 'Friday Programs', src: '/img/event3.jpg', date: '2024-07-21' },
  { id: 'g4', title: 'Classroom Learning', category: 'Academics', src: '/img/classroom.svg', date: '2024-01-18' },
  { id: 'g5', title: 'Library Session', category: 'Academics', src: '/img/event4.jpg', date: '2024-02-02' },
  { id: 'g6', title: 'Field Visit - Agriculture', category: 'Tours', src: '/img/event3.jpg', date: '2024-04-15' },
  { id: 'g7', title: 'Cultural Program', category: 'Programs', src: '/img/event1.jpg', date: '2023-12-05' },
  { id: 'g8', title: 'Student Awards', category: 'Programs', src: '/img/event4.jpg', date: '2024-11-11' },
]

const Gallery = () => {
  const [query, setQuery] = React.useState('');
  const [category, setCategory] = React.useState<'All' | string>('All');
  const [lightbox, setLightbox] = React.useState<ImageItem | null>(null);

  const categories = React.useMemo(() => ['All', ...Array.from(new Set(sampleImages.map(i => i.category)))], []);

  const filtered = React.useMemo(() => {
    return sampleImages.filter(i => {
      if (category !== 'All' && i.category !== category) return false;
      if (query.trim() && !i.title.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    })
  }, [query, category]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="about-top w-full h-[300px] bg-[#035CB0] flex items-center justify-start max-sm:justify-center px-12" style={{backgroundImage: 'url(/img/running-shield-blur.jpg)', backgroundSize: 'cover', color: 'yellow', backgroundPosition: 'center', opacity:0.9}}>
        <h1 className="text-5xl font-medium text-center my-8 text-white">Gallery</h1>
      </div>
      <main className="container mx-auto px-6 py-8">
        {/* <h1 className="text-2xl font-bold text-[#035CB0] mb-2">Gallery</h1> */}
        <p className="text-gray-600 mb-6">Browse photos from tours, programs, Friday activities, academics and more. Click an image to preview.</p>

        <div className="bg-white p-4 rounded-md shadow mb-6">
          <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
            <div className="flex items-center gap-2">
              <input value={query} onChange={e => setQuery(e.target.value)} className="border px-3 py-2 rounded w-64" placeholder="Search images by title..." />
              <select value={category} onChange={e => setCategory(e.target.value)} className="border px-3 py-2 rounded">
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="text-sm text-gray-600">Showing {filtered.length} of {sampleImages.length}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map(img => (
            <div key={img.id} className="bg-white rounded shadow-sm overflow-hidden">
              <button onClick={() => setLightbox(img)} className="w-full h-48 overflow-hidden block">
                <img src={img.src} alt={img.title} className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-200" />
              </button>
              <div className="p-3">
                <div className="font-semibold text-sm">{img.title}</div>
                <div className="text-xs text-gray-500">{img.category} • {img.date}</div>
              </div>
            </div>
          ))}
        </div>

        {lightbox && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={() => setLightbox(null)}>
            <div className="max-w-3xl w-full bg-white rounded overflow-hidden" onClick={e => e.stopPropagation()}>
              <div className="p-3 flex items-center justify-between">
                <div className="font-semibold">{lightbox.title}</div>
                <button onClick={() => setLightbox(null)} className="px-3 py-1 bg-gray-100 rounded">Close</button>
              </div>
              <img src={lightbox.src} alt={lightbox.title} className="w-full h-[60vh] object-contain bg-black" />
              <div className="p-3 text-sm text-gray-600">Category: {lightbox.category} • Date: {lightbox.date}</div>
            </div>
          </div>
        )}

      </main>
      <Footer />
    </div>
  )
}

export default Gallery