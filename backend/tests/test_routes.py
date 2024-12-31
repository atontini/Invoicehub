import pytest
from flask import Flask
from flask_jwt_extended import create_access_token, create_refresh_token
from backend import create_app, db
from backend.models import User, Product, Category, PurchasedItem
from werkzeug.security import generate_password_hash

@pytest.fixture
def app():
    app = create_app()
    app.config["TESTING"] = True
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///:memory:"
    with app.app_context():
        db.create_all()
        yield app
        db.session.remove()
        db.drop_all()

@pytest.fixture
def client(app):
    return app.test_client()

@pytest.fixture
def auth_headers():
    user = User(email="test@example.com", name="Test User", password="hashedpassword")
    db.session.add(user)
    db.session.commit()
    access_token = create_access_token(identity="test@example.com")
    refresh_token = create_refresh_token(identity="test@example.com")
    return {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json",
    }, refresh_token

### Tests

def test_login_success(client):
    user = User(email="test@example.com", name="Test User", password=generate_password_hash("password"))
    db.session.add(user)
    db.session.commit()
    response = client.post("/login", json={"username": "test@example.com", "password": "password"})
    assert response.status_code == 200

def test_login_failure(client):
    response = client.post("/login", json={"username": "wrong@example.com", "password": "wrongpassword"})
    assert response.status_code == 401

def test_signup_success(client):
    response = client.post("/signup", json={
        "email": "newuser@example.com",
        "name": "New User",
        "password": "password123",
        "password_check": "password123"
    })
    assert response.status_code == 200
    data = response.get_json()
    assert "access_token" in data

def test_signup_email_exists(client):
    user = User(email="test@example.com", name="Test User", password="hashedpassword")
    db.session.add(user)
    db.session.commit()
    response = client.post("/signup", json={
        "email": "test@example.com",
        "name": "Test User",
        "password": "password123",
        "password_check": "password123"
    })
    assert response.status_code == 400
    data = response.get_json()
    assert data["error"] == "Email address already exists"

def test_get_all_products(client, auth_headers):
    headers, _ = auth_headers
    response = client.get("/products/", headers=headers)
    assert response.status_code == 200

def test_edit_product(client, auth_headers):
    product = Product(name="Test Product", price=10.0)
    db.session.add(product)
    db.session.commit()
    headers, _ = auth_headers
    response = client.put(f"/products/{product.id}", headers=headers, json={"price": 15.0})
    assert response.status_code == 200
    data = response.get_json()
    assert data["data"]["price"] == 15.0

def test_delete_product(client, auth_headers):
    product = Product(name="Test Product", price=10.0)
    db.session.add(product)
    db.session.commit()
    headers, _ = auth_headers
    response = client.delete(f"/products/{product.id}", headers=headers)
    assert response.status_code == 200
    data = response.get_json()
    assert data["msg"] == "Product deleted successfully"

def test_verify_token(client, auth_headers):
    headers, _ = auth_headers
    response = client.get("/verify", headers=headers)
    assert response.status_code == 200
    data = response.get_json()
    assert "Token is valid" in data["msg"]

def test_refresh_token(client, auth_headers):
    _, refresh_token = auth_headers
    response = client.post("/refresh", headers={"Authorization": f"Bearer {refresh_token}"})
    assert response.status_code == 200
    data = response.get_json()
    assert "access_token" in data

def test_get_all_categories(client, auth_headers):
    category = Category(name="Test Category")
    db.session.add(category)
    db.session.commit()
    headers, _ = auth_headers
    response = client.get("/categories/", headers=headers)
    assert response.status_code == 200

def test_get_all_users(client, auth_headers):
    headers, _ = auth_headers
    response = client.get("/users/", headers=headers)
    assert response.status_code == 200

def test_get_all_analytics(client, auth_headers):
    headers, _ = auth_headers
    response = client.get("/analytics/", headers=headers)
    assert response.status_code == 200
