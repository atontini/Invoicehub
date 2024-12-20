from flask import Blueprint, render_template, redirect, url_for, request, flash
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import login_user, login_required, logout_user
from .models import User, Product
from . import db
from itsdangerous import URLSafeTimedSerializer
from flask import current_app

auth = Blueprint('auth', __name__)

@auth.route('/login')
def login():
    return render_template('login.html')

@auth.route('/login', methods=['POST'])
def login_post():
    email = request.form.get('email')
    password = request.form.get('password')
    remember = True if request.form.get('remember') else False

    user = User.query.filter_by(email=email).first()

    if not user or not check_password_hash(user.password, password):
        flash('Please check your login details and try again.')
        return redirect(url_for('auth.login'))
    
    login_user(user, remember=remember)

    return redirect(url_for('main.profile'))

def generate_reset_token(user):
    user_email = user.email
    s = URLSafeTimedSerializer(current_app.config['SECRET_KEY'])
    return s.dumps(user_email, salt='password-reset-salt')

def verify_reset_token(token, max_age=3600):
    s = URLSafeTimedSerializer(current_app.config['SECRET_KEY'])
    try:
        email = s.loads(token, salt='password-reset-salt', max_age=max_age)
    except Exception:
        return None
    return email

@auth.route('/reset_password_request', methods=['GET', 'POST'])
def reset_password_request():
    if request.method == 'POST':
        email = request.form.get('email')
        user = User.query.filter_by(email=email).first()
        #token = generate_reset_token(user)
        #reset_url = url_for('auth.reset_password_request', token=token, _external=True)
        #msg = Message(
        #    subject='Password Reset Request',
        #    sender='noreply@yourapp.com',
        #    recipients=[email]
        #)
        #msg.body = f"To reset your password, visit the following link: {reset_url}\n\nIf you did not request this, please ignore this email."
        #Mail.send(msg)
        flash('If the email is linked to an account, you will receive a reset link shortly. Check your inbox and spam folder')
    return render_template('reset_password_request.html', title='Reset Password')

@auth.route('/signup')
def signup():
    return render_template('signup.html')

@auth.route('/signup', methods=['POST'])
def signup_post():
    email = request.form.get('email')
    name = request.form.get('name')
    password = request.form.get('password')
    password_check = request.form.get('password_check')

    user = User.query.filter_by(email=email).first()

    if user:
        flash('Email address already exists')
        return redirect(url_for('auth.signup'))
    
    if password != password_check:
        flash('Password not matching')
        return redirect(url_for('auth.signup'))

    new_user = User(email=email, name=name, password=generate_password_hash(password, method='pbkdf2:sha256'))

    db.session.add(new_user)
    db.session.commit()

    return redirect(url_for('auth.login'))

@auth.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('main.index'))

@auth.route('/products')
@login_required
def products():
    #items: id, first, last, email, phone, location, hobby
    products = Product.query.all()
    return render_template('products.html', products=products)