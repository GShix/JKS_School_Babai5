import React from 'react'
import Footer from '../../layouts/Footer'
import Header from '../../layouts/Header'
import { announcementService } from '../../api/services/announcementService'
import type { Announcement } from '../../api/types'
import { getImageUrl } from '../../utils/imageUtils'

export default function Announcements() {
    const [announcements, setAnnouncements] = React.useState<Announcement[]>([])
    const [loading, setLoading] = React.useState(true)
    const [error, setError] = React.useState<string | null>(null)

    const [query, setQuery] = React.useState('')
    const [category, setCategory] = React.useState('All')
    const [selected, setSelected] = React.useState<Announcement | null>(null)

    const categories = React.useMemo(() => ['All','students','staff','parents','all'], [])

    // Fetch announcements on mount
    React.useEffect(() => {
        fetchAnnouncements()
    }, [])

    const fetchAnnouncements = async () => {
        try {
            setLoading(true)
            setError(null)
            const response = await announcementService.getAll()
            
            if (response.data) {
                // Sort by date descending
                const sorted = response.data.sort((a, b) => {
                    const dateA = new Date(a.createdAt || a.startDate || 0).getTime()
                    const dateB = new Date(b.createdAt || b.startDate || 0).getTime()
                    return dateB - dateA
                })
                setAnnouncements(sorted)
            }
        } catch (err: any) {
            console.error('Error fetching announcements:', err)
            setError(err.response?.data?.message || err.message || 'Failed to load announcements')
        } finally {
            setLoading(false)
        }
    }

    const filtered = React.useMemo(() => {
        return announcements.filter(a => {
            if (category !== 'All' && a.targetAudience !== category) return false
            if (!query) return true
            const q = query.toLowerCase()
            return a.title.toLowerCase().includes(q) || a.content.toLowerCase().includes(q)
        })
    }, [announcements, query, category])

    const handleDownload = (fileUrl: string, fileName: string) => {
        const link = document.createElement('a')
        link.href = getImageUrl(fileUrl)
        link.download = fileName
        link.target = '_blank'
        document.body.appendChild(link)
        link.click()
        link.remove()
    }

    const formatDate = (dateStr?: string) => {
        if (!dateStr) return 'N/A'
        return new Date(dateStr).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
    }

    const getPriorityBadge = (priority?: string) => {
        const p = priority || 'medium'
        const colors: Record<string, string> = {
            low: 'bg-gray-100 text-gray-700',
            medium: 'bg-blue-100 text-blue-700',
            high: 'bg-orange-100 text-orange-700',
            urgent: 'bg-red-100 text-red-700'
        }
        return (
            <span className={`px-2 py-1 text-xs font-semibold rounded ${colors[p] || colors.medium}`}>
                {p.toUpperCase()}
            </span>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
                <div className="about-top w-full h-[200px] bg-[#035CB0] flex items-center justify-start max-sm:justify-center px-12" style={{backgroundImage: 'url(/img/running-shield-blur.jpg)', backgroundSize: 'cover', color: 'yellow', backgroundPosition: 'center', opacity:0.9}}>
                <h1 className="text-4xl sm:text-5xl font-medium text-center my-8 text-white">Announcements</h1>
            </div>
            <main className="container mx-auto px-4 sm:px-8 py-8">
                <div className="sm:flex items-center justify-between mb-6">
                    <div>
                        {/* <h1 className="text-2xl font-bold text-[#035CB0]">Announcements</h1> */}
                        <p className="text-gray-600">Latest announcements and circulars from the school administration.</p>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 max-sm:flex-wrap max-sm:mt-2 bg-white p-2">
                        <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search announcements..." className="border px-3 py-2 rounded w-50 sm:w-64" />
                        <select value={category} onChange={e => setCategory(e.target.value)} className="border px-3 py-2 max-sm:w-20 rounded">
                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <button onClick={() => { setQuery(''); setCategory('All') }} className="px-3 py-2 border rounded">Clear</button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <section className="lg:col-span-2 space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold">All Announcements ({filtered.length})</h2>
                        </div>

                        {/* Loading State */}
                        {loading && (
                            <div className="flex items-center justify-center py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#035CB0] border-t-transparent"></div>
                                <span className="ml-3 text-gray-600">Loading announcements...</span>
                            </div>
                        )}

                        {/* Error State */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded p-4 text-red-700">
                                <strong>Error:</strong> {error}
                                <button onClick={fetchAnnouncements} className="ml-4 px-3 py-1 bg-red-600 text-white rounded text-sm">Retry</button>
                            </div>
                        )}

                        {/* Announcements List */}
                        {!loading && !error && (
                            <div className="space-y-3">
                                {filtered.length === 0 && <div className="text-gray-600 text-center py-8">No announcements found.</div>}
                                {filtered.map(a => (
                                    <article key={a.id} className="bg-white p-4 rounded shadow hover:shadow-lg transition">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    {a.isPinned && <span className="text-orange-500">📌</span>}
                                                    {getPriorityBadge(a.priority)}
                                                </div>
                                                <h3 className="text-lg font-semibold text-[#035CB0]">{a.title}</h3>
                                                <div className="text-sm text-gray-500">
                                                    {a.targetAudience?.toUpperCase() || 'ALL'} • {formatDate(a.startDate || a.createdAt)}
                                                    {a.endDate && ` - Valid until ${formatDate(a.endDate)}`}
                                                </div>
                                            </div>
                                            <div className="flex gap-2 flex-shrink-0">
                                                <button onClick={() => setSelected(a)} className="px-3 py-1 bg-[#035CB0] text-white rounded text-sm hover:bg-[#024a8f]">View</button>
                                            </div>
                                        </div>
                                        <p className="mt-3 text-gray-700 line-clamp-3">{a.content}</p>
                                        {a.attachments && a.attachments.length > 0 && (
                                            <div className="mt-2 flex items-center gap-2 text-sm text-blue-600">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                                                </svg>
                                                {a.attachments.length} attachment{a.attachments.length > 1 ? 's' : ''}
                                            </div>
                                        )}
                                    </article>
                                ))}
                            </div>
                        )}
                    </section>

                    <aside className="space-y-4">
                        <div className="bg-white p-4 rounded shadow">
                            <h4 className="font-semibold mb-2">Latest Announcements</h4>
                            <ul className="space-y-2 text-sm">
                                {announcements.slice(0,6).map(a => (
                                    <li key={a.id}>
                                        <a onClick={() => setSelected(a)} className="cursor-pointer hover:text-[#035CB0] font-medium">{a.title}</a>
                                        <div className="text-xs text-gray-500">{formatDate(a.startDate || a.createdAt)}</div>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="bg-white p-4 rounded shadow">
                            <h4 className="font-semibold mb-2">Target Audience</h4>
                            <div className="flex flex-wrap gap-2">
                                {categories.map(c => (
                                    <button 
                                        key={c} 
                                        onClick={() => setCategory(c)} 
                                        className={`px-3 py-1.5 text-sm border rounded capitalize ${category===c ? 'bg-[#035CB0] text-white' : 'hover:border-[#035CB0]'}`}
                                    >
                                        {c}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </aside>
                </div>

                {/* Modal / Viewer */}
                {selected && (
                    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
                        <div className="bg-white w-11/12 md:w-3/4 lg:w-1/2 p-6 rounded-xl shadow-2xl max-h-[90vh] overflow-auto">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        {selected.isPinned && <span className="text-orange-500">📌</span>}
                                        {getPriorityBadge(selected.priority)}
                                    </div>
                                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900">{selected.title}</h3>
                                    <div className="text-sm text-gray-500 mt-1">
                                        Target: {selected.targetAudience || 'all'} • {formatDate(selected.startDate || selected.createdAt)}
                                        {selected.endDate && ` - Valid until ${formatDate(selected.endDate)}`}
                                    </div>
                                </div>
                                <button onClick={() => setSelected(null)} className="px-3 py-2 border rounded-lg hover:bg-gray-100">
                                    ✕
                                </button>
                            </div>
                            
                            <div className="mt-4 text-gray-700 whitespace-pre-line leading-relaxed">
                                {selected.content}
                            </div>

                            {/* Attachments */}
                            {selected.attachments && selected.attachments.length > 0 && (
                                <div className="mt-6 border-t pt-4">
                                    <h4 className="font-semibold mb-3 text-gray-900">Attachments ({selected.attachments.length})</h4>
                                    <div className="space-y-2">
                                        {selected.attachments.map((file, idx) => (
                                            <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded border hover:border-blue-400 transition max-sm:flex-col max-sm:gap-3">
                                                <div className="flex items-center gap-2">
                                                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                                    </svg>
                                                    <span className="text-sm font-medium text-gray-700">{file.originalName}</span>
                                                    <span className="text-xs text-gray-500">({(file.size / 1024).toFixed(1)} KB)</span>
                                                </div>
                                                <button 
                                                    onClick={() => handleDownload(file.url, file.originalName)}
                                                    className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                                                >
                                                    Download
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

            </main>
            <Footer />
        </div>
    )
}
