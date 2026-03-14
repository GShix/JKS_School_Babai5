import { useState, useEffect, useMemo } from 'react';
import { Download as DownloadIcon, FileText, Image as ImageIcon, Search, Filter, Eye, Clock, TrendingDown } from 'lucide-react';
import Footer from '../../layouts/Footer';
import Header from '../../layouts/Header';
import { downloadService, type Download } from '../../api/services/downloadService';
import LoadingSpinner from '../../components/shared/LoadingSpinner';

const Downloads = () => {
  const [files, setFiles] = useState<Download[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  // Fetch downloads on mount
  useEffect(() => {
    fetchDownloads();
  }, []);

  const fetchDownloads = async () => {
    try {
      setLoading(true);
      const response = await downloadService.getAll({ status: 'active' });
      if (response.data) {
        setFiles(response.data);
      }
    } catch (error) {
      console.error('Error fetching downloads:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle download click (increment counter)
  const handleDownload = async (file: Download) => {
    try {
      await downloadService.incrementCount(file.id);
      // Update local state
      setFiles(prevFiles =>
        prevFiles.map(f =>
          f.id === file.id ? { ...f, downloads: f.downloads + 1 } : f
        )
      );
      // Open file in new tab
      window.open(file.fileUrl, '_blank');
    } catch (error) {
      console.error('Error incrementing download count:', error);
      // Still open the file even if counter fails
      window.open(file.fileUrl, '_blank');
    }
  };

  const classes = useMemo(() => {
    const cls = new Set(files.filter(f => f.class).map(f => f.class!));
    return Array.from(cls).sort((a, b) => parseInt(a) - parseInt(b));
  }, [files]);

  const subjects = useMemo(() => {
    const subs = new Set(files.filter(f => f.subject).map(f => f.subject!));
    return Array.from(subs).sort();
  }, [files]);

  // Filter files
  const filteredFiles = useMemo(() => {
    return files.filter(file => {
      // Search filter
      if (searchQuery && !file.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !file.description?.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      // Category filter
      if (selectedCategory !== 'all' && file.category !== selectedCategory) {
        return false;
      }
      // Class filter
      if (selectedClass !== 'all' && file.class !== selectedClass) {
        return false;
      }
      // Subject filter
      if (selectedSubject !== 'all' && file.subject !== selectedSubject) {
        return false;
      }
      return true;
    });
  }, [files, searchQuery, selectedCategory, selectedClass, selectedSubject]);

  // Get category stats
  const categoryStats = useMemo(() => {
    return [
      { name: 'All', count: files.length, value: 'all', color: 'blue' },
      { name: 'Notes', count: files.filter(f => f.category === 'notes').length, value: 'notes', color: 'indigo' },
      { name: 'Question Papers', count: files.filter(f => f.category === 'question-papers').length, value: 'question-papers', color: 'yellow' },
      { name: 'Solutions', count: files.filter(f => f.category === 'solutions').length, value: 'solutions', color: 'green' },
      { name: 'Forms', count: files.filter(f => f.category === 'forms').length, value: 'forms', color: 'purple' },
      { name: 'Syllabus', count: files.filter(f => f.category === 'syllabus').length, value: 'syllabus', color: 'pink' },
      { name: 'Others', count: files.filter(f => f.category === 'others').length, value: 'others', color: 'gray' },
    ];
  }, [files]);

  // Get file icon and color
  const getFileIcon = (fileType: string) => {
    if (fileType === 'pdf') {
      return { icon: FileText, color: 'text-red-600', bg: 'bg-red-50' };
    } else {
      return { icon: ImageIcon, color: 'text-blue-600', bg: 'bg-blue-50' };
    }
  };

  // Get category badge color
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'notes': 'bg-indigo-100 text-indigo-800',
      'question-papers': 'bg-yellow-100 text-yellow-800',
      'solutions': 'bg-green-100 text-green-800',
      'forms': 'bg-purple-100 text-purple-800',
      'syllabus': 'bg-pink-100 text-pink-800',
      'others': 'bg-gray-100 text-gray-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedClass('all');
    setSelectedSubject('all');
  };

  // Note: keep the layout visible while downloads load.
  // We no longer short-circuit the entire component on `loading`.

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <div
        className="relative w-full h-[200px] flex items-center justify-center overflow-hidden bg-gradient-to-r from-blue-600 to-blue-800"
        style={{
          backgroundImage: 'url(/img/running-shield-blur.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 text-center px-4 max-w-4xl">
          <h1 className="text-3xl md:text-4xl font-medium text-white mb-4 animate-fade-in">
            Study Resources
          </h1>
          <p className="text-xl text-blue-100 mb-6">
            Access notes, question papers, solutions, and more
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-white">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              <span>{files.length} Resources</span>
            </div>
            <div className="flex items-center gap-2">
              <DownloadIcon className="w-5 h-5" />
              <span>{files.reduce((sum, f) => sum + f.downloads, 0)} Downloads</span>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 sm:px-6 py-8 max-w-7xl">
        {/* Category Filter Pills */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-wrap gap-3 justify-center">
            {categoryStats.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-6 py-2 max-sm:text-sm sm:py-3 rounded-full font-medium transition-all duration-200 transform hover:scale-105 ${selectedCategory === cat.value
                  ? 'bg-gradient-to-r from-blue-400 to-blue-500 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-50 shadow'
                  }`}
              >
                {cat.name}
                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${selectedCategory === cat.value ? 'bg-white/20' : 'bg-gray-100'
                  }`}>
                  {cat.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title or description..."
                className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filter Toggle Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-6 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
            >
              <Filter className="w-5 h-5" />
              <span className="hidden sm:inline">Filters</span>
              {(selectedClass !== 'all' || selectedSubject !== 'all') && (
                <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                  Active
                </span>
              )}
            </button>

            {/* Clear Filters */}
            {(searchQuery || selectedCategory !== 'all' || selectedClass !== 'all' || selectedSubject !== 'all') && (
              <button
                onClick={clearFilters}
                className="px-6 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl transition-colors"
              >
                Clear All
              </button>
            )}
          </div>

          {/* Additional Filters (Collapsible) */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
              {/* Class Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Class
                </label>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Classes</option>
                  {classes.map((cls) => (
                    <option key={cls} value={cls}>
                      Class {cls}
                    </option>
                  ))}
                </select>
              </div>

              {/* Subject Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Subjects</option>
                  {subjects.map((sub) => (
                    <option key={sub} value={sub}>
                      {sub}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
          <p className="text-gray-600">
            Showing <span className="font-semibold text-gray-900">{filteredFiles.length}</span> of{' '}
            <span className="font-semibold text-gray-900">{files.length}</span> resources
          </p>
        </div>

        {/* Files Grid */}
        {loading ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <LoadingSpinner text="Loading downloads..." />
          </div>
        ) : filteredFiles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFiles.map((file) => {
              const { icon: Icon, color, bg } = getFileIcon(file.fileType);

              return (
                <div
                  key={file.id}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden group"
                >
                  {/* File Header */}
                  <div className={`${bg} p-6 flex items-center justify-between`}>
                    <Icon className={`w-12 h-12 ${color}`} />
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(file.category)}`}>
                      {file.category.replace(/-/g, ' ').toUpperCase()}
                    </span>
                  </div>

                  {/* File Content */}
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {file.title}
                    </h3>

                    {file.description && (
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {file.description}
                      </p>
                    )}

                    {/* File Meta */}
                    <div className="flex flex-wrap gap-2 text-xs text-gray-500 mb-4">
                      {file.class && (
                        <span className="bg-gray-100 px-2 py-1 rounded">
                          Class {file.class}
                        </span>
                      )}
                      {file.subject && (
                        <span className="bg-gray-100 px-2 py-1 rounded">
                          {file.subject}
                        </span>
                      )}
                      {file.academicYear && (
                        <span className="bg-gray-100 px-2 py-1 rounded">
                          {file.academicYear}
                        </span>
                      )}
                    </div>

                    {/* File Info */}
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-4 pb-4 border-b border-gray-100">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{new Date(file.createdAt).toLocaleDateString()}</span>
                      </div>
                      {file.fileSize && (
                        <span className="font-medium">{file.fileSize}</span>
                      )}
                    </div>

                    {/* Downloads Count */}
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                      <TrendingDown className="w-4 h-4" />
                      <span>{file.downloads} downloads</span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDownload(file)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-700 hover:to-blue-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg"
                      >
                        <DownloadIcon className="w-4 h-4" />
                        Download
                      </button>
                      <a
                        href={file.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors"
                        title="Preview"
                      >
                        <Eye className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Resources Found
            </h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your filters or search terms
            </p>
            <button
              onClick={clearFilters}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Popular Downloads Section */}
        {!loading && files.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Most Downloaded</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {files
                .sort((a, b) => b.downloads - a.downloads)
                .slice(0, 3)
                .map((file) => {
                  const { icon: Icon, color, bg } = getFileIcon(file.fileType);

                  return (
                    <div
                      key={file.id}
                      className="bg-white rounded-xl shadow p-4 hover:shadow-lg transition-shadow"
                    >
                      <div className="flex items-start gap-4">
                        <div className={`${bg} p-3 rounded-lg`}>
                          <Icon className={`w-6 h-6 ${color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 truncate mb-1">
                            {file.title}
                          </h4>
                          <p className="text-sm text-gray-500 mb-2">
                            {file.downloads} downloads
                          </p>
                          <button
                            onClick={() => handleDownload(file)}
                            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                          >
                            Download →
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Downloads;