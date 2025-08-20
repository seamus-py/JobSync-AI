from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
from openai import OpenAI
from models import db, User
from flask_bcrypt import Bcrypt
import jwt
import datetime
from models import db, User, Job
from functools import wraps
import docx2txt
import pdfplumber




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

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None

        # JWT is expected in the Authorization header
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            if auth_header.startswith("Bearer "):
                token = auth_header.split(" ")[1]

        if not token:
            return jsonify({'msg': 'Token is missing!'}), 401

        try:
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
            current_user = User.query.get(data['user_id'])
        except Exception as e:
            return jsonify({'msg': 'Token is invalid!', 'error': str(e)}), 403

        return f(current_user, *args, **kwargs)
    return decorated


@app.route('/api/getScore', methods=['POST'])
def get_score():
    job_description = request.form.get("jobDescription", "")

    file = request.files.get("resume")
    resume = ""

    if file:
        if file.filename.endswith(".txt"):
            resume = file.read().decode("utf-8")
        elif file.filename.endswith(".pdf"):
            with pdfplumber.open(file) as pdf:
                resume = "\n".join([page.extract_text() or "" for page in pdf.pages])
        elif file.filename.endswith(".docx"):
            resume = docx2txt.process(file)
        else:
            return {"error": "Unsupported file type"}, 400

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
        token = jwt.encode(
            {
                'user_id': user.id,
                'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=2)
            },
            app.config['SECRET_KEY'],
            algorithm='HS256'
        )

        response = {
            'msg': 'Login successful',
            'token': token,
            'status': 200
        }

    return jsonify(response), response['status']


@app.route('/api/saveJob', methods=['POST'])
@token_required
def save_job(current_user):
    data = request.get_json()
    email = current_user.email
    company = data.get('company')
    title = data.get('jobTitle')

    new_job = Job(
        email=email,
        company=company,
        title=title,
        status='In Process'  # Default status
    )
    db.session.add(new_job)
    db.session.commit()

    # You can now access `current_user.id` to save the application
    return jsonify({'msg': f'Application saved for user {current_user.email}'}), 200


@app.route('/api/getJobs', methods=['GET'])
@token_required
def get_jobs(current_user):
    try:
        # Query jobs for the current user's email
        user_jobs = Job.query.filter_by(email=current_user.email).all()
        
        # Convert jobs to dictionary format
        jobs_list = []
        for job in user_jobs:
            jobs_list.append({
                'id': job.id,
                'title': job.title,
                'company': job.company,
                'status': job.status,
                'email': job.email
            })
        
        return jsonify({
            'success': True,
            'jobs': jobs_list,
            'count': len(jobs_list)
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500
    

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5001, debug=True)