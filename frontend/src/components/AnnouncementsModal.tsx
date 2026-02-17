import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { announcementService } from '../api/services/announcementService';
import type { Announcement } from '../api/types';
import { SERVER_URL } from '../api/config';

interface AnnouncementsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDismiss: () => void;
}

const AnnouncementsModal: React.FC<AnnouncementsModalProps> = ({ isOpen, onClose, onDismiss }) => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      fetchAnnouncements();
    }
  }, [isOpen]);

  const fetchAnnouncements = async () => {
    try {
      const highPriorityAnnouncements = await announcementService.getHighPriority();
      setAnnouncements(highPriorityAnnouncements);
    } catch (err: any) {
      console.error('Error fetching announcements:', err);
    }
  };

  const handleAnnouncementClick = (id: number) => {
    navigate(`/announcements/${id}`);
    onDismiss();
  };

  const handleCloseModal = (id: number) => {
    setAnnouncements(prev => prev.filter(a => a.id !== id));
    if (announcements.length === 1) {
      onClose();
    }
  };

  if (!isOpen || announcements.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-60"
        onClick={onClose}
      />

      {/* Modals Container */}
      <div className="relative flex items-center justify-center">
        {announcements.map((announcement, index) => {
          const imageUrl = announcement.attachments?.find(a => a.fileType.startsWith('image/'))?.url;
          const zIndex = announcements.length - index;
          const offset = index * 15;
          
          return (
            <div
              key={announcement.id}
              className="absolute bg-white rounded-lg shadow-2xl overflow-hidden cursor-pointer"
              style={{
                zIndex,
                transform: `translate(${offset}px, ${offset}px)`,
                width: '500px',
                maxWidth: '95vw'
              }}
              onClick={() => handleAnnouncementClick(announcement.id)}
            >
              {/* Close Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCloseModal(announcement.id);
                }}
                className="absolute top-2 right-2 z-10 p-1.5 bg-black bg-opacity-70 hover:bg-opacity-90 rounded-full text-white"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Title */}
              <div className="px-4 py-3 bg-white">
                <h2 className="text-xl font-bold text-gray-900 text-center">{announcement.title}</h2>
              </div>

              {/* Content Preview */}
              <div className="px-4 py-3 bg-white border-t">
                <p className="text-gray-700 text-sm line-clamp-3">
                  {announcement.content}
                </p>
                <p className="text-xs text-blue-600 mt-2 text-center">Click to view full details</p>
              </div>

              {/* Image */}
              {imageUrl && (
                <div className="w-full bg-gray-100">
                  <img
                    src={`${SERVER_URL}${imageUrl}`}
                    alt={announcement.title}
                    className="w-full h-auto object-contain max-h-[70vh]"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Actions */}
      {/* <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-50">
        <button
          onClick={onClose}
          className="px-2 sm:px-4  sm:py-2 bg-white text-gray-700 font-medium rounded hover:bg-gray-100 shadow-lg text-[10px] sm:text-sm"
        >
          Close
        </button>
        <button
          onClick={onDismiss}
          className="px-2 sm:px-4 py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 shadow-lg text-[10px] sm:text-sm"
        >
          Don't Show Again
        </button>
      </div> */}
    </div>
  );
};

export default AnnouncementsModal;
