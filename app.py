from flask import Flask, render_template
from pathlib import Path
import json

app = Flask(__name__)
BASE = Path(__file__).resolve().parent

def load_data():
    return json.loads((BASE / "site_data.json").read_text(encoding="utf-8"))

@app.route("/")
def home():
    return render_template("index.html", data=load_data())

@app.route("/health")
def health():
    return {"status": "ok"}

if __name__ == "__main__":
    app.run(debug=True)
