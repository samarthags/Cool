const express = require("express");
const path = require("path");
const { spawn } = require("child_process");

const app = express();
const PORT = process.env.PORT || 3000;

// Spawn Python AI server
const py = spawn("python", ["../ai-server/run_model.py"], { stdio: "inherit" });

py.on("close", (code) => {
  console.log(`Python AI server exited with code ${code}`);
});

app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend"))); // serve frontend

// Helper to call Python AI server with retries
async function callAI(message, retries = 10) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch("http://localhost:5000/api/v1/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inputs: message }),
      });
      const data = await res.json();
      return data;
    } catch (err) {
      console.log(`Python AI not ready, retrying... (${i + 1})`);
      await new Promise(r => setTimeout(r, 2000)); // wait 2 seconds
    }
  }
  return { generated_text: "AI server is still loading, please try again in a few seconds." };
}

// Chat API
app.post("/chat", async (req, res) => {
  const userMessage = req.body.message || "";
  const aiResponse = await callAI(userMessage);
  res.json({ reply: aiResponse.generated_text });
});

app.listen(PORT, () => console.log(`Node.js server running on port ${PORT}`));