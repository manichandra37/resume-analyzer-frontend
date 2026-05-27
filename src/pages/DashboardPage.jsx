import { useEffect, useState } from "react";
import { analyzeResume, downloadResume, getMyResumes } from "../services/api";

const DashboardPage = () => {
  const [resumes, setResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [templateType, setTemplateType] = useState("");
  const [report, setReport] = useState(null);

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const response = await getMyResumes();
        setResumes(response.data);
      } catch (error) {
        alert("Failed to load Resume");
      }
    };
    fetchResumes();
  }, []);

  const handleAnalysis = async () => {
    try {
      const response = await analyzeResume(
        selectedResumeId,
        jobDescription,
        templateType,
      );
      console.log(response.data);
      setReport(response.data);
      alert("Analysis sucessfull.");
    } catch (error) {
      if (error.response) {
        alert(error.response.data.message);
      } else {
        alert("Server not reachable");
      }
    }
  };

  const handleDownload = async () => {
    try {
      const response = await downloadResume(report.id);

      // Create a temporary link to trigger file download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "improved-resume.docx");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      alert("Download failed");
    }
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <select
        value={selectedResumeId}
        onChange={(e) => setSelectedResumeId(e.target.value)}
      >
        <option value=""> Select a Resume</option>
        {resumes.map((r) => (
          <option key={r.id} value={r.id}>
            {r.resumeName}
          </option>
        ))}
      </select>
      <textarea
        placeholder="Paste job description here"
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
      />
      <select
        value={templateType}
        onChange={(e) => setTemplateType(e.target.value)}
      >
        <option value="">Select Template</option>
        <option value="service">Service</option>
        <option value="product">Product</option>
        <option value="hybrid">Hybrid</option>
      </select>
      <button onClick={handleAnalysis}>Analyze</button>
      <button onClick={handleDownload}>Download Improved Resume</button>
      {report && (
        <div>
          <h2>Analysis Report</h2>
          <p>Score: {report.score}</p>
          <p>Job Title: {report.jobTitle}</p>
          <p>Template Type: {report.templateType}</p>
          <p>Summary: {report.summary}</p>
          <p>Analyzed At: {report.analyzedAt}</p>

          <h3>Matched Skills</h3>
          <ul>
            {report.matchedSkills.split(", ").map((skill, index) => (
              <li key={index}>{skill}</li>
            ))}
          </ul>

          <h3>Missed Skills</h3>
          <ul>
            {report.missedSkills.split(", ").map((skill, index) => (
              <li key={index}>{skill}</li>
            ))}
          </ul>

          <h3>Improved Content</h3>
          <p>{report.improvedContent}</p>
        </div>
      )}{" "}
    </div>
  );
};

export default DashboardPage;
