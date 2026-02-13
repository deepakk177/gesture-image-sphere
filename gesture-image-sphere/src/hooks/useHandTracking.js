import { useEffect, useRef, useState } from 'react';
import { Hands } from '@mediapipe/hands';
import { Camera } from '@mediapipe/camera_utils';

export const useHandTracking = (videoRef, canvasRef) => {
    const [isReady, setIsReady] = useState(false);
    const [landmarks, setLandmarks] = useState(null); // React state for UI overlay? 
    // Actually, for performance, we might want to return a ref or callback.
    // But users of this hook (WebcamTracker) need to draw on canvas.
    // Let's return the latest results via callback prop or internal state management?
    // The provided architecture suggests separating tracking logic.

    // To keep it clean: this hook initializes MP and Camera, and returns detected landmarks via state or ref.
    // Returning state causes re-renders (good for React UI overlay, bad for 60fps logic if heavy).
    // But WebcamTracker needs to draw every frame anyway.

    const lastLandmarks = useRef(null);
    const EMA_ALPHA = 0.3; // Lower = smoother but more lag. 0.3 is a good balance.

    useEffect(() => {
        if (!videoRef.current || !canvasRef.current) return;

        const hands = new Hands({
            locateFile: (file) => {
                return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
            },
        });

        hands.setOptions({
            maxNumHands: 1,
            modelComplexity: 1,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5,
        });

        hands.onResults((results) => {
            const ctx = canvasRef.current.getContext('2d');
            const { width, height } = canvasRef.current;

            ctx.save();
            ctx.clearRect(0, 0, width, height);
            ctx.drawImage(results.image, 0, 0, width, height);

            if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
                let marks = results.multiHandLandmarks[0];

                // Jitter Reduction (EMA Smoothing)
                if (lastLandmarks.current && lastLandmarks.current.length === marks.length) {
                    marks = marks.map((mark, i) => ({
                        x: mark.x * EMA_ALPHA + lastLandmarks.current[i].x * (1 - EMA_ALPHA),
                        y: mark.y * EMA_ALPHA + lastLandmarks.current[i].y * (1 - EMA_ALPHA),
                        z: mark.z * EMA_ALPHA + lastLandmarks.current[i].z * (1 - EMA_ALPHA),
                    }));
                }
                lastLandmarks.current = marks;

                setLandmarks(marks);
                drawSimpleConnectors(ctx, marks);
            } else {
                setLandmarks(null);
                lastLandmarks.current = null;
            }
            ctx.restore();
        });

        let camera = null;

        const startCamera = async () => {
            try {
                if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                    throw new Error("Browser does not support camera access");
                }

                camera = new Camera(videoRef.current, {
                    onFrame: async () => {
                        if (videoRef.current) {
                            try {
                                await hands.send({ image: videoRef.current });
                            } catch (e) {
                                console.error("MediaPipe send error:", e);
                            }
                        }
                    },
                    width: 640,
                    height: 480,
                });

                await camera.start();
                console.log("Camera started successfully");
                setIsReady(true);
            } catch (error) {
                console.error("Camera initialization failed:", error);
                alert("Could not access camera. Please ensure you have granted permission and no other app is using it.");
            }
        };

        startCamera();

        const videoElement = videoRef.current;

        return () => {
            if (camera) {
                const stream = videoElement?.srcObject;
                const tracks = stream?.getTracks();
                tracks?.forEach(track => track.stop());
            }
            hands.close();
        };
    }, [videoRef, canvasRef]);

    return { landmarks, isReady };
};

// Simple drawing helper to avoid dependency
const drawSimpleConnectors = (ctx, landmarks) => {
    const points = landmarks.map(l => ({
        x: l.x * ctx.canvas.width,
        y: l.y * ctx.canvas.height
    }));

    ctx.fillStyle = '#00FF00';
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;

    // Draw points
    points.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3, 0, 2 * Math.PI);
        ctx.fill();
    });

    // Draw basic skeleton (simplified)
    // ... (Optional, skipping full skeleton for brevity/perf if not strictly required by "Hand landmark overlay" which can just be points)
    // "Hand landmark dots" is sufficient, "Finger connection lines" requested.
    // Okay, I'll add lines.

    const connections = [
        [0, 1], [1, 2], [2, 3], [3, 4], // Thumb
        [0, 5], [5, 6], [6, 7], [7, 8], // Index
        [0, 9], [9, 10], [10, 11], [11, 12], // Middle
        [0, 13], [13, 14], [14, 15], [15, 16], // Ring
        [0, 17], [17, 18], [18, 19], [19, 20], // Pinky
        [5, 9], [9, 13], [13, 17] // Palm
    ];

    ctx.beginPath();
    connections.forEach(([i, j]) => {
        const p1 = points[i];
        const p2 = points[j];
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
    });
    ctx.stroke();
};
