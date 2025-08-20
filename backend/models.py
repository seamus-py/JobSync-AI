from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)

class Job(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(80), nullable=False)
    company = db.Column(db.String(200), nullable=False)
    title = db.Column(db.String(200), nullable=False)
    status = db.Column(db.String(200), nullable=False)
    resume_file_path = db.Column(db.String(255)) 
    job_description_file_path = db.Column(db.String(255)) 
    score = db.Column(db.Float)
    missing_keywords = db.Column(db.Text)