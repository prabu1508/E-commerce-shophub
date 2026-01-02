import React, { useState, useEffect } from 'react';

/**
 * ProductImage component with fallback handling
 * Uses placeholder images from placeholder services or local images
 */
export default function ProductImage({ 
  src, 
  alt, 
  className = "", 
  fallback = "https://via.placeholder.com/400x400?text=No+Image" 
}) {
  const [imgSrc, setImgSrc] = useState(src || fallback);
  const [loading, setLoading] = useState(true);

  // Update image source when src prop changes
  useEffect(() => {
    if (src) {
      setImgSrc(src);
      setLoading(true);
    } else {
      setImgSrc(fallback);
      setLoading(false);
    }
  }, [src, fallback]);

  const handleError = () => {
    setImgSrc(fallback);
    setLoading(false);
  };

  const handleLoad = () => {
    setLoading(false);
  };

  return (
    <div className={`relative ${className}`}>
      {loading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center z-10 rounded">
          <div className="text-gray-400 text-sm">Loading...</div>
        </div>
      )}
      <img
        src={imgSrc}
        alt={alt || 'Product image'}
        className={`${className} ${loading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        onError={handleError}
        onLoad={handleLoad}
        loading="lazy"
      />
    </div>
  );
}

/**
 * Get a placeholder image URL based on product category or index
 */
export function getProductImageUrl(category = 'electronics', index = 0) {
  const categoryImages = {
    electronics: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop',
    ],
    clothing: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=400&h=400&fit=crop',
    ],
    accessories: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1544117519-31a4b719223d?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1585928834343-c5291d3f0b0b?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop',
    ],
    home: [
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1540553016722-983e48a2cd10?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1556912172-45b7dfc0b4e0?w=400&h=400&fit=crop',
    ],
  };

  const images = categoryImages[category.toLowerCase()] || categoryImages.electronics;
  return images[index % images.length];
}

