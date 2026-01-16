
import React, { useRef, useEffect, useState } from 'react';
import { Camera, RefreshCw, Circle } from 'lucide-react';

const CameraApp: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let stream: MediaStream | null = null;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setIsActive(true);
        }
      } catch (err) {
        setError('Camera access denied or unavailable.');
        console.error(err);
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="h-full bg-black flex flex-col">
      <div className="flex-1 relative flex items-center justify-center overflow-hidden">
        {error ? (
          <div className="text-white text-center p-8 bg-gray-800 rounded-xl">
            <Camera size={48} className="mx-auto mb-4 text-gray-500" />
            <p className="font-medium">{error}</p>
          </div>
        ) : (
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted 
            className="w-full h-full object-cover scale-x-[-1]" 
          />
        )}
      </div>
      
      <div className="h-24 bg-gray-900/80 mac-blur flex items-center justify-center gap-12 border-t border-white/10">
        <button className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center text-white hover:bg-gray-700 transition-colors">
          <RefreshCw size={24} />
        </button>
        <button className="w-16 h-16 rounded-full border-4 border-white flex items-center justify-center group active:scale-95 transition-transform">
          <div className="w-12 h-12 bg-white rounded-full group-hover:scale-90 transition-transform" />
        </button>
        <button className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center text-white hover:bg-gray-700 transition-colors">
          <Circle size={24} fill="currentColor" />
        </button>
      </div>
    </div>
  );
};

export default CameraApp;
