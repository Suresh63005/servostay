import React from "react";
import axios from "axios";

const ImageUploader = ({ onUploadSuccess, uploadPreset = "infinitum-task", cloudName = "dhr4xnftl" }) => {
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const imageFormData = new FormData();
    imageFormData.append("file", file);
    imageFormData.append("upload_preset", uploadPreset);
    imageFormData.append("cloud_name", cloudName);

    try {
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        imageFormData
      );
      const imageUrl = res.data.secure_url;
      if (onUploadSuccess) {
        onUploadSuccess(imageUrl);
      }
      console.log("Image uploaded successfully:", imageUrl);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="border rounded-lg p-2 mt-1 w-full h-14"
        style={{ borderRadius: "8px", border: "1px solid #EAEAFF" }}
      />
    </div>
  );
};

export default ImageUploader;
