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
    <div className="min-h-screen bg-[#faf6f1] p-8">
      <h1 className="text-4xl font-['Playfair_Display'] text-[#2d3a2e] text-center mb-8 ">
        Dashboard
      </h1>

      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl mx-auto mb-8">
        <select
          className="w-full p-3 border border-gray-200 rounded-xl mb-4"
          value={selectedResumeId}
          onChange={(e) => setSelectedResumeId(e.target.value)}
        >
          <option value="">Select a Resume</option>
          {resumes.map((r) => (
            <option key={r.id} value={r.id}>
              {r.resumeName}
            </option>
          ))}
        </select>

        <textarea
          className="w-full p-3 border border-gray-200 rounded-xl mb-4 h-40"
          placeholder="Paste job description here"
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
        />

        <select
          className="w-full p-3 border border-gray-200 rounded-xl mb-4"
          value={templateType}
          onChange={(e) => setTemplateType(e.target.value)}
        >
          <option value="">Select Template</option>
          <option value="service">Service</option>
          <option value="product">Product</option>
          <option value="hybrid">Hybrid</option>
        </select>

        <button
          className="w-full p-3 bg-[#3d5a3e] text-white rounded-xl hover:bg-[#2d4a2e] transition disabled:opacity-50"
          onClick={handleAnalysis}
          disabled={loading}
        >
          {loading ? "Analyzing..." : "Analyze"}
        </button>
      </div>

      {loading && (
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl mx-auto mb-8 text-center">
          <h2 className="text-2xl font-['Playfair_Display'] text-[#2d3a2e] mb-4 font-['Playfair_Display']">
            Analyzing your resume...
          </h2>
          <p className="text-gray-500 italic">{joke}</p>
        </div>
      )}

      {report && (
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl mx-auto">
          <h2 className="text-2xl font-['Playfair_Display'] text-[#2d3a2e] text-center mb-4">
            Analysis Report
          </h2>

          <p className="text-6xl font-bold text-[#3d5a3e] text-center mb-6">
            {report.score}
          </p>

          <p className="text-gray-500 text-center mb-6">{report.summary}</p>

          <p className="text-sm text-gray-400 mb-1">
            Job Title: {report.jobTitle}
          </p>
          <p className="text-sm text-gray-400 mb-1">
            Template: {report.templateType}
          </p>
          <p className="text-sm text-gray-400 mb-6">
            Analyzed: {report.analyzedAt}
          </p>

          <h3 className="text-lg font-semibold text-[#2d3a2e] mb-2">
            Matched Skills
          </h3>
          <div className="flex flex-wrap gap-2 mb-6">
            {report.matchedSkills.split(", ").map((skill, index) => (
              <span
                key={index}
                className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
              >
                {skill}
              </span>
            ))}
          </div>

          <h3 className="text-lg font-semibold text-[#2d3a2e] mb-2">
            Missed Skills
          </h3>
          <div className="flex flex-wrap gap-2 mb-6">
            {report.missedSkills.split(", ").map((skill, index) => (
              <span
                key={index}
                className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm"
              >
                {skill}
              </span>
            ))}
          </div>

          <button
            className="w-full p-3 bg-[#3d5a3e] text-white rounded-xl hover:bg-[#2d4a2e] transition font-['Playfair_Display']"
            onClick={handleDownload}
          >
            Download Improved Resume
          </button>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
