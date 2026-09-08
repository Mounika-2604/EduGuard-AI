import { useState } from "react";

function App() {
  const [form, setForm] = useState({
    eye_gaze_angle: 10,
    audio_db: 35,
    tab_switches: 0,
    gaze_rolling_10s: 10,
    audio_rolling_10s: 40,
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: Number(e.target.value) });
  };

  const checkRisk = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://panopticon-backend.onrender.com/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      alert("Error reaching backend: " + err.message);
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif", maxWidth: "500px", margin: "auto" }}>
      <h1>🛡️ EduGuard AI</h1>
      <p>Proctoring Risk Checker</p>
      {Object.keys(form).map((key) => (
        <div key={key} style={{ marginBottom: "1rem" }}>
          <label>{key}</label>
          <input
            type="number"
            name={key}
            value={form[key]}
            onChange={handleChange}
            style={{ width: "100%", padding: "0.5rem" }}
          />
        </div>
      ))}
      <button onClick={checkRisk} disabled={loading} style={{ padding: "0.75rem 1.5rem" }}>
        {loading ? "Checking..." : "Check Risk"}
      </button>
      {result && (
        <div style={{ marginTop: "1.5rem", padding: "1rem", border: "1px solid #ccc" }}>
          <p><b>Probability:</b> {(result.cheating_probability * 100).toFixed(1)}%</p>
          <p>{result.flagged ? "🚨 FLAGGED" : "✅ Cleared"}</p>
        </div>
      )}
    </div>
  );
}

export default App;