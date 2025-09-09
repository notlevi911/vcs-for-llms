#!/usr/bin/env python3
"""
Simple API test script for PromptPilot Backend
"""

import requests
import json
import time

BASE_URL = "http://localhost:8000"

def test_health():
    """Test health endpoint"""
    print("🔍 Testing health endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/health")
        if response.status_code == 200:
            print("✅ Health check passed")
            return True
        else:
            print(f"❌ Health check failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Health check error: {e}")
        return False

def test_register():
    """Test user registration"""
    print("🔍 Testing user registration...")
    try:
        user_data = {
            "name": "Test User",
            "email": "test@example.com",
            "password": "testpassword123"
        }
        response = requests.post(f"{BASE_URL}/auth/register", json=user_data)
        if response.status_code == 200:
            token_data = response.json()
            print("✅ User registration successful")
            return token_data["access_token"]
        else:
            print(f"❌ Registration failed: {response.status_code}")
            print(response.text)
            return None
    except Exception as e:
        print(f"❌ Registration error: {e}")
        return None

def test_login():
    """Test user login"""
    print("🔍 Testing user login...")
    try:
        login_data = {
            "email": "test@example.com",
            "password": "testpassword123"
        }
        response = requests.post(f"{BASE_URL}/auth/login", json=login_data)
        if response.status_code == 200:
            token_data = response.json()
            print("✅ User login successful")
            return token_data["access_token"]
        else:
            print(f"❌ Login failed: {response.status_code}")
            print(response.text)
            return None
    except Exception as e:
        print(f"❌ Login error: {e}")
        return None

def test_chat(token):
    """Test chat endpoint"""
    print("🔍 Testing chat endpoint...")
    try:
        headers = {"Authorization": f"Bearer {token}"}
        chat_data = {
            "chatId": "test-chat-123",
            "userMessage": "Hello! Can you help me with Python programming?"
        }
        response = requests.post(f"{BASE_URL}/chat", json=chat_data, headers=headers)
        if response.status_code == 200:
            chat_response = response.json()
            print("✅ Chat request successful")
            print(f"AI Response: {chat_response['assistantMessage'][:100]}...")
            return chat_response["chatId"]
        else:
            print(f"❌ Chat request failed: {response.status_code}")
            print(response.text)
            return None
    except Exception as e:
        print(f"❌ Chat error: {e}")
        return None

def test_commit(token, chat_id):
    """Test commit endpoint"""
    print("🔍 Testing commit endpoint...")
    try:
        headers = {"Authorization": f"Bearer {token}"}
        commit_data = {
            "chatId": chat_id,
            "name": "Initial Python help session"
        }
        response = requests.post(f"{BASE_URL}/commit", json=commit_data, headers=headers)
        if response.status_code == 200:
            commit_response = response.json()
            print("✅ Commit creation successful")
            print(f"Commit ID: {commit_response['commitId']}")
            return commit_response["commitId"]
        else:
            print(f"❌ Commit creation failed: {response.status_code}")
            print(response.text)
            return None
    except Exception as e:
        print(f"❌ Commit error: {e}")
        return None

def test_commit_history(token, chat_id):
    """Test commit history endpoint"""
    print("🔍 Testing commit history endpoint...")
    try:
        headers = {"Authorization": f"Bearer {token}"}
        response = requests.get(f"{BASE_URL}/commits/{chat_id}", headers=headers)
        if response.status_code == 200:
            history_response = response.json()
            print("✅ Commit history retrieval successful")
            print(f"Found {history_response['totalCount']} commits")
            return True
        else:
            print(f"❌ Commit history failed: {response.status_code}")
            print(response.text)
            return False
    except Exception as e:
        print(f"❌ Commit history error: {e}")
        return False

def main():
    """Run all tests"""
    print("🧪 PromptPilot API Test Suite")
    print("=" * 40)
    
    # Test health
    if not test_health():
        print("❌ Server is not running. Please start the backend first.")
        return
    
    print("\n" + "=" * 40)
    
    # Test authentication
    token = test_login()
    if not token:
        print("❌ Authentication failed. Cannot proceed with other tests.")
        return
    
    print("\n" + "=" * 40)
    
    # Test chat
    chat_id = test_chat(token)
    if not chat_id:
        print("❌ Chat test failed. Cannot proceed with commit tests.")
        return
    
    print("\n" + "=" * 40)
    
    # Test commit
    commit_id = test_commit(token, chat_id)
    if not commit_id:
        print("❌ Commit test failed.")
        return
    
    print("\n" + "=" * 40)
    
    # Test commit history
    test_commit_history(token, chat_id)
    
    print("\n" + "=" * 40)
    print("🎉 All tests completed!")
    print("✅ PromptPilot Backend is working correctly")

if __name__ == "__main__":
    main()
