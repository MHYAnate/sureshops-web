'use client';

import { useEffect, useState } from 'react';

const CAROUSEL_IMAGES = [
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=400&fit=crop',
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=400&fit=crop',
  'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&h=400&fit=crop',
  'https://images.unsplash.com/photo-1572365992253-3cb3e56dd362?w=800&h=400&fit=crop',
  'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=800&h=400&fit=crop',
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=400&fit=crop',
];

export function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % CAROUSEL_IMAGES.length);
    }, 4000); // Change image every 4 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Carousel container */}
      <div className="relative w-full h-full">
        {CAROUSEL_IMAGES.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={image || "/placeholder.svg"}
              alt={`Background ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      {/* Overlay gradient - keeps text readable and adds visual depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/50 to-background/80" />
      
      {/* Additional subtle overlay for text contrast */}
      <div className="absolute inset-0 bg-black/20" />
    </div>
  );
}
