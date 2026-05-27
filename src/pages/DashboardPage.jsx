import { useEffect, useState } from "react";
import { analyzeResume, downloadResume, getMyResumes } from "../services/api";
import { useNavigate } from "react-router-dom";

const DashboardPage = () => {
  const [resumes, setResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [templateType, setTemplateType] = useState("");
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [joke, setJoke] = useState("");

  const jokes = [
    // Programming
    "Why do programmers prefer dark mode? Because light attracts bugs!",
    "A SQL query walks into a bar, sees two tables, and asks... 'Can I JOIN you?'",
    "Why did the developer go broke? Because he used up all his cache!",
    "There are only 10 types of people: those who understand binary and those who don't.",
    "Why do Java developers wear glasses? Because they can't C#!",
    "How do you comfort a JavaScript bug? You console it!",
    "Why was the JavaScript developer sad? He didn't Node how to Express himself!",
    "What's a programmer's favorite hangout place? Foo Bar!",

    // Software Engineering
    "99 little bugs in the code, 99 little bugs... Take one down, patch it around... 127 little bugs in the code.",
    "It works on my machine! Then we'll ship your machine.",
    "The best thing about a boolean is even if you're wrong, you're only off by a bit.",
    "A programmer's wife tells him: 'Go to the store and get a loaf of bread. If they have eggs, get a dozen.' He comes home with 12 loaves.",
    "Programming is like writing a book... except if you miss a single comma on page 126, the whole thing makes no sense.",
    "There's no place like 127.0.0.1",
    "I don't always test my code, but when I do, I do it in production.",
    "Code never lies. Comments sometimes do.",

    // Dark humor
    "My code doesn't have bugs. It just develops random features.",
    "Debugging is like being the detective in a crime movie where you're also the murderer.",
    "I told my wife she was drawing her eyebrows too high. She looked surprised.",
    "I have a joke about recursion. I have a joke about recursion. I have a joke about recursion...",
    "The cloud is just someone else's computer having a bad day.",
    "My resume says 5 years of experience. My GitHub says otherwise.",

    // Company jokes
    "Google: We know everything about you. Facebook: We told everyone about you. Amazon: We're delivering what you thought about.",
    "Microsoft bought GitHub. Developers: 'Time to switch to GitLab.' Also developers: *still on GitHub*",
    "Why did the startup fail? Because they spent 6 months choosing a JavaScript framework.",
    "Amazon's interview process has 5 rounds. By round 3, you've aged enough for the senior position.",
    "Apple removed the headphone jack for courage. They removed the charger for bravery. Soon they'll remove the phone for heroism.",
    "Netflix: Are you still watching? Someone's daughter: No, she fell asleep 3 episodes ago.",
    "Elon Musk renamed Twitter to X because even the bird was tired of the tweets.",

    // Resume & Interview
    "My resume is just a list of things I Googled successfully.",
    "Interviewer: Where do you see yourself in 5 years? Me: Still waiting for npm install to finish.",
    "Recruiter: We need 10 years of experience in a 3-year-old framework.",
    "My biggest weakness? I'm too honest. Interviewer: I don't think that's a weakness. Me: I don't care what you think.",
    "LinkedIn: Congrats on your new role! Me: I just updated my profile picture.",
    "Interviewer: What's your expected salary? Developer: I expect it to be paid on time.",
    "My code review feedback: 'Looks good to me.' Translation: I didn't read it.",
    "Stack Overflow should count as a co-author on my resume.",
  ];
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     navigate("/");
//   };
  const getRandomJoke = () => {
    return jokes[Math.floor(Math.random() * jokes.length)];
  };

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
    setLoading(true);
    setJoke(getRandomJoke());

    // Change joke every 4 seconds while waiting
    const jokeInterval = setInterval(() => {
      setJoke(getRandomJoke());
    }, 6000);

    try {
      const response = await analyzeResume(
        selectedResumeId,
        jobDescription,
        templateType,
      );
      setReport(response.data);
    } catch (error) {
      if (error.response) {
        alert(error.response.data.message);
      } else {
        alert("Server not reachable");
      }
    } finally {
      setLoading(false);
      clearInterval(jokeInterval);
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
      <button onClick={handleAnalysis} disabled={loading}>
        {loading ? "Analyzing..." : "Analyze"}
      </button>
      <button onClick={handleDownload}>Download Improved Resume</button>
      {loading && (
        <div>
          <h2>Analyzing your resume...</h2>
          <p>{joke}</p>
        </div>
      )}
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
