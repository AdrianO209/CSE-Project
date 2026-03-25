from enum import unique
from flask import Flask, jsonify, request
from flask_admin import Admin
from flask_admin.contrib.sqla import ModelView
from flask_login import LoginManager, UserMixin
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy


app = Flask(__name__)

app.secret_key = "this is my secret key"
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///data.db"
db = SQLAlchemy(app)

CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}})

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = "login"

enrollments = db.Table(
    "enrollments",
    db.Column("user_id", db.Integer, db.ForeignKey("user.id"), primary_key=True),
    db.Column("class_id", db.Integer, db.ForeignKey("course.id"), primary_key=True),
)


class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(50), unique=True, nullable=False)

    classes = db.relationship("Course", secondary=enrollments, backref="students")


class Course(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    className = db.Column(db.String(80), unique=True, nullable=False)
    instructor = db.Column(db.String(80), unique=True, nullable=False)
    time = db.Column(db.String(80), nullable=False)


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))


admin = Admin(app, name="AURA Admin")

admin.add_view(ModelView(User, db.session))
admin.add_view(ModelView(Course, db.session))

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True, port=5000)
