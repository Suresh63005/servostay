import React, { useState } from "react";
import axios from "axios";

const MultiImageUploader = ({ onUploadSuccess, uploadPreset = "infinitum-task", cloudName = "dhr4xnftl" }) => {
  const [uploading, setUploading] = useState(false);

  const handleMediaUpload = async (e) => {
    const files = Array.from(e.target.files); 
    if (!files.length) return;

    setUploading(true); 

    const mediaArray = [];
    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", uploadPreset);

        // Determine the upload endpoint based on file type
        const fileType = file.type.split("/")[0];
        const uploadEndpoint =
          fileType === "video"
            ? `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`
            : `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

        // Upload each file
        const res = await axios.post(uploadEndpoint, formData);
        mediaArray.push(res.data.secure_url);
      }

      if (onUploadSuccess) {
        onUploadSuccess(mediaArray);
      }
      console.log("Uploaded media:", mediaArray);
    } catch (error) {
      console.error("Error uploading media:", error);
    } finally {
      setUploading(false); // Indicate the upload process has ended
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*,video/*"
        multiple
        onChange={handleMediaUpload}
        className="border rounded-lg p-2 mt-1 w-full h-14"
        style={{ borderRadius: "8px", border: "1px solid #EAEAFF" }}
      />
      {uploading && <p>Uploading files, please wait...</p>}
    </div>
  );
};

export default MultiImageUploader;
