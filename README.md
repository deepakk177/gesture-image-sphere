# Gesture Image Sphere

A futuristic spatial image showreel where users explore their personal gallery using natural hand gestures in real time.

## 🚀 Features

- **Webcam POV + Hand Tracking**: Real-time hand tracking using MediaPipe.
- **Gesture Controls**:
  - **Pinch**: Zoom Out
  - **Open Hand**: Zoom In
  - **Swipe Left/Right**: Rotate the sphere
- **3D Spherical Gallery**: Images arranged in a Fibonacci sphere using Three.js.
- **Auto-Optimized Uploads**: Drag & drop multiple images; automatic cropping (1:1) and resizing (512x512).
- **Smooth Animations**: Interpolated camera movement and rotational inertia.

## 🛠 Tech Stack

- **Frontend**: React + Vite
- **3D Engine**: Three.js / React Three Fiber
- **Computer Vision**: MediaPipe Hands
- **Styling**: Tailwind CSS
- **State Management**: Zustand

## 📦 Local Setup

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd gesture-image-sphere
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Start development server:**

   ```bash
   npm run dev
   ```

4. **Build for production:**

   ```bash
   npm run build
   ```

## 🌐 Deployment Guide (Vercel)

This project is optimized for Vercel deployment.

1. Push your project to GitHub.
2. Go to [Vercel](https://vercel.com) and import the repository.
3. Configure the settings:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Deploy!

> **Note**: Access to the webcam requires the site to be served over **HTTPS**. Vercel provides this automatically.

## 🎮 How to Use

1. **Allow Camera Access**: When prompted, allow the browser to access your webcam.
2. **Upload Images**: Click the upload button in the top-left corner to add images to the gallery.
3. **Explore**:
   - Hold your hand up to the camera.
   - **Pinch** (thumb to index) to fly back (Zoom Out).
   - **Open** your hand wide to fly closer (Zoom In).
   - **Still Open Hand**: Pause rotation.
   - **Move Open Hand Left/Right**: Continuously rotate.
   - **Swipe** your hand horizontally for quick momentum.

---

Created with ❤️ using React Three Fiber & MediaPipe.
