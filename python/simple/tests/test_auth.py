import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.main import app
from app.database import Base, get_db
from app.core.security import get_password_hash
from app.database import User

# Test database
SQLALCHEMY_DATABASE_URL = "postgresql://postgres:password@localhost:5432/crud_example_test"

engine = create_engine(SQLALCHEMY_DATABASE_URL)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)

@pytest.fixture(autouse=True)
def setup_database():
    # Create tables
    Base.metadata.create_all(bind=engine)
    yield
    # Clean up
    Base.metadata.drop_all(bind=engine)

def test_register_user():
    """Test user registration"""
    user_data = {
        "name": "Test User",
        "email": "test@example.com",
        "password": "password123",
        "age": 25
    }
    
    response = client.post("/api/auth/register", json=user_data)
    assert response.status_code == 201
    
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"

def test_register_user_duplicate_email():
    """Test registration with duplicate email"""
    user_data = {
        "name": "Test User",
        "email": "test@example.com",
        "password": "password123",
        "age": 25
    }
    
    # Register first user
    client.post("/api/auth/register", json=user_data)
    
    # Try to register second user with same email
    response = client.post("/api/auth/register", json=user_data)
    assert response.status_code == 400
    assert "El email ya está registrado" in response.json()["detail"]

def test_register_user_invalid_data():
    """Test registration with invalid data"""
    user_data = {
        "name": "T",  # Too short
        "email": "invalid-email",
        "password": "123",  # Too short
        "age": 15  # Too young
    }
    
    response = client.post("/api/auth/register", json=user_data)
    assert response.status_code == 422

def test_login_user():
    """Test user login"""
    # First register a user
    user_data = {
        "name": "Test User",
        "email": "test@example.com",
        "password": "password123",
        "age": 25
    }
    client.post("/api/auth/register", json=user_data)
    
    # Then login
    login_data = {
        "email": "test@example.com",
        "password": "password123"
    }
    
    response = client.post("/api/auth/login", json=login_data)
    assert response.status_code == 200
    
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"

def test_login_user_wrong_password():
    """Test login with wrong password"""
    # First register a user
    user_data = {
        "name": "Test User",
        "email": "test@example.com",
        "password": "password123",
        "age": 25
    }
    client.post("/api/auth/register", json=user_data)
    
    # Then login with wrong password
    login_data = {
        "email": "test@example.com",
        "password": "wrongpassword"
    }
    
    response = client.post("/api/auth/login", json=login_data)
    assert response.status_code == 401
    assert "Credenciales inválidas" in response.json()["detail"]

def test_login_user_nonexistent():
    """Test login with nonexistent user"""
    login_data = {
        "email": "nonexistent@example.com",
        "password": "password123"
    }
    
    response = client.post("/api/auth/login", json=login_data)
    assert response.status_code == 401
    assert "Credenciales inválidas" in response.json()["detail"] 