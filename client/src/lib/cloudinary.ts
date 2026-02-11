async function uploadToCloudinary(file: File, examId: string): Promise<string> {
  
  const res = await fetch(`/api/cloudinary-sign?folder=exam-${examId}`);
  if (!res.ok) throw new Error("Failed to get signature");
  const data = await res.json();

  
  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", data.api_key);
  formData.append("timestamp", data.timestamp.toString());
  formData.append("signature", data.signature);
  formData.append("folder", data.folder);
  formData.append("public_id", data.public_id);

  
  const cloudRes = await fetch(
    `https://api.cloudinary.com/v1_1/${data.cloud_name}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!cloudRes.ok) {
    const text = await cloudRes.text();
    throw new Error(`Upload failed: ${text}`);
  }

  const json = await cloudRes.json();
  return json.secure_url; 
}

export default uploadToCloudinary