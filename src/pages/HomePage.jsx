import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { uploadResume } from "../services/api";

const ROLES = [
  {
    num: "01",
    title: "Product",
    desc: "You ship a thing people use.",
    tags: "PM · DESIGNER · ENG",
  },
  {
    num: "02",
    title: "Service",
    desc: "You deliver work for clients.",
    tags: "CONSULTING · AGENCY · OPS",
  },
  {
    num: "03",
    title: "Hybrid",
    desc: "A bit of both — and proud of it.",
    tags: "FOUNDER · SOLO · STUDIO",
  },
];

// home page
function FlowerDrop({
  file,
  onDrop,
  onDragOver,
  onDragLeave,
  isDragging,
  onClick,
}) {
  return (
    <div
      className={`relative cursor-pointer select-none transition-transform duration-200 ${isDragging ? "scale-105" : "hover:scale-105"}`}
      onClick={onClick}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
    >
      <svg width="320" height="320" viewBox="0 0 320 320" fill="none">
        <circle cx="160" cy="72" r="62" fill="#E2AABB" />
        <circle cx="217" cy="103" r="62" fill="#DDA6B7" />
        <circle cx="217" cy="217" r="62" fill="#E2AABB" />
        <circle cx="160" cy="248" r="62" fill="#DDA6B7" />
        <circle cx="103" cy="217" r="62" fill="#E2AABB" />
        <circle cx="103" cy="103" r="62" fill="#DDA6B7" />
        <circle cx="160" cy="160" r="88" fill="#3D5228" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-[#A8C888] text-sm font-light tracking-wider">
          {file
            ? file.name.slice(0, 18) + (file.name.length > 18 ? "…" : "")
            : "click or drop"}
        </span>
        <span
          className="text-white text-2xl mt-0.5"
          style={{
            fontFamily: "'Playfair Display', serif",
            fontStyle: "italic",
          }}
        >
          résumé
        </span>
      </div>
    </div>
  );
}

function SmallFlower({ x, y, size = 1 }) {
  return (
    <svg
      style={{
        position: "absolute",
        top: y,
        left: x,
        width: 50 * size,
        height: 90 * size,
      }}
      viewBox="0 0 50 90"
    >
      <line x1="25" y1="90" x2="25" y2="38" stroke="#5C7A3C" strokeWidth="2" />
      <circle cx="25" cy="30" r="11" fill="#E2AABB" />
      <circle cx="18" cy="24" r="9" fill="#E2AABB" />
      <circle cx="32" cy="24" r="9" fill="#E2AABB" />
      <circle cx="25" cy="18" r="9" fill="#DDA6B7" />
      <circle cx="25" cy="26" r="9" fill="#3D5228" />
    </svg>
  );
}

function StemFlower({ x, y }) {
  return (
    <svg
      style={{ position: "absolute", top: y, left: x, width: 28, height: 72 }}
      viewBox="0 0 28 72"
    >
      <line
        x1="14"
        y1="72"
        x2="14"
        y2="22"
        stroke="#7A9A5A"
        strokeWidth="1.5"
      />
      <circle cx="14" cy="14" r="10" fill="#A8B898" />
      <circle cx="14" cy="12" r="6" fill="#8A9A80" />
    </svg>
  );
}

function LollipopFlower({ x, y }) {
  return (
    <svg
      style={{ position: "absolute", top: y, left: x, width: 38, height: 88 }}
      viewBox="0 0 38 88"
    >
      <line x1="19" y1="88" x2="19" y2="30" stroke="#5C7A3C" strokeWidth="2" />
      <circle cx="19" cy="18" r="14" fill="#D4A830" />
      <circle cx="19" cy="16" r="8" fill="#3D5028" />
    </svg>
  );
}

export default function HomePage() {
  const [selectedRole, setSelectedRole] = useState(0);
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to upload your resume");
      return;
    }
    const dropped = e.dataTransfer.files[0];
    const validTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (dropped && validTypes.includes(dropped.type)) {
      setFile(dropped);
      setError("");
    } else {
      setError("Please drop a PDF or DOCX file.");
    }
  }, []);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleFlowerClick = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to upload your resume");
      return;
    }
    fileInputRef.current?.click();
  };

  const handleFileInput = (e) => {
    const f = e.target.files[0];
    if (f) {
      setFile(f);
      setError("");
    }
  };

  const handleScore = async () => {
    if (!file) {
      setError("Drop a PDF into the flower first ↗");
      return;
    }
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    setLoading(true);
    try {
      await uploadResume(file);
      navigate("/analysis");
    } catch (err) {
      setError(
        err.response?.data?.message || "Upload failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex flex-1 overflow-hidden"
      style={{ height: "calc(100vh - 56px)" }}
    >
      <div
        className="w-1/2 flex flex-col px-12 pt-10 pb-6 overflow-y-auto"
        style={{ background: "#EDE8DC" }}
      >
        <div className="flex items-center gap-3 mb-7">
          <div style={{ width: 28, height: 1, background: "#2B3D2B" }}></div>
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.15em",
              color: "#2B3D2B",
            }}
          >
            STEP 01 · PLANT IT
          </span>
        </div>

        <h1
          style={{
            fontSize: "2.85rem",
            fontWeight: 800,
            color: "#1B3320",
            lineHeight: 1.15,
          }}
          className="mb-3"
        >
          Plant your{" "}
          <em
            style={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 400,
              fontStyle: "italic",
              color: "#1B3320",
            }}
          >
            résumé.
          </em>
          <br />
          Watch it grow.
        </h1>
        <p style={{ color: "#4A5E3A", fontSize: "0.95rem" }} className="mb-9">
          We'll grade it like a fair-but-honest friend.
        </p>

        <p
          style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.15em",
            color: "#8A9A8A",
          }}
          className="mb-4"
        >
          CHOOSE A ROLE TYPE
        </p>

        <div className="flex gap-3 mb-auto">
          {ROLES.map((role, i) => {
            const active = selectedRole === i;
            return (
              <button
                key={i}
                onClick={() => setSelectedRole(i)}
                className="flex-1 rounded-2xl p-4 text-left transition-all"
                style={{
                  background: active ? "#1B3320" : "#FFFFFF",
                  border: `1.5px solid ${active ? "#1B3320" : "#D4CFC5"}`,
                  cursor: "pointer",
                }}
              >
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: active ? "#C4963C" : "#A0AEA0",
                    marginBottom: 6,
                  }}
                >
                  {role.num}
                </div>
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: "0.95rem",
                    color: active ? "#FFFFFF" : "#1B3320",
                    marginBottom: 4,
                  }}
                >
                  {role.title}
                </div>
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: active ? "#A0B8A0" : "#7A8A7A",
                    marginBottom: 12,
                  }}
                >
                  {role.desc}
                </div>
                <div
                  style={{
                    display: "inline-block",
                    fontSize: 9,
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    padding: "3px 8px",
                    borderRadius: 999,
                    background: active ? "#2D4A2D" : "#EDE8DC",
                    color: active ? "#A0C8A0" : "#7A8A7A",
                  }}
                >
                  {role.tags}
                </div>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-4 mt-8">
          <button
            onClick={handleScore}
            disabled={loading}
            className="flex items-center gap-3 transition-all"
            style={{
              background: "#E0D9CB",
              borderRadius: 16,
              padding: "14px 20px",
              border: "none",
              cursor: loading ? "wait" : "pointer",
              opacity: loading ? 0.6 : 1,
            }}
          >
            <span
              style={{ fontWeight: 600, fontSize: "0.95rem", color: "#1B3320" }}
            >
              {loading ? "Scoring…" : "Score it"}
            </span>
            <span
              style={{
                background: "#FFFFFF",
                borderRadius: 10,
                padding: "6px 10px",
                fontSize: "0.9rem",
                color: "#1B3320",
              }}
            >
              →
            </span>
          </button>
          {error ? (
            <p style={{ color: "#B84040", fontSize: "0.82rem" }}>{error}</p>
          ) : file ? (
            <p
              style={{ color: "#3A7A3A", fontSize: "0.82rem", fontWeight: 500 }}
            >
              ✓ {file.name}
            </p>
          ) : (
            <p style={{ color: "#9AAA9A", fontSize: "0.82rem" }}>
              Drop a PDF into the flower first ↗
            </p>
          )}
        </div>
      </div>

      <div
        className="w-1/2 relative flex items-center justify-center overflow-hidden"
        style={{ background: "#C5DBA8" }}
      >
        <SmallFlower x={60} y={28} size={0.95} />
        <StemFlower x="calc(100% - 60px)" y={70} />
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx"
          className="hidden"
          onChange={handleFileInput}
        />
        <FlowerDrop
          file={file}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          isDragging={isDragging}
          onClick={handleFlowerClick}
        />
        <LollipopFlower x="calc(100% - 56px)" y="calc(100% - 110px)" />
        <div
          className="absolute bottom-0 left-0 right-0"
          style={{ height: 2, background: "#B0C898" }}
        >
          <div
            style={{ width: "33%", height: "100%", background: "#4A7A3A" }}
          />
        </div>
      </div>
    </div>
  );
}
