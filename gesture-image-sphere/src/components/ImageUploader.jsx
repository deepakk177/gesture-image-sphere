import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Loader2 } from 'lucide-react';
import { useGalleryStore } from '../store/useGalleryStore';
import { processImage } from '../utils/imageProcessor';

const ImageUploader = () => {
    const { setImages, isUploading, setUploading } = useGalleryStore();

    const onDrop = useCallback(async (acceptedFiles) => {
        if (acceptedFiles.length === 0) return;

        setUploading(true);

        // Process all images
        try {
            // Limit to 100 images
            const filesToProcess = acceptedFiles.slice(0, 100);

            const processedImages = await Promise.all(
                filesToProcess.map(file => processImage(file))
            );

            // Replace existing images
            setImages(processedImages);
        } catch (error) {
            console.error("Error processing images:", error);
        } finally {
            setUploading(false);
        }
    }, [setImages, setUploading]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png', '.webp']
        },
        multiple: true
    });

    return (
        <div className="absolute top-4 left-4 z-50">
            <div
                {...getRootProps()}
                className={`
          flex items-center gap-2 px-4 py-2 rounded-full 
          bg-white/10 backdrop-blur-md border border-white/20 
          hover:bg-white/20 transition-all cursor-pointer
          ${isDragActive ? 'ring-2 ring-blue-500' : ''}
        `}
            >
                <input {...getInputProps()} />
                {isUploading ? (
                    <Loader2 className="w-5 h-5 animate-spin text-white" />
                ) : (
                    <Upload className="w-5 h-5 text-white" />
                )}
                <span className="text-white font-medium text-sm">
                    {isUploading ? 'Processing...' : 'Upload Gallery'}
                </span>
            </div>

            <div className="mt-2 text-xs text-white/50 ml-2 font-mono">
                PINCH TO ZOOM • MOVE TO ROTATE
            </div>
        </div>
    );
};

export default ImageUploader;
