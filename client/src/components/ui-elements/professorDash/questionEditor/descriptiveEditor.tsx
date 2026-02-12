"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface DescriptiveEditorProps {
  initialData?: {
    id?: string;
    text?: string;
    image?: string | null;
    answer?: string;
  };
  onCancel: () => void;
  onSave: (question: {
    id?: string;
    type: "descriptive";
    text: string;
    image?: string | null;
    answer: string;
  }) => void;
}

export default function DescriptiveEditor({
  initialData,
  onSave,
  onCancel,
}: DescriptiveEditorProps) {
  const [text, setText] = useState(initialData?.text || "");
  const [image, setImage] = useState(initialData?.image || "");
  const [uploading, setUploading] = useState(false);
  const [answer, setAnswer] = useState(initialData?.answer || "");

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!,
    );

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        },
      );

      const data = await res.json();
      if (!res.ok) throw new Error("Upload failed");

      setImage(data.secure_url);

      toast.success("Image uploaded successfully");
    } catch (err) {
      toast.error("Upload failed. Try again.");
    }

    setUploading(false);
  }

  function submit() {
    onSave({
      type: "descriptive",
      text,
      image: image || null,
      id: initialData?.id,
      answer,
    });
  }

  return (
    <div className="space-y-6 p-6">
      <div className="space-y-2">
        <Label>Question</Label>
        <Input value={text} onChange={(e) => setText(e.target.value)} />
      </div>

      <div className="space-y-2">
        <Label>Image (optional)</Label>
        <Input type="file" accept="image/*" onChange={handleUpload} />
        {uploading && <div className="text-sm">Uploading...</div>}
        {image && (
          <img src={image} className="max-h-40 rounded" alt="Question" />
        )}
      </div>

      <div className="space-y-2">
        <Label>Answer</Label>
        <textarea
          placeholder="Write your answer here..."
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          className="w-full min-h-[120px] p-4 border border-dashed rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={submit}>Save</Button>
      </div>
    </div>
  );
}
