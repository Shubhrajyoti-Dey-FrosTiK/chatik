import { CreatePresignedURLRequest } from "@/app/api/storage/presigned/route";
import {
  AttachmentClassification,
  MessageAttachment,
} from "@/convex/schema/message";
import { isValidYoutubeURL } from "@/lib/youtube";
import axios from "axios";
import { Infer } from "convex/values";
import { useState } from "react";
import { toast } from "sonner";
import { v4 } from "uuid";

export type ClientSideAttachment = Infer<typeof MessageAttachment> & {
  uploadPercentage: number;
  newFileName: string;
};

export function convertMessageAttachmentToClientSideAttachment(
  messageAttachments: Infer<typeof MessageAttachment>[],
): ClientSideAttachment[] {
  return messageAttachments.map((a) => ({
    ...a,
    uploadPercentage: 100,
    newFileName: v4(),
  }));
}

export function convertClientSideAttachmentToMessageAttachment(
  messageAttachments: ClientSideAttachment[],
): Infer<typeof MessageAttachment>[] {
  return messageAttachments.map((a) => ({
    attachmentClassification: a.attachmentClassification,
    attachmentId: a.attachmentId,
    contentType: a.contentType,
    fileName: a.fileName,
    url: a.url,
  }));
}

export const supportedContentTypes = [
  "application/pdf",
  "image/jpg",
  "image/jpeg",
  "image/png",
];

export function getFileClassification(
  file: File | string,
): AttachmentClassification {
  if (typeof file == "string") {
    if (isValidYoutubeURL(file)) return AttachmentClassification.YOUTUBE;
    return AttachmentClassification.NONE;
  }
  switch (file.type) {
    case "application/pdf":
      return AttachmentClassification.PDF;
    case "image/jpg":
    case "image/jpeg":
    case "image/png":
      return AttachmentClassification.IMAGE;
    case "link/youtube":
      return AttachmentClassification.YOUTUBE;
    default:
      return AttachmentClassification.NONE;
  }
}

export interface UseAttachmentProps {
  initialAttachments: ClientSideAttachment[];
}

export function useAttachments(props?: UseAttachmentProps) {
  const [attachments, setAttachments] = useState<ClientSideAttachment[]>(
    props?.initialAttachments ?? [],
  );

  const handleFileUpload = async (file: File | string) => {
    const attachmentClassification = getFileClassification(file);
    if (attachmentClassification == AttachmentClassification.NONE) {
      toast("Non supported format");
      return;
    }

    if (typeof file == "string") {
      const updatedAttachments = [
        ...attachments,
        {
          attachmentClassification,
          attachmentId: v4(),
          contentType: "link/youtube",
          fileName: "Youtube",
          uploadPercentage: 100,
          url: file,
          newFileName: "",
        },
      ];
      setAttachments(updatedAttachments);
      return;
    }

    const attachment: ClientSideAttachment = {
      attachmentClassification,
      attachmentId: v4(),
      contentType: file.type,
      fileName: file.name,
      uploadPercentage: 0,
      newFileName: "",
      url: "",
    };
    setAttachments((a) => [...a, attachment]);

    const presignedURLRequestBody: CreatePresignedURLRequest = {
      fileName: file.name,
      contentType: file.type,
    };

    // 1. Get presigned POST data from your API
    const res = await axios.post(
      "/api/storage/presigned",
      presignedURLRequestBody,
      {
        headers: {
          "Content-Type": file.type,
        },
      },
    );
    if (!res.data) {
      toast("Something went worng :(");
      return;
    }

    const { url, downloadUrl, newFileName } = res.data;
    setAttachments((a) =>
      a.map((att) =>
        att.attachmentId === attachment.attachmentId
          ? { ...att, url: downloadUrl, newFileName }
          : att,
      ),
    );

    // 3. Upload file directly to GCS
    const uploadRes = await axios.put(url, file, {
      headers: {
        "Content-Type": file.type,
      },
      onUploadProgress(progressEvent) {
        if (progressEvent.total) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total,
          );
          setAttachments((a) =>
            a.map((att) =>
              att.attachmentId === attachment.attachmentId
                ? { ...att, uploadPercentage: percentCompleted }
                : att,
            ),
          );
        }
      },
    });

    if (uploadRes.status !== 200) {
      toast("Upload failed");
    } else {
      toast(`${file.name} uploaded successfully`);
    }
  };

  const handleBatchFileUplaods = async (
    fileList: Array<File | string> | FileList,
  ) => {
    const promises = [];
    for (const file of fileList) {
      promises.push(handleFileUpload(file));
    }
    await Promise.all(promises);
  };

  const handleDeleteAttachmentById = async (id: string) => {
    const attachment = attachments.find((a) => a.attachmentId == id);
    if (!attachment) {
      toast("Attachment not found :/");
      return;
    }

    try {
      await axios.delete("/api/storage/delete", {
        headers: {
          id: attachment.newFileName,
        },
      });
      setAttachments((prev) =>
        prev.filter((a) => a.newFileName != attachment.newFileName),
      );
      toast("Attachment removed successfully");
    } catch (error) {
      console.error(error);
      toast("Some error happened :(");
    }
  };

  const clearAttachments = () => {
    setAttachments([]);
  };

  return {
    handleBatchFileUplaods,
    handleFileUpload,
    attachments,
    handleDeleteAttachmentById,
    clearAttachments,
  };
}
