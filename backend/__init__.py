from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from flask_jwt_extended import jwt_required
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from datetime import timedelta

# Initialize SQLAlchemy
db = SQLAlchemy()

def create_app():
    app = Flask(__name__)

    CORS(app)

    app.config['SECRET_KEY'] = 'secret-key-goes-here'
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///db.sqlite'
    app.config["JWT_SECRET_KEY"] = "super-secret"
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)
    app.config["JWT_REFRESH_TOKEN_EXPIRES"] = timedelta(days=30)

    jwt = JWTManager(app)

    db.init_app(app)

    login_manager = LoginManager()
    login_manager.login_view = 'auth.login'
    login_manager.init_app(app)

    from .models import User, Client, Product, Category, PurchasedItem

    @login_manager.user_loader
    def load_user(user_id):
        return User.query.get(int(user_id))

    from .routes import routes as routes_blueprint
    app.register_blueprint(routes_blueprint)

    with app.app_context():
        db.create_all()
        populate_database()

    return app

def populate_database():
    """Populate the database with initial data if tables are empty."""
    from .models import Client, Product, Category, PurchasedItem

    # Create Categories
    if not Category.query.first():
        category1 = Category(name='Electronics')
        category2 = Category(name='Books')
        category3 = Category(name='Clothing')

        db.session.add_all([category1, category2, category3])

    # Create Clients
    if not Client.query.first():
        client1 = Client(name='Alice Smith', email='alice@example.com')
        client2 = Client(name='Bob Johnson', email='bob@example.com')

        db.session.add_all([client1, client2])

    # Create Products
    if not Product.query.first():
        product1 = Product(name='Laptop', price=999.99, category_id=1)
        product2 = Product(name='Fiction Book', price=19.99, category_id=2)
        product3 = Product(name='T-shirt', price=9.99, category_id=3)
        product4 = Product(name='Smartphone', price=799.99, category_id=1)
        product5 = Product(name='Science Fiction Book', price=24.99, category_id=2)
        product6 = Product(name='Jeans', price=49.99, category_id=3)
        product7 = Product(name='Headphones', price=199.99, category_id=1)
        product8 = Product(name='Cookbook', price=29.99, category_id=2)
        product9 = Product(name='Sweater', price=39.99, category_id=3)


        db.session.add_all([product1, product2, product3, product4, product5, product6, product7, product8, product9])

    # Create Purchased Items
    if not PurchasedItem.query.first():
        purchase1 = PurchasedItem(client_id=1, product_id=1, quantity=1, total_price=999.99)
        purchase2 = PurchasedItem(client_id=2, product_id=2, quantity=2, total_price=39.98)

        db.session.add_all([purchase1, purchase2])

    try:
        db.session.commit()
        print("Database populated successfully!")
    except Exception as e:
        db.session.rollback()
        print(f"Error populating the database: {e}")
