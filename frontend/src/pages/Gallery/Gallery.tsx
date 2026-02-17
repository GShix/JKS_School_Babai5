
import { useState, useEffect, useMemo } from 'react';
import Header from '../../layouts/Header';
import Footer from '../../layouts/Footer';
import { galleryService } from '../../api/services/galleryService';
import { X, ChevronLeft, ChevronRight, Calendar, Eye, Tag, Play, Download, Share2, ZoomIn, ZoomOut, Search, Filter, ImageIcon } from 'lucide-react';
import { showToast } from '../../utils/sweetAlert';
import { getImageUrl } from '../../utils/imageUtils';

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

const Gallery = () => {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<'All' | string>('All');
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [imageZoom, setImageZoom] = useState(1);
  const [showImageInfo, setShowImageInfo] = useState(true);

  useEffect(() => {
    fetchGallery();
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

  const fetchGallery = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await galleryService.getAllGallery();
      if (response.data && response.data.data) {
        setGalleryItems(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching gallery:', error);
      setError('Failed to load gallery items. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const categories = useMemo(() => {
    const cats = Array.from(new Set(galleryItems.map(i => i.category)));
    return ['All', ...cats];
  }, [galleryItems]);

  const filtered = useMemo(() => {
    return galleryItems.filter(item => {
      if (category !== 'All' && item.category !== category) return false;
      if (query.trim() && !item.title.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });
  }, [query, category, galleryItems]);

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
      link.href = getImageUrl(selectedItem.images[selectedImageIndex].url);
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Banner */}
      <div 
        className="w-full h-[200px] bg-gradient-to-r from-blue-600 to-blue-800 flex flex-col items-center justify-center px-6 relative overflow-hidden"
        style={{
          backgroundImage: 'url(/img/running-shield-blur.jpg)', 
          backgroundSize: 'cover', 
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 text-center">
          <h1 className="text-3xl md:text-4xl font-medium text-white mb-4">School Gallery</h1>
          <p className="text-xl text-white/90 max-w-2xl">
            Explore moments from our academic programs, events, tours, and activities
          </p>
        </div>
      </div>

      <main className="container mx-auto px-4 sm:px-6 py-10">
        {/* Filters & Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Search */}
            <div className="flex-1 w-full lg:max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  value={query} 
                  onChange={e => setQuery(e.target.value)} 
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" 
                  placeholder="Search by title, description..." 
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-3">
              <Filter className="w-5 h-5 text-gray-600" />
              <select 
                value={category} 
                onChange={e => setCategory(e.target.value)} 
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white min-w-[150px]"
              >
                {categories.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              
              {/* Results Count */}
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg">
                <ImageIcon className="w-4 h-4" />
                <span className="font-medium">{filtered.length} {filtered.length === 1 ? 'item' : 'items'}</span>
              </div>
            </div>
          </div>

          {/* Mobile Results Count */}
          <div className="sm:hidden mt-4 flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg">
            <ImageIcon className="w-4 h-4" />
            <span className="font-medium">{filtered.length} {filtered.length === 1 ? 'item' : 'items'}</span>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mb-4"></div>
            <p className="text-gray-600 text-lg">Loading gallery...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={fetchGallery}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filtered.length === 0 && (
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-12 text-center">
            <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No items found</h3>
            <p className="text-gray-600">
              {query || category !== 'All' 
                ? 'Try adjusting your filters or search query' 
                : 'No gallery items available at the moment'}
            </p>
          </div>
        )}

        {/* Gallery Grid */}
        {!loading && !error && filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filtered.map(item => {
              const firstImage = item.images && item.images.length > 0 ? item.images[0] : null;
              
              return (
                <div 
                  key={item.id} 
                  className="group bg-white rounded-xl shadow-md hover:shadow-xl overflow-hidden cursor-pointer border border-gray-200 transition-all duration-300 hover:-translate-y-1"
                  onClick={() => firstImage && openLightbox(item, 0)}
                >
                  {/* Image Container */}
                  <div className="relative h-56 bg-gray-200 overflow-hidden">
                    {firstImage ? (
                      <>
                        <img 
                          src={getImageUrl(firstImage.url)} 
                          alt={item.title}
                          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                          loading="lazy"
                          decoding="async"
                        />
                        {/* Overlay on hover */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="absolute bottom-3 left-3 right-3 text-white">
                            <p className="text-sm font-medium">Click to view</p>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <ImageIcon className="w-12 h-12" />
                      </div>
                    )}
                    
                    {/* Media count badge */}
                    {item.images.length > 1 && (
                      <div className="absolute top-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded-full font-medium">
                        +{item.images.length - 1} more
                      </div>
                    )}
                    
                    {/* Featured badge */}
                    {item.featured && (
                      <div className="absolute top-3 left-3 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                        ⭐ Featured
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="font-bold text-lg text-gray-900 line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                      {item.description}
                    </p>
                    
                    {/* Metadata */}
                    <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(item.eventDate).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" />
                        {item.views}
                      </span>
                    </div>
                    
                    {/* Tags */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                        {item.category}
                      </span>
                      {item.videos && item.videos.length > 0 && (
                        <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full font-medium flex items-center gap-1">
                          <Play className="w-3 h-3" />
                          {item.videos.length}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination info */}
        {!loading && !error && filtered.length > 0 && (
          <div className="mt-8 text-center text-gray-600">
            <p>Showing all {filtered.length} {filtered.length === 1 ? 'item' : 'items'}</p>
          </div>
        )}
      </main>

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
                  src={getImageUrl(selectedItem.images[selectedImageIndex].url)}
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
                            src={getImageUrl(img.url)}
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

      <Footer />
    </div>
  );
}

export default Gallery;