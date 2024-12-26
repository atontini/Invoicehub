from flask import Blueprint, request
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, create_refresh_token, get_jwt, get_jwt_identity, jwt_required
from .models import User, Product, Category, Client, PurchasedItem
from . import db
from flask import current_app
import pandas as pd
from flask import jsonify
from query_utils import apply_filters, apply_ordering, apply_pagination

routes = Blueprint('routes', __name__)

blacklist = set()

@routes.route("/login", methods=['POST'])
def login():
    username = request.json.get("username", None)
    password = request.json.get("password", None)
    remember = True if request.json.get('remember') else False
    user = User.query.filter_by(email=username).first()
    if not user or not check_password_hash(user.password, password):
        return jsonify({"msg": "Please check your login details and try again."}), 401
    
    access_token = create_access_token(identity=username)
    refresh_token = create_refresh_token(identity=username)
    return jsonify(access_token=access_token, refresh_token=refresh_token)

@routes.route("/verify", methods=['GET'])
@jwt_required()
def verify():
    current_user = get_jwt_identity()
    return jsonify({"msg": f"Token is valid. Welcome, {current_user}!"}), 200

@routes.route("/refresh", methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    current_user = get_jwt_identity()
    new_access_token = create_access_token(identity=current_user)
    return jsonify(access_token=new_access_token), 200

@routes.route("/signup", methods=['POST'])
def signup():
    email = request.json.get('email')
    name = request.json.get('name')
    password = request.json.get('password')
    password_check = request.json.get('password_check')

    user = User.query.filter_by(email=email).first()
    if user:
        return jsonify({"error": "Email address already exists"}), 400

    if password != password_check:
        return jsonify({"error": "Passwords do not match"}), 400

    new_user = User(email=email, name=name, password=generate_password_hash(password, method='pbkdf2:sha256'))
    db.session.add(new_user)
    db.session.commit()

    access_token = create_access_token(identity=email)

    return jsonify({"access_token": access_token})


@routes.route("/logout", methods=['DELETE'])
@jwt_required()
def logout():
    jti = get_jwt()['jti']
    if jti in blacklist:
        return jsonify({"msg": "You are already logged out."}), 200
    else:
        blacklist.add(jti)
        return jsonify({'msg': 'Successfully logged out'}), 200

@routes.route("/products/", methods=["GET"])
@jwt_required()
def get_all_products():
    try:
        page = request.args.get("page", 1, type=int)
        per_page = request.args.get("per_page", 10, type=int)
        filters = {
            "category": request.args.get("category"),
            "price": request.args.get("price"),
        }
        order_by = request.args.get("order_by", "id")
        order_dir = request.args.get("order_dir", "asc")

        query = Product.query
        query = apply_filters(query, Product, filters)
        query = apply_ordering(query, Product, order_by, order_dir)
        paginated_products = apply_pagination(query, page, per_page)

        products_list = [product.to_dict() for product in paginated_products.items]
        return jsonify({
            "msg": "Successfully retrieved products",
            "data": products_list,
            "pagination": {
                "page": paginated_products.page,
                "per_page": paginated_products.per_page,
                "total_items": paginated_products.total,
                "total_pages": paginated_products.pages
            }
        })
    except Exception as e:
        return jsonify({
            "msg": "Failed to retrieve products",
            "error": str(e),
            "data": None
        }), 500

@routes.route("/products/<int:product_id>", methods=["PUT"])
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

@routes.route("/products/<int:product_id>", methods=["DELETE"])
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

@routes.route("/categories/", methods=["GET"])
@jwt_required()
def get_all_categories():
    try:
        page = request.args.get("page", 1, type=int)
        per_page = request.args.get("per_page", 10, type=int)
        filters = {
            "name": request.args.get("name"),
        }
        order_by = request.args.get("order_by", "id")
        order_dir = request.args.get("order_dir", "asc")

        query = Category.query
        query = apply_filters(query, Category, filters)
        query = apply_ordering(query, Category, order_by, order_dir)
        paginated_categories = apply_pagination(query, page, per_page)

        categories_list = [category.to_dict() for category in paginated_categories.items]
        return jsonify({
            "msg": "Successfully retrieved categories",
            "data": categories_list,
            "pagination": {
                "page": paginated_categories.page,
                "per_page": paginated_categories.per_page,
                "total_items": paginated_categories.total,
                "total_pages": paginated_categories.pages
            }
        })
    except Exception as e:
        return jsonify({
            "msg": "Failed to retrieve categories",
            "error": str(e),
            "data": None
        }), 500

@routes.route("/categories/<int:category_id>", methods=["PUT"])
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

@routes.route("/categories/<int:category_id>", methods=["DELETE"])
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

@routes.route("/users/", methods=['GET'])
@jwt_required()
def get_all_users():
    try:
        page = request.args.get("page", 1, type=int)
        per_page = request.args.get("per_page", 10, type=int)
        username_filter = request.args.get("username", type=str)
        email_filter = request.args.get("email", type=str)
        order_by = request.args.get("order_by", "id")
        order_dir = request.args.get("order_dir", "asc")

        query = Client.query
        if username_filter:
            query = query.filter(Client.username.ilike(f"%{username_filter}%"))
        if email_filter:
            query = query.filter(Client.email.ilike(f"%{email_filter}%"))

        if hasattr(Client, order_by):
            if order_dir == "desc":
                query = query.order_by(getattr(Client, order_by).desc())
            else:
                query = query.order_by(getattr(Client, order_by).asc())

        paginated_users = query.paginate(page=page, per_page=per_page, error_out=False)
        users_list = [user.to_dict() for user in paginated_users.items]

        return jsonify({
            "msg": "Successfully retrieved users",
            "data": users_list,
            "pagination": {
                "page": paginated_users.page,
                "per_page": paginated_users.per_page,
                "total_items": paginated_users.total,
                "total_pages": paginated_users.pages
            }
        })
    except Exception as e:
        return jsonify({
            "msg": "Failed to retrieve users",
            "error": str(e),
            "data": None
        }), 500

@routes.route("/analytics", methods=['GET'])
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