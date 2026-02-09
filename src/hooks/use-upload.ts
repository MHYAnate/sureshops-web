"use client";

import { useState, useCallback } from "react";
import { uploadService, UploadResponse } from "../services/upload.service";
import toast from "react-hot-toast";

interface UseUploadOptions {
  maxFiles?: number;
  maxSizeMB?: number;
  onSuccess?: (response: UploadResponse) => void;
  onError?: (error: Error) => void;
}

export function useUpload(options: UseUploadOptions = {}) {
  const { maxFiles = 10, maxSizeMB = 10, onSuccess, onError } = options;
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const validateFile = useCallback(
    (file: File): string | null => {
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/webp",
      ];

      if (!allowedTypes.includes(file.type)) {
        return "Only JPG, PNG, GIF, and WebP images are allowed";
      }

      if (file.size > maxSizeMB * 1024 * 1024) {
        return `File size must be less than ${maxSizeMB}MB`;
      }

      return null;
    },
    [maxSizeMB]
  );

  const uploadProductImage = useCallback(
    async (file: File): Promise<UploadResponse | null> => {
      const error = validateFile(file);
      if (error) {
        toast.error(error);
        onError?.(new Error(error));
        return null;
      }

      setUploading(true);
      setProgress(0);

      try {
        // Simulate progress since fetch doesn't support it natively
        const progressInterval = setInterval(() => {
          setProgress((prev) => Math.min(prev + 10, 90));
        }, 200);

        const response = await uploadService.uploadProductImage(file);

        clearInterval(progressInterval);
        setProgress(100);

        onSuccess?.(response);
        return response;
      } catch (err: any) {
        const errorMsg = err.message || "Failed to upload image";
        toast.error(errorMsg);
        onError?.(err);
        return null;
      } finally {
        setUploading(false);
        setTimeout(() => setProgress(0), 500);
      }
    },
    [validateFile, onSuccess, onError]
  );

  const uploadMultipleProductImages = useCallback(
    async (files: File[]): Promise<UploadResponse[]> => {
      if (files.length > maxFiles) {
        toast.error(`Maximum ${maxFiles} files allowed`);
        return [];
      }

      // Validate all files first
      for (const file of files) {
        const error = validateFile(file);
        if (error) {
          toast.error(`${file.name}: ${error}`);
          return [];
        }
      }

      setUploading(true);
      setProgress(0);

      try {
        const results: UploadResponse[] = [];
        for (let i = 0; i < files.length; i++) {
          const response = await uploadService.uploadProductImage(files[i]);
          results.push(response);
          setProgress(Math.round(((i + 1) / files.length) * 100));
        }

        return results;
      } catch (err: any) {
        toast.error(err.message || "Failed to upload images");
        onError?.(err);
        return [];
      } finally {
        setUploading(false);
        setTimeout(() => setProgress(0), 500);
      }
    },
    [maxFiles, validateFile, onError]
  );

  const deleteImage = useCallback(async (publicId: string): Promise<boolean> => {
    try {
      await uploadService.deleteImage(publicId);
      return true;
    } catch (err: any) {
      toast.error("Failed to delete image");
      return false;
    }
  }, []);

  return {
    uploading,
    progress,
    uploadProductImage,
    uploadMultipleProductImages,
    deleteImage,
    validateFile,
  };
}