import React from 'react'
import Footer from '../../layouts/Footer'
import Header from '../../layouts/Header'

type Notice = {
    id: string
    title: string
    content: string
    category: string
    date: string // ISO
    fileName?: string
    fileUrl?: string
}

export const initialNotices: Notice[] = [
    {
        id: 'n1',
        title: 'Admission Open for Grade 11',
        content: 'We are pleased to announce that admission is open for Grade 11 for the academic year 2082. Interested students should submit the form before the deadline.',
        category: 'Admission',
        date: '2025-11-01',
        fileName: 'admission-form.pdf',
        fileUrl: '/files/admission-form.pdf'
    },
    {
        id: 'n2',
        title: 'Parents Meeting on Dec 20',
        content: 'Parents are requested to attend the meeting for the upcoming semester. Topics include curriculum and activities.',
        category: 'General',
        date: '2025-12-01'
    },
    {
        id: 'n3',
        title: 'School Closed on Tihar',
        content: 'The school will remain closed on account of Tihar holidays from Dec 15 to Dec 19.',
        category: 'Holiday',
        date: '2025-12-10'
    }
]

export default function Notices() {
    const [notices, setNotices] = React.useState<Notice[]>(() => {
        // sort descending by date
        return [...initialNotices].sort((a,b) => +new Date(b.date) - +new Date(a.date))
    })

    const [query, setQuery] = React.useState('')
    const [category, setCategory] = React.useState('All')
    const [selected, setSelected] = React.useState<Notice | null>(null)

    // Admin UI: only enable when admin is logged in
    const [isAdmin, setIsAdmin] = React.useState<boolean>(() => {
        try { return localStorage.getItem('isAdmin') === '1' } catch(e) { return false }
    })
    const [showAdd, setShowAdd] = React.useState(false)

    React.useEffect(() => {
        const onStorage = (ev: StorageEvent) => {
            if (ev.key === 'isAdmin') {
                setIsAdmin(ev.newValue === '1')
            }
        }
        window.addEventListener('storage', onStorage)
        return () => window.removeEventListener('storage', onStorage)
    }, [])

    // Add form state
    const [title, setTitle] = React.useState('')
    const [content, setContent] = React.useState('')
    const [cat, setCat] = React.useState('General')
    const [date, setDate] = React.useState<string>(new Date().toISOString().slice(0,10))
    const [file, setFile] = React.useState<File | null>(null)
    const [errors, setErrors] = React.useState<Record<string,string>>({})

    const categories = React.useMemo(() => ['All','Admission','General','Holiday','Exam','Notice'], [])

    const filtered = React.useMemo(() => {
        return notices.filter(n => {
            if (category !== 'All' && n.category !== category) return false
            if (!query) return true
            const q = query.toLowerCase()
            return n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q)
        })
    }, [notices, query, category])

    const resetAddForm = () => { setTitle(''); setContent(''); setCat('General'); setDate(new Date().toISOString().slice(0,10)); setFile(null); setErrors({}) }

    const validateAdd = () => {
        const e: Record<string,string> = {}
        if (!title.trim()) e.title = 'Title is required'
        if (!content.trim()) e.content = 'Content is required'
        return e
    }

    const handleAdd = (ev?: React.FormEvent) => {
        ev?.preventDefault()
        const v = validateAdd()
        setErrors(v)
        if (Object.keys(v).length) return

        const id = 'n' + (Date.now())
        // If a file is attached, create a blob URL for demo purposes
        const fileName = file?.name
        const fileUrl = file ? URL.createObjectURL(file) : undefined

        const newNotice: Notice = { id, title: title.trim(), content: content.trim(), category: cat, date, fileName, fileUrl }
        setNotices(prev => [newNotice, ...prev])
        resetAddForm()
        setShowAdd(false)
    }

    const handleDownload = (n: Notice) => {
        if (!n.fileUrl) return
        const a = document.createElement('a')
        a.href = n.fileUrl
        a.download = n.fileName || 'notice-file'
        document.body.appendChild(a)
        a.click()
        a.remove()
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
                <div className="about-top w-full h-[300px] bg-[#035CB0] flex items-center justify-start max-sm:justify-center px-12" style={{backgroundImage: 'url(/img/running-shield-blur.jpg)', backgroundSize: 'cover', color: 'yellow', backgroundPosition: 'center', opacity:0.9}}>
                <h1 className="text-5xl font-medium text-center my-8 text-white">Notices</h1>
            </div>
            <main className="container mx-auto px-4 sm:px-8 py-8">
                <div className="sm:flex items-center justify-between mb-6">
                    <div>
                        {/* <h1 className="text-2xl font-bold text-[#035CB0]">Notices</h1> */}
                        <p className="text-gray-600">Latest announcements and circulars from the school administration.</p>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 max-sm:flex-wrap max-sm:mt-2 bg-white p-2">
                        <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search notices..." className="border px-3 py-2 rounded w-50 sm:w-64" />
                        <select value={category} onChange={e => setCategory(e.target.value)} className="border px-3 py-2 max-sm:w-20 rounded">
                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <button onClick={() => { setQuery(''); setCategory('All') }} className="px-3 py-2 border rounded">Clear</button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <section className="lg:col-span-2 space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold">All Notices</h2>
                            <div className="flex items-center gap-2">
                                {isAdmin ? (
                                    <>
                                    <span className="text-sm text-green-600">Admin</span>
                                    <button onClick={() => setShowAdd(s => !s)} className="px-3 py-1 bg-[#035CB0] text-white rounded text-sm">{showAdd ? 'Close' : 'Add Notice'}</button>
                                    </>
                                ) : (
                                    <a href="/admin/login" className="px-3 py-1 text-sm text-[#035CB0] underline">Admin Login</a>
                                )}
                            </div>
                        </div>

                        {showAdd && isAdmin && (
                            <form onSubmit={handleAdd} className="bg-white p-4 rounded shadow space-y-3">
                                <div>
                                    <label className="block text-sm font-medium">Title</label>
                                    <input value={title} onChange={e => setTitle(e.target.value)} className="w-full border rounded px-3 py-2" />
                                    {errors.title && <div className="text-red-600 text-sm">{errors.title}</div>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium">Content</label>
                                    <textarea value={content} onChange={e => setContent(e.target.value)} className="w-full border rounded px-3 py-2 h-28" />
                                    {errors.content && <div className="text-red-600 text-sm">{errors.content}</div>}
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                    <select value={cat} onChange={e => setCat(e.target.value)} className="border px-3 py-2 rounded">
                                        {categories.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                    <input type="date" value={date} onChange={e => setDate(e.target.value)} className="border px-3 py-2 rounded" />
                                    <input type="file" accept=".pdf,.doc,.docx,.jpg,.png" onChange={e => setFile(e.target.files?.[0] ?? null)} className="border px-3 py-2 rounded" />
                                </div>
                                <div className="flex gap-2 justify-end">
                                    <button type="button" onClick={() => { setShowAdd(false); resetAddForm() }} className="px-3 py-2 border rounded">Cancel</button>
                                    <button type="submit" className="px-3 py-2 bg-[#035CB0] text-white rounded">Publish</button>
                                </div>
                            </form>
                        )}

                        <div className="space-y-3">
                            {filtered.length === 0 && <div className="text-gray-600">No notices found.</div>}
                            {filtered.map(n => (
                                <article key={n.id} className="bg-white p-4 rounded shadow">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="text-lg font-semibold text-[#035CB0]">{n.title}</h3>
                                            <div className="text-sm text-gray-500">{n.category} • {new Date(n.date).toLocaleDateString()}</div>
                                        </div>
                                        <div className="flex gap-2">
                                            {n.fileUrl && <button onClick={() => handleDownload(n)} className="px-3 py-1 border rounded text-sm">Download</button>}
                                            <button onClick={() => setSelected(n)} className="px-3 py-1 bg-[#035CB0] text-white rounded text-sm">View</button>
                                        </div>
                                    </div>
                                    <p className="mt-3 text-gray-700 line-clamp-3">{n.content}</p>
                                </article>
                            ))}
                        </div>
                    </section>

                    <aside className="space-y-4">
                        <div className="bg-white p-4 rounded shadow">
                            <h4 className="font-semibold mb-2">Latest Notices</h4>
                            <ul className="space-y-2 text-sm">
                                {notices.slice(0,6).map(n => (
                                    <li key={n.id}>
                                        <a onClick={() => setSelected(n)} className="cursor-pointer hover:text-[#035CB0]">{n.title}</a>
                                        <div className="text-xs text-gray-500">{new Date(n.date).toLocaleDateString()}</div>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="bg-white p-4 rounded shadow">
                            <h4 className="font-semibold mb-2">Categories</h4>
                            <div className="flex flex-wrap gap-2">
                                {categories.filter(c => c !== 'All').map(c => (
                                    <button key={c} onClick={() => setCategory(c)} className={`px-2 py-1 text-sm border rounded ${category===c ? 'bg-[#035CB0] text-white' : ''}`}>{c}</button>
                                ))}
                            </div>
                        </div>
                    </aside>
                </div>

                {/* Modal / Viewer */}
                {selected && (
                    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-40">
                        <div className="bg-white w-11/12 md:w-3/4 lg:w-1/2 p-6 rounded shadow-lg max-h-[90vh] overflow-auto">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="text-xl font-semibold">{selected.title}</h3>
                                    <div className="text-sm text-gray-500">{selected.category} • {new Date(selected.date).toLocaleDateString()}</div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {selected.fileUrl && <button onClick={() => handleDownload(selected)} className="px-3 py-1 border rounded text-sm">Download</button>}
                                    <button onClick={() => setSelected(null)} className="px-3 py-1 border rounded">Close</button>
                                </div>
                            </div>
                            <div className="mt-4 text-gray-700 whitespace-pre-line">{selected.content}</div>
                        </div>
                    </div>
                )}

            </main>
            <Footer />
        </div>
    )
}