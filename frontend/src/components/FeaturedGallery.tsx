import { useState, useEffect } from 'react';
import { galleryService } from '../api/services/galleryService';
import { SERVER_URL } from '../api/config';
import { Link } from 'react-router-dom';
import { X, ChevronLeft, ChevronRight, Calendar, Eye, Tag, Play, Download, Share2, ZoomIn, ZoomOut } from 'lucide-react';
import { showToast } from '../utils/sweetAlert';

interface FileObject {
  filename: string;
  originalName: string;
  fileType: string;
  url: string;
  size: number;
}

interface GalleryItem {
  id: number;
  title: string;
  description: string;
  images: FileObject[];
  videos: FileObject[];
  category: string;
  eventDate: string;
  views: number;
  tags: string;
  featured: boolean;
  status: string;
}

function FeaturedGallery() {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [imageZoom, setImageZoom] = useState(1);
  const [showImageInfo, setShowImageInfo] = useState(true);

  useEffect(() => {
    fetchFeaturedGallery();
  }, []);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (selectedItem) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedItem]);

  const fetchFeaturedGallery = async () => {
    try {
      setLoading(true);
      const response = await galleryService.getFeaturedGallery();
      if (response.data && response.data.data) {
        // Limit to first 8 featured items for homepage
        setGalleryItems(response.data.data.slice(0, 8));
      }
    } catch (error) {
      console.error('Error fetching featured gallery:', error);
    } finally {
      setLoading(false);
    }
  };

  const openLightbox = (item: GalleryItem, imageIndex: number = 0) => {
    setSelectedItem(item);
    setSelectedImageIndex(imageIndex);
    setImageZoom(1);
  };

  const closeLightbox = () => {
    setSelectedItem(null);
    setSelectedImageIndex(0);
    setImageZoom(1);
  };

  const nextImage = () => {
    if (selectedItem && selectedItem.images.length > 0) {
      setSelectedImageIndex((prev) => 
        prev < selectedItem.images.length - 1 ? prev + 1 : 0
      );
      setImageZoom(1);
    }
  };

  const prevImage = () => {
    if (selectedItem && selectedItem.images.length > 0) {
      setSelectedImageIndex((prev) => 
        prev > 0 ? prev - 1 : selectedItem.images.length - 1
      );
      setImageZoom(1);
    }
  };

  const handleZoomIn = () => {
    setImageZoom((prev) => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setImageZoom((prev) => Math.max(prev - 0.25, 0.5));
  };

  const handleDownload = () => {
    if (selectedItem && selectedItem.images[selectedImageIndex]) {
      const link = document.createElement('a');
      link.href = `${SERVER_URL}${selectedItem.images[selectedImageIndex].url}`;
      link.download = selectedItem.images[selectedImageIndex].originalName || 'image.jpg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleShare = async () => {
    if (selectedItem) {
      const shareData = {
        title: selectedItem.title,
        text: selectedItem.description,
        url: window.location.href
      };
      
      try {
        if (navigator.share) {
          await navigator.share(shareData);
        } else {
          // Fallback - copy to clipboard
          await navigator.clipboard.writeText(window.location.href);
          showToast('Link copied to clipboard!', 'success');
        }
      } catch (error) {
        console.error('Error sharing:', error);
      }
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedItem) return;
      
      switch (e.key) {
        case 'ArrowLeft':
          prevImage();
          break;
        case 'ArrowRight':
          nextImage();
          break;
        case 'Escape':
          closeLightbox();
          break;
        case '+':
        case '=':
          handleZoomIn();
          break;
        case '-':
        case '_':
          handleZoomOut();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedItem, selectedImageIndex]);

  if (loading) {
    return (
      <div className="p-5 bg-white rounded shadow">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (galleryItems.length === 0) {
    return null; // Don't show section if no featured items
  }

  return (
    <div className="p-4 sm:p-5 bg-gray-50 rounded shadow">
      <div className="sm:px-4 mb-6">
        <div className="header flex justify-center w-full mb-4">
          <span className="text-lg text-[#035CB0] bg-gray-100 px-4 py-2 rounded-full">Featured Gallery</span>
        </div>
        <div className="view-all mt-6 sm:mt-0 flex justify-center w-full">
          <h1 className="text-2xl sm:text-4xl text-[#035CB0] font-bold">Capturing Janakalyan's Memories</h1>
        </div>
      </div>
      
      <div className="sm:px-4 grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
        {galleryItems.map((item) => {
          const firstImage = item.images && item.images.length > 0 ? item.images[0] : null;
          
          return (
            <div 
              key={item.id} 
              className="card w-full hover:bg-blue-200 rounded-md overflow-hidden cursor-pointer border-2 border-blue-500 transition-all hover:shadow-lg"
              onClick={() => firstImage && openLightbox(item, 0)}
            >
              <div className="card-img h-48 bg-gray-200">
                {firstImage ? (
                  <img 
                    className="w-full h-full object-cover" 
                    src={`${SERVER_URL}${firstImage.url}`} 
                    alt={item.title}
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <span>No image</span>
                  </div>
                )}
                {/* {item.images.length > 1 && (
                  <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    +{item.images.length - 1} more
                  </div>
                )} */}
              </div>
              <div className="card-details p-3">
                <h1 className="font-bold text-lg hover:underline line-clamp-2">
                  {item.title}
                </h1>
                <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                  {item.description}
                </p>
                <div className="date mt-2 text-sm text-gray-500">
                  <i className="ri-calendar-schedule-fill mr-2"></i>
                  <span>{new Date(item.eventDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                    {item.category.toUpperCase()}
                  </span>
                  {item.videos && item.videos.length > 0 && (
                    <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">
                      🎥 {item.videos.length}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* View All Link */}
      <div className="flex justify-center mt-8">
        <Link 
          to="/gallery" 
          className="bg-primary text-[#035CB0] px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors font-medium"
        >
          View All Gallery →
        </Link>
      </div>

      {/* Modern Interactive Lightbox Modal */}
      {selectedItem && selectedItem.images.length > 0 && (
        <div 
          className="fixed inset-0 bg-black/95 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn"
          onClick={closeLightbox}
        >
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-50 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all hover:rotate-90 duration-300"
            title="Close (Esc)"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Info toggle - Hidden on mobile, shown on desktop */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowImageInfo(!showImageInfo);
            }}
            className="hidden md:block absolute top-4 left-4 z-50 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all text-sm font-medium"
          >
            {showImageInfo ? 'Hide Info' : 'Show Info'}
          </button>

          {/* Action buttons - Responsive layout */}
          <div className="absolute top-4 left-4 md:left-1/2 md:-translate-x-1/2 z-50 flex gap-1 md:gap-2 flex-wrap max-w-[calc(100%-8rem)] md:max-w-none">
            <button
              onClick={handleZoomOut}
              className="p-1.5 md:p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all"
              title="Zoom Out (-)"
            >
              <ZoomOut className="w-4 h-4 md:w-5 md:h-5" />
            </button>
            <div className="px-2 md:px-3 py-1.5 md:py-2 bg-white/10 text-white rounded-lg text-xs md:text-sm font-medium min-w-[50px] md:min-w-[60px] text-center">
              {Math.round(imageZoom * 100)}%
            </div>
            <button
              onClick={handleZoomIn}
              className="p-1.5 md:p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all"
              title="Zoom In (+)"
            >
              <ZoomIn className="w-4 h-4 md:w-5 md:h-5" />
            </button>
            <button
              onClick={handleDownload}
              className="p-1.5 md:p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all"
              title="Download Image"
            >
              <Download className="w-4 h-4 md:w-5 md:h-5" />
            </button>
            <button
              onClick={handleShare}
              className="p-1.5 md:p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all"
              title="Share"
            >
              <Share2 className="w-4 h-4 md:w-5 md:h-5" />
            </button>
            {/* Mobile info toggle */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowImageInfo(!showImageInfo);
              }}
              className="md:hidden p-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all text-xs font-medium"
              title="Info"
            >
              {showImageInfo ? '📝' : 'ℹ️'}
            </button>
          </div>

          {/* Main content */}
          <div 
            className="w-full h-full flex flex-col items-center justify-center px-2 md:px-4 py-16 md:py-20"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image with zoom */}
            <div className="relative flex-1 w-full max-w-7xl flex items-center justify-center overflow-hidden mb-2">
              <div 
                className="transition-transform duration-300 ease-out"
                style={{ transform: `scale(${imageZoom})` }}
              >
                <img
                  src={`${SERVER_URL}${selectedItem.images[selectedImageIndex].url}`}
                  alt={selectedItem.title}
                  className="max-h-[50vh] md:max-h-[70vh] max-w-full object-contain rounded-lg shadow-2xl"
                />
              </div>

              {/* Navigation */}
              {selectedItem.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-1 md:left-4 p-2 md:p-3 bg-white/90 hover:bg-white text-black rounded-full shadow-2xl transition-all hover:scale-110 active:scale-95"
                    title="Previous (←)"
                  >
                    <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-1 md:right-4 p-2 md:p-3 bg-white/90 hover:bg-white text-black rounded-full shadow-2xl transition-all hover:scale-110 active:scale-95"
                    title="Next (→)"
                  >
                    <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
                  </button>
                </>
              )}

              {/* Counter */}
              <div className="absolute bottom-2 md:bottom-4 left-1/2 -translate-x-1/2 px-3 md:px-4 py-1.5 md:py-2 bg-black/70 text-white rounded-full text-xs md:text-sm font-medium">
                {selectedImageIndex + 1} / {selectedItem.images.length}
              </div>
            </div>

            {/* Info panel - Scrollable on mobile */}
            {showImageInfo && (
              <div className="w-full max-w-7xl mt-2 md:mt-4 bg-white/10 backdrop-blur-md rounded-xl p-3 md:p-6 animate-slideUp max-h-[40vh] md:max-h-[30vh] overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  <div className="md:col-span-2">
                    <h3 className="text-lg md:text-2xl font-bold text-white mb-2 break-words">
                      {selectedItem.title}
                    </h3>
                    <p className="text-gray-200 text-xs md:text-sm leading-relaxed break-words whitespace-pre-wrap">
                      {selectedItem.description}
                    </p>
                    <p className="mt-2 md:mt-3 text-xs text-gray-400 break-all">
                      {selectedItem.images[selectedImageIndex].originalName}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2 md:gap-3">
                    <div className="flex items-center gap-2 text-white">
                      <Calendar className="w-3.5 h-3.5 md:w-4 md:h-4 text-blue-400 flex-shrink-0" />
                      <span className="text-xs md:text-sm break-words">
                        {new Date(selectedItem.eventDate).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-white">
                      <Tag className="w-3.5 h-3.5 md:w-4 md:h-4 text-green-400 flex-shrink-0" />
                      <span className="text-xs md:text-sm capitalize break-words">{selectedItem.category}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-white">
                      <Eye className="w-3.5 h-3.5 md:w-4 md:h-4 text-purple-400 flex-shrink-0" />
                      <span className="text-xs md:text-sm">{selectedItem.views.toLocaleString()} views</span>
                    </div>

                    {selectedItem.videos && selectedItem.videos.length > 0 && (
                      <div className="flex items-center gap-2 text-white">
                        <Play className="w-3.5 h-3.5 md:w-4 md:h-4 text-red-400 flex-shrink-0" />
                        <span className="text-xs md:text-sm">{selectedItem.videos.length} video(s)</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Thumbnails */}
                {selectedItem.images.length > 1 && (
                  <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-white/20">
                    <div className="flex gap-2 md:gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                      {selectedItem.images.map((img, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedImageIndex(index)}
                          className={`flex-shrink-0 w-14 h-14 md:w-20 md:h-20 rounded-lg overflow-hidden border-2 transition-all hover:scale-110 ${
                            index === selectedImageIndex 
                              ? 'border-blue-500 ring-4 ring-blue-500/50 scale-105' 
                              : 'border-white/30 hover:border-white/60'
                          }`}
                        >
                          <img
                            src={`${SERVER_URL}${img.url}`}
                            alt={`Thumbnail ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Keyboard hints - Hidden on mobile */}
          <div className="hidden md:block absolute bottom-4 right-4 text-white/50 text-xs space-y-1">
            <p>← → Navigate | Esc Close | + - Zoom</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default FeaturedGallery;
