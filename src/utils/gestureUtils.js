// Basic vector math helpers
const distance = (p1, p2) => {
    return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
};

export const detectPinch = (landmarks) => {
    if (!landmarks || landmarks.length === 0) return false;

    // Thumb tip (4) and Index finger tip (8)
    const thumbTip = landmarks[4];
    const indexTip = landmarks[8];

    const dist = distance(thumbTip, indexTip);

    // Adjust threshold based on testing, usually 0.05 is a good start for normalized coords
    return dist < 0.05;
};

export const detectOpenHand = (landmarks) => {
    if (!landmarks) return false;

    // Check if fingertips are extended (above their PIP joints in Y axis generally, 
    // but hand rotation matters. A simpler heuristic is distance from wrist being large for all tips)
    // Or check if fingers are "straight".
    // Let's use a simple heuristic: All 4 fingers (index to pinky) are extended.
    // Tip (8, 12, 16, 20) should be further from wrist (0) than PIP (6, 10, 14, 18).

    const wrist = landmarks[0];
    const tips = [8, 12, 16, 20];
    const pips = [6, 10, 14, 18];

    // Also check thumb extension? Maybe just 4 fingers is enough for "Open Hand" vs "Fist/Pinch"
    let extendedCount = 0;

    for (let i = 0; i < 4; i++) {
        const tip = landmarks[tips[i]];
        const pip = landmarks[pips[i]];

        // Distance check from wrist 
        if (distance(wrist, tip) > distance(wrist, pip)) {
            extendedCount++;
        }
    }

    // Also make sure fingers are spread apart? Not strictly required by prompt.
    return extendedCount === 4;
};


// Swipe detection needs history, so it returns a state or string
// We'll manage history in the component/hook using this helper
export const getWristPosition = (landmarks) => {
    return landmarks[0];
};
