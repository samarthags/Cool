const express = require("express");
const fetch = require("node-fetch"); // Node >=18 has native fetch
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

// Chat API
app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    // Call Python AI server
    const response = await fetch("http://localhost:5000/api/v1/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ inputs: userMessage }),
    });

    const data = await response.json();
    res.json({ reply: data.generated_text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ reply: "Error connecting to AI server." });
  }
});

app.listen(PORT, () => console.log(`Node.js server running on port ${PORT}`));