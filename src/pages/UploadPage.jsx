import { useState } from "react";
import { uploadResume } from "../services/api";
import { useNavigate } from "react-router-dom";

function UploadPage() {
  const [file, setFile] = useState(null);

  const handleUpload = async () => {
    try {
      const response = await uploadResume(file);
      alert("Upload Successful");
      setFile(file);
      window.location.href = "/analysis";
    } catch (error) {
      if (error.response) {
        alert(error.response.data.message);
      } else {
        alert("There was an error in uoloading the file");
      }
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#faf6f1]">
      <div className="bg-white rounded-2xl shadow-lg p-10 w-full max-w-md text-center">
        <h1 className="text-3xl font-['Playfair_Display'] text-[#2d3a2e] mb-6">
          Upload Resume
        </h1>
        <input
          className="mb-4 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#3d5a3e] file:text-white file:cursor-pointer"
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <button
          className="w-full p-3 bg-[#3d5a3e] text-white rounded-xl hover:bg-[#2d4a2e] transition font-['Playfair_Display']"
          onClick={handleUpload}
        >
          Upload
        </button>
      </div>
    </div>
  );
}

export default UploadPage;
