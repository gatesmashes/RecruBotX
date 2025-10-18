// src/pages/AnalyzeResume.jsx
import React, { useState } from "react";
import { Upload, FileText, Loader2 } from "lucide-react";

const AnalyzeResume = () => {
  const [file, setFile] = useState(null);
  const [jobDesc, setJobDesc] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0] || null);
  };

  const handleAnalyze = async () => {
    setError("");
    setAnalysis(null);
    if (!file) {
      setError("Please upload a CV file (.pdf or .docx).");
      return;
    }

    // If job description empty, confirm
    if (!jobDesc.trim()) {
      const ok = window.confirm("No job description provided. Continue with resume-only analysis?");
      if (!ok) return;
    }

    setLoading(true);

    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("job_description", jobDesc);

      const res = await fetch("http://localhost:5000/api/analyze", {
        method: "POST",
        body: fd,
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || `HTTP ${res.status}`);
      }

      const payload = await res.json();

      // payload might be an array, or { data: [...] }, or { error: ... }
      if (payload && payload.error) {
        throw new Error(payload.error);
      }

      const arr = Array.isArray(payload) ? payload : (payload.data || payload);

      // map values (check app.py: outputs tuple of 9 elements)
      const sim_raw = arr && arr[0] ? parseFloat(arr[0]) : 0;
      // app.py returns sim_pct already as e.g., 83.0 — check and normalize:
      const similarity = sim_raw > 1 ? sim_raw : sim_raw * 100;

      const resultObj = {
        similarity: Number(similarity.toFixed(2)),
        verdictHtml: arr && arr[1] ? arr[1] : "",
        missingFormatted: arr && arr[2] ? arr[2] : "",
        suggestionsText: arr && arr[3] ? arr[3] : "",
        jobSuggestions: arr && arr[4] ? arr[4] : "",
        projectsSection: arr && arr[5] ? arr[5] : "",
        projectFit: arr && arr[6] ? arr[6] : "",
        resumeKeywords: arr && arr[7] ? arr[7] : "",
        jdKeywords: arr && arr[8] ? arr[8] : "",
      };

      setAnalysis(resultObj);
    } catch (err) {
      console.error("Analyze error:", err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50 flex justify-center items-start px-4 py-10">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-4xl">
        <h1 className="text-3xl font-bold text-center text-blue-700 mb-2">CV Screening & Job Match Analyzer</h1>
        <p className="text-center text-gray-500 mb-6">Upload your resume and paste the job description to analyze compatibility.</p>

        {/* Upload */}
        <div className="border-2 border-dashed border-blue-300 rounded-xl p-6 flex flex-col items-center justify-center mb-4 hover:bg-blue-50 transition">
          <Upload className="w-10 h-10 text-blue-600 mb-3" />
          <input id="fileUpload" type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} className="hidden" />
          <label htmlFor="fileUpload" className="cursor-pointer text-blue-600 font-medium hover:underline">
            {file ? file.name : "Click to upload your CV (.pdf / .docx)"}
          </label>
        </div>

        {/* Job description */}
        <div className="mb-4">
          <label className="block font-semibold mb-2">Job Description (optional)</label>
          <textarea value={jobDesc} onChange={(e) => setJobDesc(e.target.value)} className="w-full p-3 rounded border h-40" placeholder="Paste the job description here..." />
        </div>

        <div className="flex gap-4">
          <button onClick={handleAnalyze} disabled={loading} className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2">
            {loading ? <><Loader2 className="animate-spin w-5 h-5" /> Analyzing...</> : <><FileText className="w-5 h-5" /> Analyze Resume</>}
          </button>
        </div>

        {error && <div className="mt-4 text-red-600">{error}</div>}

        {/* Results */}
        {analysis && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">📊 AI Analysis Results</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
                <h3 className="text-lg font-semibold text-blue-700 mb-2">🎯 Similarity Score</h3>
                <div className="w-full bg-gray-200 h-4 rounded-full overflow-hidden">
                  <div className="h-4 bg-blue-600 rounded-full" style={{ width: `${analysis.similarity}%` }} />
                </div>
                <p className="mt-2 font-medium">{analysis.similarity}% match</p>
                <div className="mt-3 text-sm" dangerouslySetInnerHTML={{ __html: analysis.verdictHtml || "" }} />
              </div>

              <div className="bg-green-50 p-6 rounded-xl border border-green-200">
                <h3 className="text-lg font-semibold text-green-700 mb-2">✅ Keyword Match</h3>
                <pre className="text-sm whitespace-pre-line">{analysis.missingFormatted || "No missing keywords found."}</pre>
              </div>

              <div className="bg-yellow-50 p-6 rounded-xl border border-yellow-200">
                <h3 className="text-lg font-semibold text-yellow-700 mb-2">💡 Suggestions</h3>
                <pre className="text-sm whitespace-pre-line">{analysis.suggestionsText || "No suggestions."}</pre>
              </div>

              <div className="bg-purple-50 p-6 rounded-xl border border-purple-200">
                <h3 className="text-lg font-semibold text-purple-700 mb-2">💼 Potential Job Roles</h3>
                <pre className="text-sm whitespace-pre-line">{analysis.jobSuggestions || "No roles found."}</pre>
              </div>

              <div className="bg-pink-50 p-6 rounded-xl border border-pink-200 md:col-span-2">
                <h3 className="text-lg font-semibold text-pink-700 mb-2">🧠 Top Resume Keywords</h3>
                <pre className="text-sm whitespace-pre-line">{analysis.resumeKeywords || "No keywords."}</pre>
                <div className="mt-4">
                  <h4 className="font-semibold">Job Description Keywords</h4>
                  <pre className="text-sm whitespace-pre-line">{analysis.jdKeywords || "No keywords."}</pre>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-200 md:col-span-2">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">🧾 Extracted Projects Section</h3>
                <pre className="text-sm whitespace-pre-line">{analysis.projectsSection || "No Projects section found."}</pre>
                <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2">🔍 Project Fit Verdict</h3>
                <div dangerouslySetInnerHTML={{ __html: analysis.projectFit || "No project fit verdict." }} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyzeResume;
