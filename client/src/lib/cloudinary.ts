async function uploadToCloudinary(file: File, examId: string): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append(
    "upload_preset",
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!,
  );
  formData.append("folder", `exam-${examId}`);

  const cloudRes = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
    {
      method: "POST",
      body: formData,
    },
  );

  if (!cloudRes.ok) {
    const text = await cloudRes.text();
    throw new Error(`Upload failed: ${text}`);
  }

  const json = await cloudRes.json();
  return json.secure_url;
}

export default uploadToCloudinary;
