import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { ChevronRight } from "lucide-react";

const slides = [
  {
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&h=600&fit=crop",
    title: "Premium Headphones",
    subtitle: "Experience crystal clear sound with premium noise cancellation",
    color: "from-slate-600/80 to-slate-700/80",
  },
  {
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&h=600&fit=crop",
    title: "Smart Watch Pro",
    subtitle: "Stay connected with advanced health monitoring features",
    color: "from-slate-700/80 to-gray-700/80",
  },
  {
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=1200&h=600&fit=crop",
    title: "Premium Fashion",
    subtitle: "Elevate your wardrobe with exclusive designer collections",
    color: "from-gray-600/80 to-slate-700/80",
  },
  {
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=1200&h=600&fit=crop",
    title: "Portable Speaker",
    subtitle: "Take your music anywhere with studio-quality sound",
    color: "from-slate-700/80 to-slate-600/80",
  },
  {
    image: "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=1200&h=600&fit=crop",
    title: "Ergonomic Setup",
    subtitle: "Work in style and comfort with our ergonomic collection",
    color: "from-gray-700/80 to-slate-700/80",
  },
];

const HeroBanner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  useEffect(() => {
    if (!isAutoPlay) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [isAutoPlay]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlay(false);
    setTimeout(() => setIsAutoPlay(true), 8000);
  };

  const goToPrev = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setIsAutoPlay(false);
    setTimeout(() => setIsAutoPlay(true), 8000);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setIsAutoPlay(false);
    setTimeout(() => setIsAutoPlay(true), 8000);
  };

  return (
    <section 
      className="relative w-full overflow-hidden group"
      onMouseEnter={() => setIsAutoPlay(false)}
      onMouseLeave={() => setIsAutoPlay(true)}
    >
      {/* Slides Container */}
      <div className="relative w-full h-[300px] md:h-[420px] lg:h-[500px]">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            {/* Background Image */}
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover object-center"
              loading={index === 0 ? "eager" : "lazy"}
            />

            {/* Gradient Overlay - More Modern */}
            <div className={`absolute inset-0 bg-gradient-to-r ${slide.color}`}></div>

            {/* Content */}
            <div className="absolute inset-0 flex items-center">
              <div className="w-full px-4 md:px-6 lg:px-8">
                <div className="max-w-2xl animate-slide-up">
                  {/* Pre-title Badge */}
                  <div className="mb-4 inline-block">
                    <span className="px-4 py-1.5 bg-white/20 backdrop-blur-md text-white text-xs font-semibold rounded-full border border-white/30">
                      ✨ Limited Time Offer
                    </span>
                  </div>

                  {/* Main Title */}
                  <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold text-white mb-3 leading-tight drop-shadow-lg">
                    {slide.title}
                  </h1>

                  {/* Subtitle */}
                  <p className="text-base md:text-lg lg:text-xl text-white/95 mb-8 leading-relaxed drop-shadow-md max-w-xl">
                    {slide.subtitle}
                  </p>

                  {/* CTA Button */}
                  <Link
                    to="/products"
                    className="inline-flex items-center gap-2 bg-white text-slate-900 px-6 md:px-8 py-3 md:py-4 rounded-xl font-bold text-base md:text-lg hover:scale-105 transition-all duration-300 hover:shadow-2xl shadow-xl group/btn"
                  >
                    Explore Now
                    <ChevronRight className="h-5 w-5 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/30 hover:bg-white/50 backdrop-blur-md text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
        aria-label="Previous slide"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/30 hover:bg-white/50 backdrop-blur-md text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
        aria-label="Next slide"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-300 rounded-full backdrop-blur-sm ${
              index === currentSlide
                ? "w-8 h-3 bg-white shadow-lg scale-110"
                : "w-3 h-3 bg-white/50 hover:bg-white/70"
            }`}
            aria-label={`Go to slide ${index + 1}`}
            aria-current={index === currentSlide}
          />
        ))}
      </div>

      {/* Slide Counter */}
      <div className="absolute top-6 right-6 z-20 px-4 py-2 bg-white/20 backdrop-blur-md text-white text-sm font-semibold rounded-full border border-white/30">
        {currentSlide + 1} / {slides.length}
      </div>
    </section>
  );
};

export default HeroBanner;
