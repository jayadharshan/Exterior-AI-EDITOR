import { MAX_IMAGE_DIMENSION } from "../constants";

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
        const base64Data = reader.result.split(',')[1];
        resolve(base64Data);
      } else {
        reject(new Error("Failed to convert file to base64"));
      }
    };
    reader.onerror = (error) => reject(error);
  });
};

export const resizeImage = (file: File): Promise<{ base64: string; mimeType: string; previewUrl: string }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > MAX_IMAGE_DIMENSION) {
          height = Math.round((height *= MAX_IMAGE_DIMENSION / width));
          width = MAX_IMAGE_DIMENSION;
        }
      } else {
        if (height > MAX_IMAGE_DIMENSION) {
          width = Math.round((width *= MAX_IMAGE_DIMENSION / height));
          height = MAX_IMAGE_DIMENSION;
        }
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject(new Error("Canvas context not available"));

      ctx.drawImage(img, 0, 0, width, height);

      // Convert to standard JPEG for API consistency
      const mimeType = 'image/jpeg';
      const dataUrl = canvas.toDataURL(mimeType, 0.9);
      const base64 = dataUrl.split(',')[1];

      resolve({
        base64,
        mimeType,
        previewUrl: dataUrl
      });
    };
    img.onerror = (err) => reject(err);
  });
};