"use client";

import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface ProjectGalleryProps {
  images: string[];
  projectTitle: string;
}

export default function ProjectGallery({
  images,
  projectTitle,
}: ProjectGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) return null;

  const openLightbox = (index: number) => {
    setSelectedIndex(index);
    setCurrentIndex(index);
  };

  const closeLightbox = () => {
    setSelectedIndex(null);
  };

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (selectedIndex === null) return;

    if (e.key === "ArrowRight") nextImage();
    if (e.key === "ArrowLeft") prevImage();
    if (e.key === "Escape") closeLightbox();
  };

  return (
    <>
      {/* Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((image, index) => (
          <button
            // biome-ignore lint/suspicious/noArrayIndexKey: Images are static and won't reorder
            key={index}
            type="button"
            onClick={() => openLightbox(index)}
            className="group relative aspect-video overflow-hidden rounded-xl border-2 border-surface-light bg-surface hover:border-accent-primary transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 focus:ring-offset-primary-bg"
          >
            <Image
              src={image}
              alt={`${projectTitle} screenshot ${index + 1}`}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary-bg/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute bottom-4 left-4 right-4 text-left opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <p className="text-text-primary font-bold text-sm">
                Click to view full size
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-primary-bg/95 backdrop-blur-sm"
          onClick={closeLightbox}
          onKeyDown={handleKeyDown}
          role="dialog"
          aria-modal="true"
          aria-label="Image gallery lightbox"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={closeLightbox}
            className="absolute top-6 right-6 z-10 p-3 rounded-full bg-surface border-2 border-surface-light hover:border-accent-primary text-text-primary hover:text-accent-primary transition-all duration-300"
            aria-label="Close lightbox"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Navigation buttons */}
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
                className="absolute left-6 z-10 p-3 rounded-full bg-surface border-2 border-surface-light hover:border-accent-primary text-text-primary hover:text-accent-primary transition-all duration-300"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                className="absolute right-6 z-10 p-3 rounded-full bg-surface border-2 border-surface-light hover:border-accent-primary text-text-primary hover:text-accent-primary transition-all duration-300"
                aria-label="Next image"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Image counter */}
          <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10 px-4 py-2 rounded-full bg-surface border-2 border-surface-light text-text-primary font-bold">
            {currentIndex + 1} / {images.length}
          </div>

          {/* Main image */}
          {/* biome-ignore lint/a11y/useKeyWithClickEvents: stopPropagation prevents parent keyboard handler */}
          {/* biome-ignore lint/a11y/noStaticElementInteractions: Prevents closing lightbox when clicking image */}
          <div
            className="relative max-w-7xl max-h-[90vh] w-full h-full mx-8 flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full h-full flex items-center justify-center">
              <Image
                src={images[currentIndex]}
                alt={`${projectTitle} screenshot ${currentIndex + 1}`}
                fill
                className="object-contain"
                sizes="90vw"
                priority
              />
            </div>
          </div>

          {/* Keyboard hints */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-4 text-text-secondary text-sm">
            <span>← / → Navigate</span>
            <span>•</span>
            <span>ESC Close</span>
          </div>
        </div>
      )}
    </>
  );
}
