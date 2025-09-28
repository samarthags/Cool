from flask import Flask, request, jsonify
from text_generation import Client  # pip install text-generation

app = Flask(__name__)

# Use a small model suitable for free Render instance (~300MB)
client = Client("tiiuae/phi-3-mini")  

@app.route("/api/v1/generate", methods=["POST"])
def generate():
    data = request.get_json()
    prompt = data.get("inputs", "")
    result = client.generate(prompt, max_new_tokens=200)
    return jsonify({"generated_text": result.text})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)