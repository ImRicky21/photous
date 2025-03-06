/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-const */
"use client";
import { Download, SwitchCamera } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

export default function CameraComponent() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // 🚀 Mulai Kamera
  useEffect(() => {
    async function startCamera() {
      try {
        setIsLoading(true);
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode },
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            setIsLoading(false);
          };
        }
      } catch (err) {
        setError("Gagal mengakses kamera. Pastikan izin diberikan.");
      }
    }

    startCamera();

    return () => {
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream)
          .getTracks()
          .forEach((track) => track.stop());
      }
    };
  }, [facingMode]);

  // 📸 Capture Gambar
  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        return canvasRef.current.toDataURL("image/png");
      }
    }
    return null;
  };

  // 📷 Ambil 3 Foto dalam Interval 3 Detik dengan Timer untuk Setiap Foto
  const startCaptureSequence = async () => {
    setCapturedImages([]);
    let images: string[] = [];

    for (let i = 0; i < 3; i++) {
      // 🔄 Setiap sesi, reset timer ke 3 detik
      setCountdown(3);

      for (let j = 3; j > 0; j--) {
        setCountdown(j);
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      setCountdown(null); // Hapus angka setelah timer selesai
      await new Promise((resolve) => setTimeout(resolve, 500)); // Tunggu sedikit sebelum capture

      const img = captureImage();
      if (img) {
        images.push(img);
        setCapturedImages([...images]);
      }

      // ⏳ Tunggu 1 detik sebelum mulai timer berikutnya (jeda antar foto)
      if (i < 2) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }
    sessionStorage.setItem("capturedImages", JSON.stringify(images));
  };

  // 🔄 Ganti Kamera
  const switchCamera = () => {
    setFacingMode(facingMode === "user" ? "environment" : "user");
  };

  return (
    <div className="transition-all flex sm:flex-row flex-col justify-around p-4 relative">
      {error && <p className="text-red-500">{error}</p>}

      {/* 🎥 Live Kamera */}
      <motion.div
        className=" transition flex flex-col items-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <button
          onClick={startCaptureSequence}
          className=" text-white rounded  rounded-xl"
        >
          <div className="relative">
            {isLoading ? (
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-slate-400 text-white text-5xl px-4 py-2 rounded-full"></div>
            ) : null}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-[600px] h-[500px]"
            />
            {countdown !== null && (
              <div className=" transition absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-slate-400 text-white text-5xl px-4 py-2 rounded-full">
                {countdown}
              </div>
            )}
          </div>
        </button>

        {/* 📸 Tombol Capture */}
        <div className="flex  ">
          <button
            onClick={switchCamera}
            className="bg-green-500 text-white px-4 py-2 rounded hidden"
          >
            <SwitchCamera />
          </button>
          <Link href={"/download"}>
            <button className="bg-green-500 text-white p-4 rounded-xl">
              <Download />
            </button>
          </Link>
        </div>
      </motion.div>

      {/* 📷 Tampilkan Hasil Capture */}
      <motion.div
        className={`mt-4 flex flex-col gap-3 items-center pt-10 bg-slate-800 ${
          capturedImages.length > 0 ? "block" : "hidden"
        } rounded-xl`}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="flex flex-col flex-wrap justify-center gap-4 px-4 ">
          {capturedImages.map((image, index) => (
            <motion.img
              key={index}
              src={image}
              alt={`Captured ${index + 1}`}
              className="border w-[250px] h-[150px] transition ease-in-out duration-300 border border-slate-600"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          ))}
        </div>
        <h1
          className={`text-white text-4xl font-bold ${
            capturedImages.length === 3 ? "block" : "hidden"
          } mb-3`}
        >
          PhotoUs
        </h1>
      </motion.div>
      {/* 🎯 Canvas untuk Menyimpan Gambar */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
