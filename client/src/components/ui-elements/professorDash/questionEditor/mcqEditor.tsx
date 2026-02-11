"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";


interface McqEditorProps {
  initialData?: {
    id?: string;
    text?: string;
    image?: string | null;
    options?: { id: string; text: string; isCorrect: boolean }[];
  };
  onCancel: () => void;
  onSave: (question: {
    id?: string;
    type: "mcq";
    text: string;
    image?: string | null;
    options: { id: string; text: string; isCorrect: boolean }[];
  }) => void;
}

export default function McqEditor({
  initialData,
  onSave,
  onCancel,
}: McqEditorProps) {
  const [text, setText] = useState(initialData?.text || "");
  const [image, setImage] = useState(initialData?.image || "");
  const [options, setOptions] = useState(
    initialData?.options || [
      { id: uuidv4(), text: "", isCorrect: false },
      { id: uuidv4(), text: "", isCorrect: false },
      { id: uuidv4(), text: "", isCorrect: false },
      { id: uuidv4(), text: "", isCorrect: false },
    ],
  );
  const [uploading, setUploading] = useState(false);

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
      type: "mcq",
      text,
      image: image || null,
      options,
      id: initialData?.id,
    });
  }

  function updateOptionText(index: number, value: string) {
    const newOptions = [...options];
    newOptions[index].text = value;
    setOptions(newOptions);
  }

  function setCorrectOption(index: number) {
    setOptions(options.map((o, i) => ({ ...o, isCorrect: i === index })));
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

      <div className="space-y-3">
        <Label>Options</Label>
        {options.map((opt, i) => (
          <div key={opt.id} className="flex gap-2 items-center">
            <Input
              value={opt.text}
              onChange={(e) => updateOptionText(i, e.target.value)}
              placeholder={`Option ${i + 1}`}
            />
            <input
              type="radio"
              checked={opt.isCorrect}
              onChange={() => setCorrectOption(i)}
              name="correct-option"
            />
            <Label className="text-sm text-muted-foreground">Correct</Label>
          </div>
        ))}
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
