import React, { useRef } from 'react'; // React is used implicitly
import { useHandTracking } from '../hooks/useHandTracking';
import { useGestures } from '../hooks/useGestures';

const WebcamTracker = () => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    // Initialize tracking
    const { landmarks } = useHandTracking(videoRef, canvasRef);

    // Initialize gesture logic (consumes landmarks)
    useGestures(landmarks);

    return (
        <div className="relative w-full h-full flex justify-center items-center bg-black/50 overflow-hidden">
            {/* 
        Video is hidden (display: none) but needed for MediaPipe. 
        We rely on the canvas drawing in useHandTracking for the visual feedback.
      */}
            <video
                ref={videoRef}
                className="absolute w-full h-full object-cover transform scale-x-[-1]"
                style={{ display: 'none' }}
                playsInline
                muted
            />

            {/* The canvas displays the video frame + landmarks drawn by useHandTracking */}
            <canvas
                ref={canvasRef}
                className="w-full h-full transform scale-x-[-1]"
            />
        </div>
    );
};

export default WebcamTracker;
