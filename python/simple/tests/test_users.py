import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.main import app
from app.database import Base, get_db, User
from app.core.security import get_password_hash, create_access_token

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

@pytest.fixture
def auth_token():
    """Create a test user and return auth token"""
    db = TestingSessionLocal()
    
    # Create test user
    hashed_password = get_password_hash("password123")
    test_user = User(
        name="Test User",
        email="test@example.com",
        password_hash=hashed_password,
        age=25
    )
    db.add(test_user)
    db.commit()
    db.refresh(test_user)
    
    # Create token
    token = create_access_token(data={"sub": test_user.email})
    db.close()
    
    return token

def test_get_users(auth_token):
    """Test getting all users"""
    headers = {"Authorization": f"Bearer {auth_token}"}
    response = client.get("/api/users/", headers=headers)
    
    assert response.status_code == 200
    data = response.json()
    assert "data" in data
    assert "pagination" in data
    assert len(data["data"]) >= 1

def test_get_users_unauthorized():
    """Test getting users without authentication"""
    response = client.get("/api/users/")
    assert response.status_code == 401

def test_get_user_by_id(auth_token):
    """Test getting user by ID"""
    headers = {"Authorization": f"Bearer {auth_token}"}
    response = client.get("/api/users/1", headers=headers)
    
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == 1
    assert data["name"] == "Test User"
    assert data["email"] == "test@example.com"

def test_get_user_by_id_not_found(auth_token):
    """Test getting non-existent user"""
    headers = {"Authorization": f"Bearer {auth_token}"}
    response = client.get("/api/users/999", headers=headers)
    
    assert response.status_code == 404
    assert "Usuario no encontrado" in response.json()["detail"]

def test_create_user(auth_token):
    """Test creating a new user"""
    headers = {"Authorization": f"Bearer {auth_token}"}
    user_data = {
        "name": "New User",
        "email": "newuser@example.com",
        "password": "password123",
        "age": 30
    }
    
    response = client.post("/api/users/", json=user_data, headers=headers)
    assert response.status_code == 201
    
    data = response.json()
    assert data["name"] == user_data["name"]
    assert data["email"] == user_data["email"]
    assert data["age"] == user_data["age"]
    assert "password" not in data

def test_create_user_duplicate_email(auth_token):
    """Test creating user with duplicate email"""
    headers = {"Authorization": f"Bearer {auth_token}"}
    user_data = {
        "name": "New User",
        "email": "test@example.com",  # Same as existing user
        "password": "password123",
        "age": 30
    }
    
    response = client.post("/api/users/", json=user_data, headers=headers)
    assert response.status_code == 400
    assert "El email ya está registrado" in response.json()["detail"]

def test_update_user(auth_token):
    """Test updating a user"""
    headers = {"Authorization": f"Bearer {auth_token}"}
    update_data = {
        "name": "Updated Name",
        "age": 35
    }
    
    response = client.put("/api/users/1", json=update_data, headers=headers)
    assert response.status_code == 200
    
    data = response.json()
    assert data["name"] == update_data["name"]
    assert data["age"] == update_data["age"]

def test_update_user_not_found(auth_token):
    """Test updating non-existent user"""
    headers = {"Authorization": f"Bearer {auth_token}"}
    update_data = {
        "name": "Updated Name"
    }
    
    response = client.put("/api/users/999", json=update_data, headers=headers)
    assert response.status_code == 404
    assert "Usuario no encontrado" in response.json()["detail"]

def test_update_user_duplicate_email(auth_token):
    """Test updating user with duplicate email"""
    # First create another user
    headers = {"Authorization": f"Bearer {auth_token}"}
    user_data = {
        "name": "Another User",
        "email": "another@example.com",
        "password": "password123",
        "age": 30
    }
    client.post("/api/users/", json=user_data, headers=headers)
    
    # Then try to update first user with second user's email
    update_data = {
        "email": "another@example.com"
    }
    
    response = client.put("/api/users/1", json=update_data, headers=headers)
    assert response.status_code == 400
    assert "El email ya está registrado" in response.json()["detail"]

def test_delete_user(auth_token):
    """Test soft deleting a user"""
    headers = {"Authorization": f"Bearer {auth_token}"}
    response = client.delete("/api/users/1", headers=headers)
    
    assert response.status_code == 200
    data = response.json()
    assert data["is_active"] == False

def test_delete_user_not_found(auth_token):
    """Test deleting non-existent user"""
    headers = {"Authorization": f"Bearer {auth_token}"}
    response = client.delete("/api/users/999", headers=headers)
    
    assert response.status_code == 404
    assert "Usuario no encontrado" in response.json()["detail"]

def test_pagination():
    """Test pagination functionality"""
    # Create multiple users first
    db = TestingSessionLocal()
    for i in range(15):
        hashed_password = get_password_hash("password123")
        user = User(
            name=f"User {i}",
            email=f"user{i}@example.com",
            password_hash=hashed_password,
            age=25 + i
        )
        db.add(user)
    db.commit()
    db.close()
    
    # Create token for authentication
    token = create_access_token(data={"sub": "test@example.com"})
    headers = {"Authorization": f"Bearer {token}"}
    
    # Test first page
    response = client.get("/api/users/?page=1&limit=10", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert len(data["data"]) == 10
    assert data["pagination"]["page"] == 1
    assert data["pagination"]["limit"] == 10
    assert data["pagination"]["total"] >= 15
    
    # Test second page
    response = client.get("/api/users/?page=2&limit=10", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert len(data["data"]) >= 5  # Should have remaining users 