"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface DescriptiveEditorProps {
  initialData?: {
    id?: string;
    text?: string;
    image?: string | null;
  };
  onSave: (question: {
    id?: string;
    type: "descriptive";
    text: string;
    image?: string | null;
  }) => void;
}

export default function DescriptiveEditor({
  initialData,
  onSave,
}: DescriptiveEditorProps) {
  const [text, setText] = useState(initialData?.text || "");
  const [image, setImage] = useState(initialData?.image || "");
  const [uploading, setUploading] = useState(false);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const url = await fetch(`/api/cloudinary-upload`).then((res) => res.json());
    setImage(url.secure_url);
    setUploading(false);
  }

  function submit() {
    onSave({
      type: "descriptive",
      text,
      image: image || null,
      id: initialData?.id,
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

      <div className="flex justify-end gap-2">
        <Button onClick={submit}>Save</Button>
      </div>
    </div>
  );
}
