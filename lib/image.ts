const MAX_DIMENSION = 1600;
const QUALITY = 0.82;

export type CompressedImage = {
  data: string;
  mimeType: "image/webp" | "image/jpeg" | "image/png";
  previewUrl: string;
};

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("unsupported_file"));
    };
    image.src = url;
  });
}

export async function compressScreenshot(file: File): Promise<CompressedImage> {
  const image = await loadImage(file);
  const scale = Math.min(1, MAX_DIMENSION / Math.max(image.width, image.height));
  const width = Math.max(1, Math.round(image.width * scale));
  const height = Math.max(1, Math.round(image.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("unsupported_file");
  }
  context.drawImage(image, 0, 0, width, height);

  const preferWebp = canvas.toDataURL("image/webp", QUALITY);
  const dataUrl =
    preferWebp.startsWith("data:image/webp")
      ? preferWebp
      : canvas.toDataURL("image/jpeg", QUALITY);

  const [prefix, data] = dataUrl.split(",");
  if (!prefix || !data) {
    throw new Error("unsupported_file");
  }

  const mimeType = prefix.includes("image/webp")
    ? "image/webp"
    : prefix.includes("image/png")
      ? "image/png"
      : "image/jpeg";

  return {
    data,
    mimeType,
    previewUrl: dataUrl,
  };
}
