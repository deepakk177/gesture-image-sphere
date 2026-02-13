import { create } from 'zustand';

export const useGalleryStore = create((set) => ({
    images: [],
    isUploading: false,

    setImages: (newImages) => set({ images: newImages }),
    addImages: (newImages) => set((state) => ({ images: [...state.images, ...newImages] })),
    clearImages: () => set({ images: [] }),
    setUploading: (status) => set({ isUploading: status }),
}));
