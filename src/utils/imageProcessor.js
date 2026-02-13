export const processImage = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");
                const size = 512;

                canvas.width = size;
                canvas.height = size;

                // Auto-center crop logic
                const minDim = Math.min(img.width, img.height);
                const startX = (img.width - minDim) / 2;
                const startY = (img.height - minDim) / 2;

                ctx.drawImage(
                    img,
                    startX,
                    startY,
                    minDim,
                    minDim,
                    0,
                    0,
                    size,
                    size
                );

                // Convert to data URL (JPEG for smaller size, or PNG)
                // Using PNG for quality, user said "optimized Three.js texture", data URL is easiest for state
                // In real massive app, createObjectURL is better, but dataURL is safer for store persistence if needed later
                // Let's use createObjectURL for memory efficiency if possible, but store needs strings.
                // DataURL is fine for < 100 images.
                resolve(canvas.toDataURL("image/png"));
            };
            img.onerror = reject;
            img.src = event.target.result;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};
