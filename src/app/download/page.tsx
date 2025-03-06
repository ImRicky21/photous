"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function DownloadPage() {
  const [images, setImages] = useState<string[]>([]);
  const [bgColor, setBgColor] = useState<string>("#ffffff"); // Warna background default
  const [gap, setGap] = useState<number>(20); // Default gap antar foto
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const storedImages = sessionStorage.getItem("capturedImages");
    if (storedImages) {
      setImages(JSON.parse(storedImages));
    }
  }, []);

  // 🔽 Menggabungkan Foto secara Vertikal dengan Resolusi Asli
  const mergeImages = async () => {
    if (images.length < 3 || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Load semua gambar untuk mendapatkan dimensi asli
    const loadedImages = await Promise.all(
      images.slice(0, 3).map((src) => {
        return new Promise<HTMLImageElement>((resolve) => {
          const img = new Image();
          img.src = src;
          img.onload = () => resolve(img);
        });
      })
    );

    const imgWidth = loadedImages[0].width; // Gunakan lebar gambar pertama
    const imgHeight = loadedImages[0].height; // Gunakan tinggi gambar pertama
    const totalHeight = imgHeight * 3 + gap * 2; // Total tinggi + gap

    canvas.width = imgWidth;
    canvas.height = totalHeight;

    // Set warna background
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Gambar foto dengan gap antar foto
    loadedImages.forEach((img, index) => {
      ctx.drawImage(img, 0, index * (imgHeight + gap), imgWidth, imgHeight);
    });
  };

  // 🔽 Mengunduh Gambar Gabungan
  const downloadMergedImage = () => {
    if (!canvasRef.current) return;
    const link = document.createElement("a");
    link.href = canvasRef.current.toDataURL("image/png");
    link.download = "merged_photo_vertical.png";
    link.click();
  };

  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-2xl font-bold mb-4">Download Foto</h1>

      {images.length < 3 ? (
        <p className="text-gray-500">
          Minimal 3 foto diperlukan untuk penggabungan.
        </p>
      ) : (
        <>
          {/* Color Picker & Gap Input */}
          <div className="flex items-center gap-4 mb-4">
            <label className="text-gray-700">Warna Background:</label>
            <input
              type="color"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              className="w-10 h-10 border rounded-md"
            />
            <label className="text-gray-700">Gap:</label>
            <input
              type="number"
              value={gap}
              min="0"
              max="100"
              onChange={(e) => setGap(Number(e.target.value))}
              className="w-16 border p-1 rounded-md"
            />
          </div>

          {/* Canvas untuk Menampilkan Hasil Gabungan */}
          <canvas ref={canvasRef} className="border shadow-md mb-4" />

          {/* Tombol Gabungkan & Unduh */}
          <button
            onClick={mergeImages}
            className="bg-green-500 text-white px-4 py-2 rounded mb-2"
          >
            Gabungkan Foto
          </button>
          <button
            onClick={downloadMergedImage}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Download Foto Gabungan
          </button>
        </>
      )}

      {/* 🔙 Kembali ke Kamera */}
      <Link href="/" className="mt-4 text-blue-600 underline">
        Kembali ke Kamera
      </Link>
    </div>
  );
}
