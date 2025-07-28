from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
from werkzeug.utils import secure_filename
from app.routes.auth import auth_bp
from app.routes.generate import bp as generate_bp
from app.routes.upload import bp as upload_bp

app = Flask(__name__)
CORS(app)

# Define where templates are stored
UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), "uploads", "templates")
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
# Register blueprints
app.register_blueprint(auth_bp)
app.register_blueprint(generate_bp)
app.register_blueprint(upload_bp)

@app.route('/')
def home():
    return "Hello, Creo Certificate Backend!"

# Upload template endpoint
@app.route("/api/upload-template", methods=["POST"])
def upload_template():
    file = request.files.get("template")
    template_type = request.form.get("type")  # ojt, immersion, custom

    if not file or not template_type:
        return jsonify({"error": "Missing file or type"}), 400

    if not file.filename.endswith((".ppt", ".pptx")):
        return jsonify({"error": "Only .ppt and .pptx files allowed"}), 400

    # Save the file with a fixed name: ojt.pptx, immersion.pptx, or custom.pptx
    filename = f"{template_type}.pptx"
    save_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(save_path)

    return jsonify({"message": "Upload successful", "filename": filename}), 200

# List available templates
@app.route("/api/templates", methods=["GET"])
def list_templates():
    data = {}

    # Default files (only for ojt and immersion)
    default_files = {
        "ojt": "ojt_default.pptx",
        "immersion": "immersion_default.pptx"
    }

    for key, filename in default_files.items():
        path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        if os.path.exists(path):
            data[key] = {
                "name": filename,
                "isDefault": True,
                "url": f"/uploads/templates/{filename}"
            }

    # Uploaded custom template (only if user uploaded it)
    custom_path = os.path.join(app.config['UPLOAD_FOLDER'], "custom.pptx")
    if os.path.exists(custom_path):
        data["custom"] = {
            "name": "custom.pptx",
            "isDefault": False,
            "url": "/uploads/templates/custom.pptx"
        }

    return jsonify(data)

# Serve a template file for download
@app.route("/uploads/templates/<filename>")
def serve_template(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename, as_attachment=True)

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5000)