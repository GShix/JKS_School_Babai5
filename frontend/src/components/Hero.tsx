import { useState, useEffect } from "react";
import { type HeroSlide } from "../api/services";
import LoadingSpinner from "./shared/LoadingSpinner";

interface HeroProps {
  slides: HeroSlide[];
  loading: boolean;
}

export default function Hero({ slides, loading }: HeroProps) {
  const [current, setCurrent] = useState(0);

  const prevImage = () => setCurrent((current - 1 + slides.length) % slides.length);
  const nextImage = () => setCurrent((current + 1) % slides.length);

  // Reset current slide when slides change
  useEffect(() => {
    setCurrent(0);
  }, [slides]);

  useEffect(() => {
    if (slides.length === 0) return;
    
    const interval = setInterval(() => {
      nextImage();
    }, 3000); // Change image every 3 seconds
    return () => clearInterval(interval);
  }, [current, slides.length]);

  // Show loading spinner while fetching
  if (loading) {
    return (
      <div className="w-full h-[500px] flex items-center justify-center bg-gray-100">
        <LoadingSpinner />
      </div>
    );
  }

  // Show placeholder if no slides available
  if (slides.length === 0) {
    return (
      <div className="w-full h-[400px] flex items-center justify-center bg-gradient-to-r from-blue-500 to-[#035CB0]">
        <div className="text-center text-white">
          <h2 className="text-4xl font-bold mb-4">Welcome to Janakalyan Ma Vi</h2>
          <p className="text-xl">Shaping Future Leaders</p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden bg-white">
      {/* Image carousel with left/right arrow navigation */}
      <div className="image-carousel w-full max-sm:w-[100%] h-[500px] px-0">
        <div className="carousel-wrapper relative overflow-hidden h-full">
          <img
            className="carousel-image w-full max-sm:w-[100%] h-full object-fit object-cover transition-all duration-500"
            src={slides[current].imageUrl}
            alt={slides[current].title || "Hero slide"}
          />
          
          {/* Optional title overlay */}
          {slides[current].title && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-8 flex justify-center">
              <h2 className="text-white text-xl">{slides[current].title}</h2>
            </div>
          )}

          {/* Navigation buttons - only show if more than 1 slide */}
          {slides.length > 1 && (
            <>
              <button
                className="carousel-button prev"
                style={{ 
                  position: 'absolute', 
                  top: '50%', 
                  left: 10, 
                  transform: 'translateY(-50%)', 
                  background: '#fff', 
                  border: 'none', 
                  borderRadius: '50%', 
                  width: 40, 
                  height: 40, 
                  fontSize: 20, 
                  cursor: 'pointer', 
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                  zIndex: 10
                }}
                onClick={prevImage}
                aria-label="Previous"
              >
                &#8592;
              </button>
              <button
                className="carousel-button next"
                style={{ 
                  position: 'absolute', 
                  top: '50%', 
                  right: 10, 
                  transform: 'translateY(-50%)', 
                  background: '#fff', 
                  border: 'none', 
                  borderRadius: '50%', 
                  width: 40, 
                  height: 40, 
                  fontSize: 20, 
                  cursor: 'pointer', 
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                  zIndex: 10
                }}
                onClick={nextImage}
                aria-label="Next"
              >
                &#8594;
              </button>

              {/* Slide indicators */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrent(idx)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      idx === current 
                        ? 'bg-white w-8' 
                        : 'bg-white/50 hover:bg-white/75'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
