import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Download } from 'lucide-react';
import Header from '../../layouts/Header';
import Footer from '../../layouts/Footer';
import { announcementService } from '../../api/services/announcementService';
import type { Announcement } from '../../api/types';
import { getImageUrl } from '../../utils/imageUtils';

export default function AnnouncementDetail() {
  const { id } = useParams<{ id: string }>();
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchAnnouncement(parseInt(id));
    }
  }, [id]);

  const fetchAnnouncement = async (announcementId: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await announcementService.getById(announcementId);
      
      if (response.data) {
        setAnnouncement(response.data);
      } else {
        setError('Announcement not found');
      }
    } catch (err: any) {
      console.error('Error fetching announcement:', err);
      setError(err.response?.data?.message || err.message || 'Failed to load announcement');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (fileUrl: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = getImageUrl(fileUrl);
    link.download = fileName;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-12 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#035CB0] border-t-transparent mx-auto mb-3"></div>
            <p className="text-gray-600">Loading announcement...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !announcement) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <div className="bg-red-50 border border-red-200 rounded p-6 text-center max-w-2xl mx-auto">
            <h2 className="text-xl font-bold text-red-700 mb-3">Announcement Not Found</h2>
            <p className="text-red-600 mb-4">{error || 'The announcement you are looking for does not exist.'}</p>
            <Link 
              to="/announcements" 
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#035CB0] text-white rounded hover:bg-blue-700"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Announcements
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const imageAttachments = announcement.attachments?.filter(a => a.fileType.startsWith('image/')) || [];
  const fileAttachments = announcement.attachments?.filter(a => !a.fileType.startsWith('image/')) || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Banner */}
      <div className="w-full h-50 bg-[#035CB0] flex items-center justify-start max-sm:justify-center px-12" style={{backgroundImage: 'url(/img/running-shield-blur.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', opacity:0.9}}>
        <h1 className="text-4xl sm:text-5xl font-medium text-white">{announcement.title}</h1>
      </div>

      {/* Content */}
      <main className="container mx-auto px-4 sm:px-8 py-6">
        <div className="mb-4">
          <Link 
            to="/announcements" 
            className="inline-flex items-center gap-1 text-[#035CB0] hover:underline text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to All Announcements
          </Link>
        </div>

        <div className="bg-white rounded shadow p-6">
          {/* Meta Info */}
          <div className="flex items-center gap-3 mb-4 text-sm">
            <span className="text-gray-600">
              Published: {formatDate(announcement.startDate || announcement.createdAt)}
            </span>
            {announcement.endDate && (
              <>
                <span className="text-gray-400">•</span>
                <span className="text-gray-600">Valid until: {formatDate(announcement.endDate)}</span>
              </>
            )}
            <span className="text-gray-400">•</span>
            <span className={`px-2 py-1 text-xs font-semibold rounded ${
              announcement.priority === 'urgent' ? 'bg-red-100 text-red-700' :
              announcement.priority === 'high' ? 'bg-orange-100 text-orange-700' :
              announcement.priority === 'low' ? 'bg-gray-100 text-gray-700' :
              'bg-blue-100 text-blue-700'
            }`}>
              {(announcement.priority || 'medium').toUpperCase()}
            </span>
            {announcement.isPinned && <span className="text-orange-500">📌 PINNED</span>}
          </div>

          <hr className="my-4" />

          {/* Images - Display prominently at the top */}
          {imageAttachments.length > 0 && (
            <div className="mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {imageAttachments.map((file, index) => (
                  <div key={index} className="border rounded overflow-hidden shadow-sm">
                    <img
                      src={getImageUrl(file.url)}
                      alt={file.originalName}
                      className="w-full h-auto object-cover max-h-96"
                      loading="lazy"
                      decoding="async"
                      onError={(e) => {
                        console.error('Image failed to load:', getImageUrl(file.url));
                        const img = e.target as HTMLImageElement;
                        if (!img.src.endsWith('/img/placeholder.jpg')) {
                          img.src = '/img/placeholder.jpg';
                        }
                      }}
                    />
                    <div className="p-2 bg-gray-50 flex items-center justify-between">
                      <span className="text-sm text-gray-700 truncate flex-1">{file.originalName}</span>
                      <button
                        onClick={() => handleDownload(file.url, file.originalName)}
                        className="ml-2 px-3 py-1 bg-[#035CB0] text-white rounded text-xs hover:bg-blue-700 flex items-center gap-1"
                      >
                        <Download className="w-3 h-3" />
                        Download
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Content */}
          <div className="text-gray-700 leading-relaxed whitespace-pre-wrap mb-6">
            {announcement.content}
          </div>

          {/* Files */}
          {fileAttachments.length > 0 && (
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-3">Attachments</h3>
              <div className="space-y-2">
                {fileAttachments.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded border"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{file.originalName}</p>
                      <p className="text-xs text-gray-500">{file.fileType} • {(file.size / 1024).toFixed(1)} KB</p>
                    </div>
                    <button
                      onClick={() => handleDownload(file.url, file.originalName)}
                      className="ml-2 px-3 py-1.5 bg-[#035CB0] text-white rounded text-sm hover:bg-blue-700 flex items-center gap-1"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="mt-6 pt-4 border-t">
            <p className="text-sm text-gray-600">
              <span className="font-semibold">Target Audience:</span> {(announcement.targetAudience || 'all').toUpperCase()}
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
