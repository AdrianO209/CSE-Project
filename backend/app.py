from enum import unique
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///data.db"
db = SQLAlchemy(app)


CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}})

enrollments = db.Table(
    "enrollments",
    db.Column("user_id", db.Integer, db.ForeignKey("user.id"), primary_key=True),
    db.Column("class_id", db.Integer, db.ForeignKey("course.id"), primary_Key=True),
)


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(50), unique=True, nullable=False)

    classes = db.relationship("Class", secondary=enrollments, backref="students")


class Course(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    className = db.Column(db.String(80), unique=True, nullable=False)
    instructor = db.Column(db.String(80), unique=True, nullable=False)
    time = db.Column(db.String(80), nullable=False)


if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True, port=5000)
