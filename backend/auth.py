from flask import Blueprint, render_template, redirect, url_for, request, flash
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import login_required, logout_user
from flask_jwt_extended import create_access_token, get_jwt, jwt_required
from .models import User, Product, Category, Client, PurchasedItem
from . import db
from itsdangerous import URLSafeTimedSerializer
from flask import current_app
import pandas as pd
from flask import jsonify

auth = Blueprint('auth', __name__)

blacklist = set()

@auth.route('/login', methods=['POST'])
def login():
    username = request.json.get("username", None)
    password = request.json.get("password", None)
    remember = True if request.json.get('remember') else False
    user = User.query.filter_by(email=username).first()
    if not user or not check_password_hash(user.password, password):
        return jsonify({"msg": "Please check your login details and try again."}), 401
    
    access_token = create_access_token(identity=username)
    return jsonify(access_token=access_token)

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
    if request.method == 'POST':
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
    return render_template('signup.html')

@auth.route('/logout', methods=['DELETE'])
@jwt_required()
def logout():
    jti = get_jwt()['jti']
    if jti in blacklist:
        return jsonify({"msg": "You are already logged out."}), 200
    else:
        blacklist.add(jti)
        return jsonify({'msg': 'Successfully logged out'}), 200

@auth.route("/products/", methods=["GET"])
@jwt_required()
def get_all_products():
    try:
        products = Product.query.all()
        products_list = [product.to_dict() for product in products]
        return jsonify({
            "msg": "successfully retrieved all products",
            "data": products_list
        })
    except Exception as e:
        return jsonify({
            "msg": "failed to retrieve all products",
            "error": str(e),
            "data": None
        }), 500

@auth.route("/products/<int:product_id>", methods=["PUT"])
@jwt_required()
def edit_product(product_id):
    try:
        data = request.get_json()
        product = Product.query.get(product_id)

        if not product:
            return jsonify({
                "msg": "Product not found",
                "data": None
            }), 404

        for key, value in data.items():
            if hasattr(product, key):
                setattr(product, key, value)

        db.session.commit()
        return jsonify({
            "msg": "Product updated successfully",
            "data": product.to_dict()
        })
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "msg": "Failed to update product",
            "error": str(e),
            "data": None
        }), 500

@auth.route("/products/<int:product_id>", methods=["DELETE"])
@jwt_required()
def delete_product(product_id):
    try:
        product = Product.query.get(product_id)

        if not product:
            return jsonify({
                "msg": "Product not found",
                "data": None
            }), 404

        db.session.delete(product)
        db.session.commit()
        return jsonify({
            "msg": "Product deleted successfully",
            "data": None
        })
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "msg": "Failed to delete product",
            "error": str(e),
            "data": None
        }), 500

@auth.route('/categories/', methods=['GET'])
@jwt_required()
def get_all_categories():
    try:
        categories = Category.query.all()
        categories_list = [category.to_dict() for category in categories]
        return jsonify({
            "msg": "successfully retrieved all categories",
            "data": categories_list
        })
    except Exception as e:
        return jsonify({
            "msg": "failed to retrieve all categories",
            "error": str(e),
            "data": None
        }), 500

@auth.route("/categories/<int:category_id>", methods=["PUT"])
@jwt_required()
def edit_category(category_id):
    try:
        category = Category.query.get(category_id)
        if not category:
            return jsonify({"msg": "Category not found"}), 404

        data = request.get_json()
        new_name = data.get("name")
        if not new_name:
            return jsonify({"msg": "Category name is required"}), 400

        category.name = new_name
        db.session.commit()

        return jsonify({
            "msg": "Category successfully updated",
            "data": category.to_dict()
        })
    except Exception as e:
        return jsonify({
            "msg": "Failed to update category",
            "error": str(e),
            "data": None
        }), 500

@auth.route("/categories/<int:category_id>", methods=["DELETE"])
@jwt_required()
def delete_category(category_id):
    try:
        category = Category.query.get(category_id)
        if not category:
            return jsonify({"msg": "Category not found"}), 404

        db.session.delete(category)
        db.session.commit()

        return jsonify({"msg": "Category successfully deleted"})
    except Exception as e:
        return jsonify({
            "msg": "Failed to delete category",
            "error": str(e),
            "data": None
        }), 500

@auth.route('/users/', methods=['GET'])
@jwt_required()
def get_all_users():
    try:
        users = Client.query.all()
        users_list = [user.to_dict() for user in users]
        return jsonify({
            "msg": "successfully retrieved all users",
            "data": users_list
        })
    except Exception as e:
        return jsonify({
            "msg": "failed to retrieve all categories",
            "error": str(e),
            "data": None
        }), 500

@auth.route('/analytics', methods=['GET'])
@jwt_required()
def get_all_analytics():
    average_sales = {
        'total_sales': 50897,
        'this_month_percentage': 8
    }

    total_sales = {
        'total': 550897,
        'increase_last_month': 3.48
    }

    total_inquieries = {
        'total': 750897,
        'increase_last_month': 3.48
    }

    total_invoices = {
        'total': 897,
        'increase_last_month': 3.48
    }

    graph_sales = {
        'profit': [10, 20, 15, 40, 50, 70, 90],
        'sales': [5, 15, 25, 35, 30, 60, 80],
        'categories': ['Apple', 'Samsung', 'Vivo', 'Oppo'],
        'categories_percentage': [40, 30, 20, 10]
    }

    return jsonify({
        "msg": "successfully retrieved all categories",
        "average_sales": average_sales,
        "total_sales": total_sales,
        "total_inquieries": total_inquieries,
        "total_invoices": total_invoices,
        "graph_sales": graph_sales,
    })