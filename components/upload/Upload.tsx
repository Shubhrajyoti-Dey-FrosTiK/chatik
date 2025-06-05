"use client";
import { CreatePresignedURLRequest } from "@/app/api/storage/presigned/route";
import axios from "axios";
import { useState } from "react";
import { toast } from "sonner";

export default function UploadComponent() {
  const [imageUrl, setImageUrl] = useState<string>();

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const body: CreatePresignedURLRequest = {
      fileName: file.name,
      contentType: file.type,
    };
    // 1. Get presigned POST data from your API
    const res = await axios.post("/api/storage/presigned", body, {
      headers: {
        "Content-Type": file.type,
      },
    });

    if (!res.data) {
      toast("Something went worng :(");
      return;
    }

    const { url } = res.data;

    console.log(url);
    // 3. Upload file directly to S3
    const uploadRes = await axios.put(url, file, {
      headers: {
        "Content-Type": file.type,
      },
    });

    console.log(uploadRes);

    if (uploadRes.status === 200) {
      setImageUrl(url);
    } else {
      alert("Upload failed");
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      {imageUrl && <img src={imageUrl} />}
    </div>
  );
}
