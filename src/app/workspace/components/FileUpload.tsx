"use client";

import React, { useState } from "react";
import { createWorkLog } from "@/lib/createWorkLog";

interface FileUploadProps {
  projectId: string;
  onFileUploaded?: () => void; // callback to refetch logs
}

export default function FileUpload({
  projectId,
  onFileUploaded,
}: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);

    try {
      // 1️⃣ Upload file to server or cloud (example: Cloudinary)
      const formData = new FormData();
      formData.append("file", file);
      formData.append("projectId", projectId);

      const res = await fetch(`/api/workspace/files`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to upload file");

      const data = await res.json();

      // 2️⃣ Create work log entry
      await createWorkLog({
        projectId,
        title: `Uploaded file: ${file.name}`,
        description: data.url ? `File URL: ${data.url}` : undefined,
      });

      // 3️⃣ Clear file input
      setFile(null);

      // 4️⃣ Trigger refetch logs
      if (onFileUploaded) onFileUploaded();
    } catch (err) {
      console.error("File upload failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-3 items-center mt-4">
      <input
        type="file"
        onChange={handleFileChange}
        className="text-sm text-white/50 file:bg-blue-600 file:text-white file:px-3 file:py-1 file:rounded-lg file:mr-2 file:border-none"
        disabled={loading}
      />
      <button
        onClick={handleUpload}
        disabled={loading || !file}
        className={`bg-blue-600 hover:bg-blue-500 px-5 py-2 rounded-lg text-sm font-medium transition ${
          loading || !file ? "opacity-60 cursor-not-allowed" : ""
        }`}
      >
        {loading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
}
