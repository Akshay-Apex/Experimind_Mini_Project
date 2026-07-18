// Dynamic import of all jpg images from src/assets/images
const imageModules = import.meta.glob('./images/*.jpg', { eager: true });

export const GALLERY_IMAGES: string[] = Object.keys(imageModules).map((key) => {
  const mod = imageModules[key] as { default: string };
  return mod.default;
});

// Extract only the filename from path for labelling (e.g. "20251103_180644")
export const getFriendlyName = (path: string): string => {
  const parts = path.split('/');
  const filename = parts[parts.length - 1];
  return filename.split('.')[0] || 'Handmade Flower';
};
