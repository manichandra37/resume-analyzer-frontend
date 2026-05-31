import { useEffect, useState } from "react";
import { analyzeResume, downloadResume, getMyResumes } from "../services/api";

const TEMPLATES = [
  { num: "01", value: "product", title: "Product", desc: "You ship a thing people use.", tags: "PM · DESIGNER · ENG" },
  { num: "02", value: "service", title: "Service", desc: "You deliver work for clients.", tags: "CONSULTING · AGENCY · OPS" },
  { num: "03", value: "hybrid",  title: "Hybrid",  desc: "A bit of both — and proud of it.", tags: "FOUNDER · SOLO · STUDIO" },
];

const JOKES = [
  "Why do programmers prefer dark mode? Because light attracts bugs!",
  "It works on my machine! Then we'll ship your machine.",
  "Stack Overflow should count as a co-author on my résumé.",
  "My code doesn't have bugs. It just develops random features.",
  "There's no place like 127.0.0.1",
  "I have a joke about recursion. I have a joke about recursion…",
  "My résumé is just a list of things I Googled successfully.",
  "Debugging is being the detective in a crime movie where you're also the murderer.",
];

function ResultFlower({ score }) {
  // Petals "grow" with score
  const petalScale = 0.4 + (Math.min(score, 100) / 100) * 0.6;
  return (
    <svg width="220" height="220" viewBox="0 0 320 320" style={{ transition: "all 600ms ease" }}>
      <g transform={`translate(160 160) scale(${petalScale}) translate(-160 -160)`}>
        <circle cx="160" cy="72"  r="62" fill="#E2AABB"/>
        <circle cx="217" cy="103" r="62" fill="#DDA6B7"/>
        <circle cx="217" cy="217" r="62" fill="#E2AABB"/>
        <circle cx="160" cy="248" r="62" fill="#DDA6B7"/>
        <circle cx="103" cy="217" r="62" fill="#E2AABB"/>
        <circle cx="103" cy="103" r="62" fill="#DDA6B7"/>
      </g>
      <circle cx="160" cy="160" r="88" fill="#3D5228"/>
      <text
        x="160" y="155"
        textAnchor="middle"
        fill="#A8C888"
        fontSize="11"
        style={{ letterSpacing: "0.15em" }}
      >
        SCORE
      </text>
      <text
        x="160" y="190"
        textAnchor="middle"
        fill="#FFFFFF"
        fontSize="44"
        fontWeight="700"
      >
        {score}
      </text>
    </svg>
  );
}

const DashboardPage = () => {
  const [resumes, setResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [templateType, setTemplateType] = useState("product");
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [joke, setJoke] = useState("");
  const [error, setError] = useState("");

  const getRandomJoke = () => JOKES[Math.floor(Math.random() * JOKES.length)];

  useEffect(() => {
    (async () => {
      try {
        const response = await getMyResumes();
        setResumes(response.data);
        if (response.data.length > 0) setSelectedResumeId(response.data[0].id);
        localStorage.setItem("resumeCount", String(response.data.length));
      } catch {
        setError("Failed to load résumés.");
      }
    })();
  }, []);

  const handleAnalysis = async () => {
    if (!selectedResumeId) { setError("Select a résumé first."); return; }
    if (!jobDescription.trim()) { setError("Paste a job description."); return; }
    setError("");
    setLoading(true);
    setJoke(getRandomJoke());
    const interval = setInterval(() => setJoke(getRandomJoke()), 6000);

    try {
      const response = await analyzeResume(selectedResumeId, jobDescription, templateType);
      setReport(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Server not reachable");
    } finally {
      setLoading(false);
      clearInterval(interval);
    }
  };

  const handleDownload = async () => {
    try {
      const response = await downloadResume(report.id);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "improved-resume.docx");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch {
      setError("Download failed.");
    }
  };

  return (
    <div className="flex flex-1 overflow-hidden" style={{ height: "calc(100vh - 56px)" }}>
      {/* Left: form */}
      <div className="w-1/2 flex flex-col px-12 pt-10 pb-6 overflow-y-auto" style={{ background: "#EDE8DC" }}>
        <div className="flex items-center gap-3 mb-6">
          <div style={{ width: 28, height: 1, background: "#2B3D2B" }}></div>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", color: "#2B3D2B" }}>
            STEP 02 · GROW IT
          </span>
        </div>

        <h1 style={{ fontSize: "2.4rem", fontWeight: 800, color: "#1B3320", lineHeight: 1.15, marginBottom: 6 }}>
          Match it to a{" "}
          <em
            style={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 400,
              fontStyle: "italic",
              color: "#1B3320",
            }}
          >
            role.
          </em>
        </h1>
        <p style={{ color: "#4A5E3A", fontSize: "0.92rem", marginBottom: 24 }}>
          We'll score the fit and highlight what to plant next.
        </p>

        <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", color: "#8A9A8A" }} className="mb-2">
          YOUR RÉSUMÉ
        </p>
        <select
          value={selectedResumeId}
          onChange={(e) => setSelectedResumeId(e.target.value)}
          style={{
            width: "100%",
            padding: "12px 14px",
            background: "#FFFFFF",
            border: "1.5px solid #D4CFC5",
            borderRadius: 12,
            outline: "none",
            fontSize: "0.9rem",
            color: "#1B3320",
            marginBottom: 16,
          }}
        >
          <option value="">— Select a résumé —</option>
          {resumes.map((r) => (
            <option key={r.id} value={r.id}>{r.resumeName}</option>
          ))}
        </select>

        <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", color: "#8A9A8A" }} className="mb-2">
          JOB DESCRIPTION
        </p>
        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste the job posting here…"
          style={{
            width: "100%",
            padding: "12px 14px",
            background: "#FFFFFF",
            border: "1.5px solid #D4CFC5",
            borderRadius: 12,
            outline: "none",
            fontSize: "0.9rem",
            color: "#1B3320",
            minHeight: 120,
            resize: "vertical",
            marginBottom: 16,
            fontFamily: "inherit",
          }}
        />

        <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", color: "#8A9A8A" }} className="mb-3">
          ROLE TYPE
        </p>
        <div className="flex gap-3 mb-6">
          {TEMPLATES.map((t) => {
            const active = templateType === t.value;
            return (
              <button
                key={t.value}
                onClick={() => setTemplateType(t.value)}
                className="flex-1 rounded-2xl p-3 text-left"
                style={{
                  background: active ? "#1B3320" : "#FFFFFF",
                  border: `1.5px solid ${active ? "#1B3320" : "#D4CFC5"}`,
                  cursor: "pointer",
                }}
              >
                <div style={{ fontSize: 10, fontWeight: 700, color: active ? "#C4963C" : "#A0AEA0", marginBottom: 4 }}>
                  {t.num}
                </div>
                <div style={{ fontWeight: 700, fontSize: "0.9rem", color: active ? "#FFFFFF" : "#1B3320" }}>
                  {t.title}
                </div>
                <div style={{ fontSize: "0.7rem", color: active ? "#A0B8A0" : "#7A8A7A", marginTop: 2 }}>
                  {t.desc}
                </div>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-4 mt-auto">
          <button
            onClick={handleAnalysis}
            disabled={loading}
            className="flex items-center gap-3"
            style={{
              background: "#1B3320",
              borderRadius: 16,
              padding: "13px 22px",
              border: "none",
              cursor: loading ? "wait" : "pointer",
              color: "#FFFFFF",
              opacity: loading ? 0.6 : 1,
            }}
          >
            <span style={{ fontWeight: 600, fontSize: "0.95rem" }}>
              {loading ? "Analyzing…" : "Analyze"}
            </span>
            <span style={{ background: "#FFFFFF", color: "#1B3320", borderRadius: 10, padding: "6px 10px", fontSize: "0.9rem" }}>
              →
            </span>
          </button>
          {error && <p style={{ color: "#B84040", fontSize: "0.82rem" }}>{error}</p>}
        </div>
      </div>

      {/* Right: result panel */}
      <div
        className="w-1/2 relative flex flex-col items-center justify-center overflow-y-auto px-10"
        style={{ background: "#C5DBA8" }}
      >
        {!report && !loading && (
          <div className="text-center">
            <ResultFlower score={0} />
            <p
              style={{
                marginTop: 18,
                fontFamily: "'Playfair Display', serif",
                fontStyle: "italic",
                color: "#1B3320",
                fontSize: "1.05rem",
              }}
            >
              your garden awaits
            </p>
            <p style={{ color: "#4A5E3A", fontSize: "0.85rem", marginTop: 6 }}>
              fill in the left side and tap analyze ↖
            </p>
          </div>
        )}

        {loading && (
          <div className="text-center">
            <div
              style={{
                animation: "spin 4s linear infinite",
                display: "inline-block",
              }}
            >
              <ResultFlower score={50} />
            </div>
            <p
              style={{
                marginTop: 20,
                fontFamily: "'Playfair Display', serif",
                fontStyle: "italic",
                color: "#1B3320",
                fontSize: "1.05rem",
                maxWidth: 360,
              }}
            >
              {joke}
            </p>
            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {report && (
          <div style={{ width: "100%", maxWidth: 460 }} className="py-8">
            <div className="flex flex-col items-center mb-6">
              <ResultFlower score={report.score} />
            </div>

            <div
              style={{
                background: "#FFFFFF",
                borderRadius: 20,
                padding: 20,
                border: "1.5px solid #B0C898",
                marginBottom: 14,
              }}
            >
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", color: "#8A9A8A", marginBottom: 6 }}>
                SUMMARY
              </p>
              <p style={{ color: "#1B3320", fontSize: "0.92rem", lineHeight: 1.5 }}>
                {report.summary}
              </p>
              <div style={{ borderTop: "1px dashed #D4CFC5", marginTop: 14, paddingTop: 12, display: "flex", gap: 16, fontSize: "0.75rem", color: "#7A8A7A" }}>
                <span>📌 {report.jobTitle}</span>
                <span>🌱 {report.templateType}</span>
              </div>
            </div>

            <div
              style={{
                background: "#FFFFFF",
                borderRadius: 20,
                padding: 20,
                border: "1.5px solid #B0C898",
                marginBottom: 14,
              }}
            >
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", color: "#3A7A3A", marginBottom: 10 }}>
                ✓ MATCHED SKILLS
              </p>
              <div className="flex flex-wrap gap-2">
                {(report.matchedSkills || "").split(", ").filter(Boolean).map((skill, i) => (
                  <span
                    key={i}
                    style={{
                      background: "#E5F0D7",
                      color: "#1B3320",
                      padding: "4px 10px",
                      borderRadius: 999,
                      fontSize: "0.75rem",
                      fontWeight: 500,
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div
              style={{
                background: "#FFFFFF",
                borderRadius: 20,
                padding: 20,
                border: "1.5px solid #B0C898",
                marginBottom: 18,
              }}
            >
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", color: "#B84040", marginBottom: 10 }}>
                ✗ MISSED SKILLS
              </p>
              <div className="flex flex-wrap gap-2">
                {(report.missedSkills || "").split(", ").filter(Boolean).map((skill, i) => (
                  <span
                    key={i}
                    style={{
                      background: "#F5DDDD",
                      color: "#7A2020",
                      padding: "4px 10px",
                      borderRadius: 999,
                      fontSize: "0.75rem",
                      fontWeight: 500,
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <button
              onClick={handleDownload}
              className="w-full flex items-center justify-center gap-3"
              style={{
                background: "#1B3320",
                borderRadius: 16,
                padding: "13px 22px",
                border: "none",
                cursor: "pointer",
                color: "#FFFFFF",
              }}
            >
              <span style={{ fontWeight: 600, fontSize: "0.95rem" }}>Download improved résumé</span>
              <span style={{ background: "#FFFFFF", color: "#1B3320", borderRadius: 10, padding: "6px 10px", fontSize: "0.9rem" }}>↓</span>
            </button>
          </div>
        )}

        <div
          className="absolute bottom-0 left-0 right-0"
          style={{ height: 2, background: "#B0C898" }}
        >
          <div style={{ width: report ? "100%" : "66%", height: "100%", background: "#4A7A3A", transition: "width 600ms ease" }} />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
