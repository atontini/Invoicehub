from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager

# Initialize SQLAlchemy
db = SQLAlchemy()

def create_app():
    app = Flask(__name__)

    app.config['SECRET_KEY'] = 'secret-key-goes-here'
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///db.sqlite'

    db.init_app(app)

    login_manager = LoginManager()
    login_manager.login_view = 'auth.login'
    login_manager.init_app(app)

    from .models import User, Client, Product, Category

    @login_manager.user_loader
    def load_user(user_id):
        return User.query.get(int(user_id))

    from .auth import auth as auth_blueprint
    app.register_blueprint(auth_blueprint)

    from .main import main as main_blueprint
    app.register_blueprint(main_blueprint)

    with app.app_context():
        db.create_all()
        populate_database()

    return app

def populate_database():
    """Populate the database with initial data if tables are empty."""
    from .models import Client, Product, Category

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

        db.session.add_all([product1, product2, product3])

    try:
        db.session.commit()
        print("Database populated successfully!")
    except Exception as e:
        db.session.rollback()
        print(f"Error populating the database: {e}")
