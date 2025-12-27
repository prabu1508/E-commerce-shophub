# Product Seeding Guide

This guide explains how to add sample products with images to your e-commerce application.

## Quick Start

Run the seed script to populate your database with sample products:

```bash
cd backend
npm run seed
```

This will add 12 sample products with high-quality images from Unsplash.

## What Gets Added

The seed script adds products in these categories:
- **Electronics**: Headphones, Smartwatch, Gaming Keyboard, Wireless Charger
- **Clothing**: T-Shirt, Running Shoes
- **Accessories**: Leather Bag, Sunglasses, Phone Case
- **Home**: Coffee Mugs, Desk Lamp, Bedding Set

Each product includes:
- ✅ Title and description
- ✅ Price in INR (₹)
- ✅ High-quality images from Unsplash
- ✅ Category, brand, and stock information
- ✅ Ratings and reviews count

## Manual Product Creation

You can also create products manually through the API (requires admin authentication):

### Example API Request:

```bash
POST /api/products
Authorization: Bearer <admin_token>

{
  "title": "Your Product Name",
  "description": "Product description here",
  "price": 2999,
  "images": [
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop"
  ],
  "category": "electronics",
  "brand": "YourBrand",
  "stock": 50,
  "rating": 4.5,
  "numReviews": 100
}
```

## Image Sources

The seed script uses images from **Unsplash** - a free image service. You can:

1. **Use Unsplash images**: Visit [unsplash.com](https://unsplash.com) and search for product images
2. **Use your own images**: Upload to a service like Cloudinary, AWS S3, or use local storage
3. **Use placeholder services**: For development, use services like [placeholder.com](https://placeholder.com)

## Image URLs Format

Products accept image URLs in the `images` array. Each URL should:
- Start with `http://` or `https://`
- Point to a valid image file
- Be accessible publicly (for external URLs)

Example:
```json
{
  "images": [
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop",
    "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&h=800&fit=crop"
  ]
}
```

## Frontend Image Handling

The frontend automatically handles:
- ✅ Image loading states
- ✅ Fallback images if URL fails
- ✅ Lazy loading for performance
- ✅ Multiple image galleries on product pages

## Troubleshooting

**Products not showing?**
- Check that MongoDB is running
- Verify your `MONGO_URI` in `.env` is correct
- Check browser console for errors

**Images not loading?**
- Verify image URLs are accessible
- Check network tab for failed requests
- Images will automatically fallback to placeholder if URL fails

**Want to reseed?**
- Delete existing products from database first
- Or modify `seedProducts.js` to skip the existing check

