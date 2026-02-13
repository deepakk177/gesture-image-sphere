import React, { useMemo, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useTexture, Billboard, Text, Plane } from '@react-three/drei';
import * as THREE from 'three';
import { useGalleryStore } from '../store/useGalleryStore';
import { gestureState } from '../controllers/GestureController';
import { fibonacciSpherePoints } from '../utils/fibonacciSphere';

// Individual Image Component
/* eslint-disable react/prop-types */
const GalleryImage = ({ url, position, rotation }) => {
    // Use suspense-safe texture loading or simple state
    // useTexture might suspend, better to wrap in Suspense or handling
    // BUT: useTexture expects a url string.
    // We'll trust the url is valid.
    const texture = useTexture(url);

    // Auto-dispose texture on unmount is handled by three/fiber cache usually, 
    // but explicitly we might want to maximize memory efficiency. 
    // useTexture handles basic caching.

    // Requirements: "Dispose old textures/materials when replaced"
    // React Three Fiber handles disposal of objects removed from the tree automatically.

    return (
        <Billboard position={position}>
            <Plane args={[1, 1]}>
                <meshBasicMaterial map={texture} side={THREE.DoubleSide} transparent />
            </Plane>
        </Billboard>
    );
};

// Main Scene Component to handle logic
const Scene = () => {
    const groupRef = useRef();
    const images = useGalleryStore((state) => state.images);


    // Generate points when images change
    const points = useMemo(() => {
        return fibonacciSpherePoints(images.length, 5); // Radius 5
    }, [images.length]);

    // Animation Loop
    useFrame((state, delta) => {
        if (!groupRef.current) return;
        const { camera } = state;

        // 1. Auto Rotation (Idle)
        const idleSpeed = 0.2 * delta;

        // Apply velocity from gestures
        if (gestureState.isPaused) {
            // Do nothing, effectively freezing the globe
        } else if (Math.abs(gestureState.rotationVelocity.y) > 0.0001) {
            groupRef.current.rotation.y += gestureState.rotationVelocity.y;
            gestureState.rotationVelocity.y *= 0.96; // Smooth deceleration
        } else {
            // Smoothly blend back into idle rotation
            groupRef.current.rotation.y += idleSpeed;
        }

        // 4. Zoom Control
        const targetZ = Math.max(2, Math.min(15, gestureState.zoomLevel));
        // Buttery smooth lerp (0.08)
        camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.08);
    });

    return (
        <group ref={groupRef}>
            {images.map((img, idx) => (
                /* We need Suspense boundary for useTexture, or pre-load. 
                   For simplicity with user upload, we can avoid Suspense if we load textures manually 
                   or use a simpler texture loader in useEffect.
                   But useTexture with Suspense is the "React Way". 
                   I'll wrap Scene in Suspense in the parent.
                */
                <GalleryImage
                    key={idx} // Using index is okay here as we replace all on upload
                    url={img}
                    position={points[idx]}
                />
            ))}
            {images.length === 0 && (
                <Billboard position={[0, 0, 0]}>
                    <Text fontSize={0.5} color="white" anchorX="center" anchorY="middle">
                        Upload Images to Start
                    </Text>
                </Billboard>
            )}
        </group>
    );
};

const SphereGallery = () => {
    return (
        <div className="w-full h-full bg-gradient-to-b from-gray-900 to-black">
            <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
                <React.Suspense fallback={null}>
                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} />
                    <Scene />
                </React.Suspense>
            </Canvas>
        </div>
    );
};
/* eslint-enable react/prop-types */

export default SphereGallery;
