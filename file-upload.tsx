import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { CloudUpload, X, Image } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  onFilesChange: (files: File[]) => void;
  maxFiles?: number;
  acceptedTypes?: string[];
}

export default function FileUpload({ 
  onFilesChange, 
  maxFiles = 5,
  acceptedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
}: FileUploadProps) {
  const [files, setFiles] = useState<File[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = [...files, ...acceptedFiles].slice(0, maxFiles);
    setFiles(newFiles);
    onFilesChange(newFiles);
  }, [files, maxFiles, onFilesChange]);

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
  onFilesChange(newFiles);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': acceptedTypes.map(type => type.split('/')[1])
    },
    maxFiles: maxFiles - files.length,
    disabled: files.length >= maxFiles
  });

  return (
    <div>
      <label className="block text-sm font-medium text-neutral-700 mb-2">
        Upload Images ({files.length}/{maxFiles})
      </label>
      
      {files.length < maxFiles && (
        <div
          {...getRootProps()}
          className={cn(
            "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
            isDragActive
              ? "border-primary bg-primary/5"
              : "border-neutral-300 hover:border-primary"
          )}
        >
          <input {...getInputProps()} />
          <CloudUpload className="mx-auto h-8 w-8 text-neutral-400 mb-2" />
          <p className="text-neutral-600">
            {isDragActive
              ? "Drop the files here..."
              : "Drop files here or click to upload"
            }
          </p>
          <p className="text-xs text-neutral-500 mt-1">
            PNG, JPG, WebP up to 10MB
          </p>
        </div>
      )}

      {files.length > 0 && (
        <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-3">
          {files.map((file, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square bg-neutral-100 rounded-lg overflow-hidden">
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Upload ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-3 w-3" />
              </button>
              <p className="text-xs text-neutral-600 mt-1 truncate">{file.name}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}