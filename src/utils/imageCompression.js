// Resizes and re-compresses an image file entirely in the browser before
// upload, using a canvas. Keeps large phone-camera photos from eating into
// storage/bandwidth unnecessarily. Non-image files (PDFs) are returned
// unchanged — this only ever touches image/* files.
export function compressImage(
  file,
  { maxDimension = 1200, quality = 0.82 } = {},
) {
  if (!file.type.startsWith("image/")) {
    return Promise.resolve(file);
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      let { width, height } = img;
      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = Math.round((height / width) * maxDimension);
          width = maxDimension;
        } else {
          width = Math.round((width / height) * maxDimension);
          height = maxDimension;
        }
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            // Compression failed for some reason — fall back to the original
            // file rather than blocking the upload entirely.
            return resolve(file);
          }
          const compressedFile = new File([blob], file.name, {
            type: "image/jpeg",
            lastModified: Date.now(),
          });
          // Only use the compressed version if it's actually smaller —
          // small/simple images can sometimes grow slightly after re-encoding.
          resolve(compressedFile.size < file.size ? compressedFile : file);
        },
        "image/jpeg",
        quality,
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Couldn't process this image."));
    };

    img.src = objectUrl;
  });
}
