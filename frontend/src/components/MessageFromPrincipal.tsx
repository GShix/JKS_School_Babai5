import { useState, useEffect } from 'react';
import { messageService } from '../api/services';
import { SERVER_URL } from '../api/config';
import type { SchoolMessage } from '../api/types';

const MessageFromPrincipal = () => {
  const [message, setMessage] = useState<SchoolMessage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        setLoading(true);
        const response = await messageService.getAll(true); // Get only active messages
        
        if (response.data && response.data.length > 0) {
          // Get the first message (highest priority based on display order)
          setMessage(response.data[0]);
        }
      } catch (err) {
        console.error('Error fetching principal message:', err);
        setError('Failed to load message');
      } finally {
        setLoading(false);
      }
    };

    fetchMessage();
  }, []);

  if (loading) {
    return (
      <div className='flex justify-center items-center py-20 bg-gray0 mt-4'>
        <div className='text-xl text-gray-600'>Loading...</div>
      </div>
    );
  }

  if (error || !message) {
    return null; // Don't show anything if there's an error or no message
  }

  const photoUrl = message.photo 
    ? (message.photo.startsWith('http') ? message.photo : `${SERVER_URL}${message.photo}`)
    : '/img/headmaster-2.jpg'; // Fallback to default image

  return (
    <div className='max-sm:flex-col sm:flex px-4 sm:px-11 gap-4 w-full py-10 bg-gray0 mt-6 border-t border-gray-100'>
      <div className="photo sm:w-2/3">
        <img 
          className='w-full h-[500px] rounded-md object-cover' 
          src={photoUrl} 
          alt={message.personName}
          loading="lazy"
          decoding="async"
          onError={(e) => {
            // Fallback to default image if photo fails to load
            (e.target as HTMLImageElement).src = '/img/headmaster-2.jpg';
          }}
        />
      </div>
      <div className="message sm:w-[95%] max-sm:mt-2">
        <h2 className='text-2xl sm:text-4xl font-bold leading-none text-[#035CB0] my-3 sm:mb-5'>
          Message from {message.personPosition}
        </h2>
        <p className='text-lg mt-2 text-justify leading-7 text-gray-700'>
          {message.message}
        </p>
        <h1 className='mt-8 font-semibold text-xl'>{message.personName}</h1>
        <h2 className="font-medium">{message.personPosition}</h2>
      </div>
    </div>
  );
};

export default MessageFromPrincipal;
