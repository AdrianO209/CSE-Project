from flask import Flask, jsonify, request, redirect
from flask_admin import Admin
from flask_admin.contrib.sqla import ModelView
from flask_admin.menu import MenuLink
from flask_login import LoginManager, UserMixin, current_user, logout_user
from flask_cors import CORS
from flask_login.utils import login_required, login_user
from flask_sqlalchemy import SQLAlchemy
from wtforms.validators import length


app = Flask(__name__)

app.secret_key = "this is my secret key"
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///data.db"
db = SQLAlchemy(app)

CORS(
    app,
    supports_credentials=True,
    resources={
        r"/api/*": {"origins": ["http://localhost:5173", "http://127.0.0.1:5173"]}
    },
)

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = "login"


@login_manager.unauthorized_handler
def unauthorized():
    return jsonify({"error": "Unauthorized. Please log in."}), 401


enrollments = db.Table(
    "enrollments",
    db.Column("user_id", db.Integer, db.ForeignKey("user.id"), primary_key=True),
    db.Column("class_id", db.Integer, db.ForeignKey("course.id"), primary_key=True),
)


class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(50), unique=False, nullable=False)
    role = db.Column(db.String(20), default="student")

    classes = db.relationship("Course", secondary=enrollments, backref="students")

    def checkPassword(self, passwordAttempt):
        return self.password == passwordAttempt


class Course(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    className = db.Column(db.String(80), unique=True, nullable=False)
    instructor = db.Column(db.String(80), unique=False, nullable=False)
    time = db.Column(db.String(80), nullable=False)
    limit = db.Column(db.Integer, unique=False, nullable=False)


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))


admin = Admin(app, name="AURA Admin")

admin.add_view(ModelView(User, db.session))
admin.add_view(ModelView(Course, db.session))

admin.add_link(MenuLink(name="Logout", category="", url="/admin/logout"))


@app.route("/api/logout")
def logout():
    logout_user()
    return jsonify({"message": "Successfully logged out"}), 200


@app.route("/admin/logout")
def admin_logout():
    logout_user()
    return redirect("http://localhost:5173")


@app.route("/api/login", methods=["POST"])
def login():
    data = request.json
    user = User.query.filter_by(username=data.get("username")).first()

    if not user:
        return jsonify({"usernameError": "The username does not exist"}), 404

    if not user.checkPassword(data.get("password")):
        return jsonify({"passwordError": "Incorrect password. Please try again."}), 401

    login_user(user)
    return jsonify({"role": user.role, "username": user.username}), 200


@app.route("/api/courses")
@login_required
def get_courses():
    output = []
    for i in current_user.classes:
        output.append(
            {
                "id": i.id,
                "className": i.className,
                "instructor": i.instructor,
                "time": i.time,
                "enrolled": len(i.students),
                "total": i.limit,
            }
        )
    return jsonify(output), 200


if __name__ == "__main__":
    with app.app_context():
        db.create_all()

    app.run(debug=True, port=5001)
