from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
from openai import OpenAI
from models import db, User
from flask_bcrypt import Bcrypt
import jwt
import datetime
from models import db, User

load_dotenv()




app = Flask(__name__)
CORS(app)  # Allow cross-origin requests from frontend

app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv("DATABASE_URL")
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.getenv("SECRET_KEY")

db.init_app(app)
bcrypt = Bcrypt(app)

with app.app_context():
    db.create_all()


client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

import re

@app.route('/api/getScore', methods=['POST'])
def get_score():
    data = request.get_json()
    resume = data.get('resume', '')
    job_description = data.get('jobDescription', '')

    prompt = f"""
    You are an AI assistant that helps job applicants improve their resumes.
    Evaluate the following resume against the job description and return a score out of 100 based on how well keywords and skills from the job description match the resume and the missing keywords that should be added.

    Return it in this exact format: 
    "Score: X ///
    Missing Keywords: list of missing keywords"
    , where X is the score.

    Resume:
    {resume}

    Job Description:
    {job_description}
    """

    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7
        )

        ai_text = response.choices[0].message.content.strip()

        # Example: "Score: 85 /// Missing Keywords: teamwork, leadership, SQL"
        score_match = re.search(r"Score:\s*(\d+)", ai_text)
        missing_keywords_match = re.search(r"Missing Keywords:\s*(.+)", ai_text)

        if score_match:
            score = int(score_match.group(1))
        else:
            score = None

        if missing_keywords_match:
            keywords_text = missing_keywords_match.group(1)
            # Split by comma and strip whitespace
            missing_keywords = [kw.strip() for kw in keywords_text.split(',')]
        else:
            missing_keywords = []

        return jsonify({
            'score': score,
            'missing_keywords': missing_keywords
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

    

@app.route('/api/signUp', methods=['POST'])
def sign_up():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'msg': 'Username and password required'}), 400

    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        return jsonify({'msg': 'User already exists'}), 400
    
    hashed_pw = bcrypt.generate_password_hash(password).decode('utf-8')
    new_user = User(email=email, password=hashed_pw)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'msg': 'User created successfully!'}), 201

@app.route('/api/signIn', methods=['POST'])
def sign_in():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    encrypted_pw = bcrypt.generate_password_hash(password).decode('utf-8')

    user = User.query.filter_by(email=email).first()

    response = {
        'msg': 'Invalid email or password',
        'status': 401
    }

    if user and bcrypt.check_password_hash(user.password, password):
        response = {
            'msg': 'Login successful',
            'status': 200
        }

    return jsonify(response), response['status']

    

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5001, debug=True)