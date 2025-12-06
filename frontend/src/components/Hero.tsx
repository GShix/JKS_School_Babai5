import React from "react";

export default function Hero() {
  const images = [
    "img/running-shield.jpg",
    "img/running-shield-1.jpg",
    "img/running-shield-2.jpg",
    "img/janakalyan_ma_vi.jpg",
    "img/running-shield-4.jpg",
  ];
  const [current, setCurrent] = React.useState(0);
  const prevImage = () => setCurrent((current - 1 + images.length) % images.length);
  const nextImage = () => setCurrent((current + 1) % images.length);

  React.useEffect(() => {
    const interval = setInterval(() => {
      nextImage();
    }, 3000); // Change image every 3 seconds
    return () => clearInterval(interval);
  }, [current]);

  return (
    <div className="overflow-idden bg-white">
      {/* <img className="w-full max-sm:w-[100%] h-[400px] object-fit object-cover " src="img/janakalyan_ma_vi.jpg" alt="" srcSet="" /> */}
      {/* <video className="w-full max-sm:w-[100%] h-[500px] object-fit object-cover "autoPlay loop muted playsInline>
        <source src="/videos/gallery_video1.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video> */}
      {/* Image carousel with left/right arrow navigation */}
      <div className="image-carousel w-full max-sm:w-[100%] h-[600px] px0">
        <div className="carousel-wrapper relative overflow-hidden h-full">
          <img
            className="carousel-image w-full max-sm:w-[100%] h-full object-fit object-cover transition-border duration-500"
            src={images[current]}
            alt="carousel"
          />
          <button
            className="carousel-button prev"
            style={{ position: 'absolute', top: '50%', left: 10, transform: 'translateY(-50%)', background: '#fff', border: 'none', borderRadius: '50%', width: 40, height: 40, fontSize: 20, cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
            onClick={prevImage}
            aria-label="Previous"
          >
            &#8592;
          </button>
          <button
            className="carousel-button next"
            style={{ position: 'absolute', top: '50%', right: 10, transform: 'translateY(-50%)', background: '#fff', border: 'none', borderRadius: '50%', width: 40, height: 40, fontSize: 20, cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
            onClick={nextImage}
            aria-label="Next"
          >
            &#8594;
          </button>
        </div>
        {/* <div className="text-center mt-4">
          {images.map((_, idx) => (
            <span
              key={idx}
              style={{
                display: 'inline-block',
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: idx === current ? '#333' : '#ccc',
                margin: '0 4px'
              }}
            />
          ))}
        </div> */}
      </div>
    </div>
  );
}
