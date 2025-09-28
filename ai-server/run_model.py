from flask import Flask, request, jsonify
from text_generation import Client  # pip install text-generation

app = Flask(__name__)
# You can use Phi-3-mini for faster response (~300-400MB)
client = Client("tiiuae/falcon-7b-instruct")

@app.route("/api/v1/generate", methods=["POST"])
def generate():
    data = request.get_json()
    prompt = data.get("inputs", "")
    result = client.generate(prompt, max_new_tokens=200)
    return jsonify({"generated_text": result.text})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)