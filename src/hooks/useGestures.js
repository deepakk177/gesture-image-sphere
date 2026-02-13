import { useEffect, useRef } from 'react';
import { detectPinch, detectOpenHand, getWristPosition } from '../utils/gestureUtils';
import { updateGestureState, addRotationVelocity, setZoomLevel } from '../controllers/GestureController';

export const useGestures = (landmarks) => {
    const lastGestureTime = useRef(0);
    const wristHistory = useRef([]);
    const prevWristX = useRef(null);

    const ZOOM_SPEED = 0.8;
    const ROTATION_IMPULSE = 1.0;
    const CONTINUOUS_ROTATION_SPEED = 0.05;
    const SWIPE_COOLDOWN = 500;
    const STILL_THRESHOLD = 0.002;
    const MOVE_THRESHOLD = 0.01;

    useEffect(() => {
        if (!landmarks) {
            updateGestureState('isPaused', false);
            return;
        }

        const now = Date.now();
        const wrist = getWristPosition(landmarks);

        // 1. Gesture Detection
        const isPinching = detectPinch(landmarks);
        const isOpen = detectOpenHand(landmarks);

        updateGestureState('isInteracting', isPinching || isOpen);

        // 2. Continuous Zoom / Tilt / Pause
        if (isPinching) {
            setZoomLevel(ZOOM_SPEED);
            updateGestureState('isPaused', false);
        } else if (isOpen) {
            // Check for movement vs stillness
            if (prevWristX.current !== null) {
                const dx = wrist.x - prevWristX.current;

                if (Math.abs(dx) < STILL_THRESHOLD) {
                    // Hand is OPEN and STILL
                    updateGestureState('isPaused', true);
                    // Kill any residual velocity for immediate stop
                    updateGestureState('rotationVelocity', { x: 0, y: 0 });
                } else {
                    updateGestureState('isPaused', false);

                    if (dx < -MOVE_THRESHOLD) {
                        // Moving hand RIGHT (mirrored x decreasing)
                        // Rotate Clockwise (Negative Y)
                        addRotationVelocity(0, -CONTINUOUS_ROTATION_SPEED);
                    } else if (dx > MOVE_THRESHOLD) {
                        // Moving hand LEFT (mirrored x increasing)
                        // Rotate Anticlockwise (Positive Y)
                        addRotationVelocity(0, CONTINUOUS_ROTATION_SPEED);
                    }
                }
            }
            // Still allow zoom while tracking movement? 
            // User requested "Open Hand: Zoom In" earlier.
            // I'll keep the zoom logic too.
            setZoomLevel(-ZOOM_SPEED);
        } else {
            updateGestureState('isPaused', false);
        }

        prevWristX.current = wrist.x;

        // 3. Discrete Swipe (Momentum)
        wristHistory.current.push({ x: wrist.x, time: now });
        if (wristHistory.current.length > 10) wristHistory.current.shift();

        if (now - lastGestureTime.current > SWIPE_COOLDOWN) {
            if (wristHistory.current.length > 3) {
                const first = wristHistory.current[0];
                const last = wristHistory.current[wristHistory.current.length - 1];
                const timeDiff = last.time - first.time;

                if (timeDiff > 20 && timeDiff < 400) {
                    const dx = last.x - first.x;
                    if (Math.abs(dx) > 0.08) {
                        if (dx < 0) {
                            addRotationVelocity(0, -ROTATION_IMPULSE);
                        } else {
                            addRotationVelocity(0, ROTATION_IMPULSE);
                        }
                        lastGestureTime.current = now;
                        wristHistory.current = [];
                    }
                }
            }
        }

    }, [landmarks]);
};
