from enum import unique
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.sql import false

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///data.db"
db = SQLAlchemy(app)


CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}})

enrollments = db.Table(
    "enrollments",
    db.Column("user_id", db.Integer, db.ForigenKey("user.id"), primary_key=True),
    db.Column("class_id", db.Integer, db.ForigenKey("class.id"), primaryKey=True),
)


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.string(80), unique=True, nullable=False)
    password = db.Column(db.string(50), unique=True, nullable=False)

    classes = db.relationship("Class", secondary=enrollments, backref="students")


class Class(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    className = db.Column(db.string(80), unique=True, nullable=False)
    instructor = db.Column(db.string(80), unique=True, nullable=False)
    time = db.Column(db.string(80), unique=True, nullable=False)
