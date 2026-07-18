// Explicit imports of all bookable flower images from src/assets/images
import img01 from './images/20251103_180644.jpg';
import img02 from './images/20251114_171304.jpg';
import img03 from './images/20251128_092317.jpg';
import img04 from './images/20251201_165332.jpg';
import img05 from './images/20251219_113819.jpg';
import img06 from './images/20260103_112701.jpg';
import img07 from './images/20260326_191457.jpg';
import img08 from './images/20260327_101000.jpg';
import img09 from './images/20260424_155841.jpg';
import img10 from './images/20260429_172500.jpg';
import img11 from './images/20260429_180635(0)(1).jpg';
import img12 from './images/20260503_185611.jpg';
import img13 from './images/20260505_171127(2).jpg';
import img14 from './images/20260507_170750(0)(1).jpg';
import img15 from './images/20260606_164004.jpg';
import img16 from './images/20260621_095221(0)(1).jpg';
import img17 from './images/20260621_104812.jpg';
import img18 from './images/20260708_184549.jpg';
import img19 from './images/20260710_111755(0).jpg';
import img20 from './images/20260714_104550.jpg';
import img21 from './images/20260715_155950.jpg';
import img22 from './images/20260715_160111.jpg';
import img23 from './images/20260715_160333.jpg';
import img24 from './images/20260715_160436.jpg';
import img25 from './images/20260715_164938.jpg';
import img26 from './images/20260715_181606.jpg';
import img27 from './images/20260715_182002.jpg';
import img28 from './images/20260716_180715.jpg';

// Named gallery entries — only bookable designs
export interface GalleryEntry {
  src: string;
  name: string;
}

export const GALLERY_ENTRIES: GalleryEntry[] = [
  { src: img01, name: 'Blush Petal Dream' },
  { src: img02, name: 'Rosy Dawn Bouquet' },
  { src: img03, name: 'Ivory Charm Posy' },
  { src: img04, name: 'Golden Sunset Bloom' },
  { src: img05, name: 'Winter Rose Elegance' },
  { src: img06, name: 'New Year Blossom' },
  { src: img07, name: 'Spring Meadow Delight' },
  { src: img08, name: 'Morning Dew Florals' },
  { src: img09, name: 'Pastel Garden Wrap' },
  { src: img10, name: 'Lavender Haze Bundle' },
  { src: img11, name: 'Enchanted Rose Cluster' },
  { src: img12, name: 'Peach Blossom Embrace' },
  { src: img13, name: 'Wildflower Whisper' },
  { src: img14, name: 'Crimson Velvet Bouquet' },
  { src: img15, name: 'Summer Glow Arrangement' },
  { src: img16, name: 'Tropical Sunrise Posy' },
  { src: img17, name: 'Graceful Lily Cascade' },
  { src: img18, name: 'Monsoon Bloom Special' },
  { src: img19, name: 'Royal Garden Centrepiece' },
  { src: img20, name: 'Cherry Blossom Bliss' },
  { src: img21, name: 'Twilight Petal Spray' },
  { src: img22, name: 'Sunlit Daisy Bunch' },
  { src: img23, name: 'Coral Reef Florals' },
  { src: img24, name: 'Vintage Rose Nosegay' },
  { src: img25, name: 'Whimsical Bloom Basket' },
  { src: img26, name: 'Sunset Orchid Luxe' },
  { src: img27, name: 'Pearl Peony Cascade' },
  { src: img28, name: 'Moonlit Magnolia Wrap' },
];

// Legacy compat: flat array of image URLs for catalog product defaults
export const GALLERY_IMAGES: string[] = GALLERY_ENTRIES.map((e) => e.src);

// Returns a pretty display name for a given image path
export const getFriendlyName = (path: string): string => {
  const match = GALLERY_ENTRIES.find((e) => e.src === path);
  if (match) return match.name;
  // Fallback for unknown paths
  return 'Handmade Flower';
};
