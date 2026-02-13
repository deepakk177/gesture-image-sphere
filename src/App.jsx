import React, { Suspense } from 'react';
import SphereGallery from './components/SphereGallery';
import WebcamTracker from './components/WebcamTracker';
import ImageUploader from './components/ImageUploader';
import { Loader2 } from 'lucide-react';

const App = () => {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black select-none">
      {/* 3D Scene Layer */}
      <div className="absolute inset-0 z-0">
        <Suspense fallback={
          <div className="flex items-center justify-center w-full h-full text-white/50">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        }>
          <SphereGallery />
        </Suspense>
      </div>

      {/* UI Overlay Layer */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {/* Top Left: Uploader */}
        <div className="pointer-events-auto">
          <ImageUploader />
        </div>

        {/* Bottom Center: Webcam Preview */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 
                        w-48 h-36 bg-black/80 rounded-2xl overflow-hidden 
                        border border-white/10 shadow-2xl backdrop-blur-sm pointer-events-auto">
          <WebcamTracker />
        </div>
      </div>

      {/* Add global styles for premium feel if needed, but Tailwind handles most */}
    </div>
  );
};

export default App;
