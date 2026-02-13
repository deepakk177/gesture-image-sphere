// Singleton state for high-frequency updates (avoiding React renders)
export const gestureState = {
    rotationVelocity: { x: 0, y: 0 },
    zoomLevel: 10, // Target Camera Z
    isInteracting: false,
    isPaused: false,
    lastGestureTime: 0,
};

// Update helpers
export const updateGestureState = (key, value) => {
    gestureState[key] = value;
};

export const addRotationVelocity = (x, y) => {
    gestureState.rotationVelocity.x += x;
    gestureState.rotationVelocity.y += y;
};

export const setZoomLevel = (delta) => {
    // Clamp zoom between 2 and 15
    const newZoom = Math.max(2, Math.min(15, gestureState.zoomLevel + delta));
    gestureState.zoomLevel = newZoom;
};
