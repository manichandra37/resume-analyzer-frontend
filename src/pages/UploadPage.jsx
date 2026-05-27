import { useState } from "react";
import { uploadResume } from "../services/api";

function UploadPage() {
  const [file, setFile] = useState(null);

  const handleUpload = async () => {
    try {
      const response = await uploadResume(file);
      alert("Upload Successful");
      setUploadFile(file);
    } catch (error) {
      if (error.response) {
        alert(error.response.data.message);
      } else {
        alert("There was an error in uoloading the file");
      }
    }
  };
  return (
    <div>
      <h1>Upload Resume</h1>
      <input
        type="file"
        placeholder="Upload Resume"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <br />
      <br />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
}

export default UploadPage;
