#!/usr/bin/env python3
"""
Backend API Testing Script for Ice Cream Shop Admin
Tests auth endpoints and flavours management
"""

import requests
import json
import sys
from typing import Dict, Any, List

# Backend URL from environment
BACKEND_URL = "https://reverent-kalam-8.preview.emergentagent.com/api"

# Test credentials from .env
ADMIN_USERNAME = "Zmrkamalek"
ADMIN_PASSWORD = "Login5879*"

# Color codes for output
GREEN = '\033[92m'
RED = '\033[91m'
YELLOW = '\033[93m'
BLUE = '\033[94m'
RESET = '\033[0m'

class TestResults:
    def __init__(self):
        self.passed = 0
        self.failed = 0
        self.tests = []
    
    def add_pass(self, test_name: str, details: str = ""):
        self.passed += 1
        self.tests.append({"name": test_name, "status": "PASS", "details": details})
        print(f"{GREEN}✓ PASS{RESET}: {test_name}")
        if details:
            print(f"  {details}")
    
    def add_fail(self, test_name: str, details: str = ""):
        self.failed += 1
        self.tests.append({"name": test_name, "status": "FAIL", "details": details})
        print(f"{RED}✗ FAIL{RESET}: {test_name}")
        if details:
            print(f"  {details}")
    
    def summary(self):
        total = self.passed + self.failed
        print(f"\n{'='*60}")
        print(f"{BLUE}TEST SUMMARY{RESET}")
        print(f"{'='*60}")
        print(f"Total Tests: {total}")
        print(f"{GREEN}Passed: {self.passed}{RESET}")
        print(f"{RED}Failed: {self.failed}{RESET}")
        print(f"{'='*60}\n")
        return self.failed == 0


def test_get_flavours_public(results: TestResults):
    """Test 1: GET /api/flavours - PUBLIC endpoint"""
    print(f"\n{YELLOW}[TEST 1] GET /api/flavours (PUBLIC){RESET}")
    
    try:
        response = requests.get(f"{BACKEND_URL}/flavours", timeout=10)
        
        if response.status_code != 200:
            results.add_fail(
                "GET /api/flavours returns 200",
                f"Expected 200, got {response.status_code}"
            )
            return
        
        results.add_pass("GET /api/flavours returns 200")
        
        data = response.json()
        
        if "items" not in data:
            results.add_fail(
                "Response contains 'items' key",
                f"Response: {data}"
            )
            return
        
        results.add_pass("Response contains 'items' key")
        
        items = data["items"]
        if not isinstance(items, list):
            results.add_fail(
                "items is a list",
                f"items type: {type(items)}"
            )
            return
        
        results.add_pass("items is a list")
        
        if len(items) == 0:
            results.add_fail(
                "Default flavours returned (8 items)",
                f"Got {len(items)} items"
            )
            return
        
        # Check if we have default flavours (8 items)
        if len(items) == 8:
            results.add_pass(
                "Default flavours returned (8 items)",
                f"Items: {[item.get('name', 'N/A') for item in items]}"
            )
        else:
            results.add_pass(
                f"Flavours returned ({len(items)} items)",
                f"Items: {[item.get('name', 'N/A') for item in items]}"
            )
        
        # Verify structure of items
        for idx, item in enumerate(items):
            if "name" not in item or "color" not in item:
                results.add_fail(
                    f"Item {idx} has name and color",
                    f"Item: {item}"
                )
                return
        
        results.add_pass("All items have 'name' and 'color' fields")
        
    except Exception as e:
        results.add_fail("GET /api/flavours", f"Exception: {str(e)}")


def test_login_correct_credentials(results: TestResults) -> str:
    """Test 2: POST /api/auth/login - Correct credentials"""
    print(f"\n{YELLOW}[TEST 2] POST /api/auth/login (CORRECT CREDENTIALS){RESET}")
    
    try:
        response = requests.post(
            f"{BACKEND_URL}/auth/login",
            json={"username": ADMIN_USERNAME, "password": ADMIN_PASSWORD},
            timeout=10
        )
        
        if response.status_code != 200:
            results.add_fail(
                "Login with correct credentials returns 200",
                f"Expected 200, got {response.status_code}. Response: {response.text}"
            )
            return None
        
        results.add_pass("Login with correct credentials returns 200")
        
        data = response.json()
        
        if "token" not in data:
            results.add_fail(
                "Response contains 'token'",
                f"Response: {data}"
            )
            return None
        
        results.add_pass("Response contains 'token'")
        
        if "user" not in data:
            results.add_fail(
                "Response contains 'user'",
                f"Response: {data}"
            )
            return None
        
        results.add_pass("Response contains 'user'")
        
        token = data["token"]
        if not token or len(token) < 10:
            results.add_fail(
                "Token is valid string",
                f"Token length: {len(token)}"
            )
            return None
        
        results.add_pass("Token is valid string", f"Token length: {len(token)}")
        
        return token
        
    except Exception as e:
        results.add_fail("Login with correct credentials", f"Exception: {str(e)}")
        return None


def test_login_wrong_credentials(results: TestResults):
    """Test 3: POST /api/auth/login - Wrong credentials"""
    print(f"\n{YELLOW}[TEST 3] POST /api/auth/login (WRONG CREDENTIALS){RESET}")
    
    test_cases = [
        {"username": "wrong_user", "password": ADMIN_PASSWORD, "desc": "wrong username"},
        {"username": ADMIN_USERNAME, "password": "wrong_pass", "desc": "wrong password"},
        {"username": "wrong", "password": "wrong", "desc": "both wrong"},
    ]
    
    for test_case in test_cases:
        try:
            response = requests.post(
                f"{BACKEND_URL}/auth/login",
                json={"username": test_case["username"], "password": test_case["password"]},
                timeout=10
            )
            
            if response.status_code != 401:
                results.add_fail(
                    f"Login with {test_case['desc']} returns 401",
                    f"Expected 401, got {response.status_code}"
                )
                continue
            
            results.add_pass(f"Login with {test_case['desc']} returns 401")
            
            data = response.json()
            if "detail" not in data:
                results.add_fail(
                    f"401 response contains 'detail' ({test_case['desc']})",
                    f"Response: {data}"
                )
                continue
            
            results.add_pass(f"401 response contains 'detail' ({test_case['desc']})")
            
        except Exception as e:
            results.add_fail(f"Login with {test_case['desc']}", f"Exception: {str(e)}")


def test_login_validation_errors(results: TestResults):
    """Test 4: POST /api/auth/login - Validation errors"""
    print(f"\n{YELLOW}[TEST 4] POST /api/auth/login (VALIDATION ERRORS){RESET}")
    
    test_cases = [
        {"body": {}, "desc": "empty body"},
        {"body": {"username": ""}, "desc": "missing password"},
        {"body": {"password": ""}, "desc": "missing username"},
        {"body": {"username": "", "password": ""}, "desc": "empty fields"},
    ]
    
    for test_case in test_cases:
        try:
            response = requests.post(
                f"{BACKEND_URL}/auth/login",
                json=test_case["body"],
                timeout=10
            )
            
            if response.status_code != 422:
                results.add_fail(
                    f"Login with {test_case['desc']} returns 422",
                    f"Expected 422, got {response.status_code}"
                )
                continue
            
            results.add_pass(f"Login with {test_case['desc']} returns 422")
            
        except Exception as e:
            results.add_fail(f"Login with {test_case['desc']}", f"Exception: {str(e)}")


def test_verify_with_valid_token(results: TestResults, token: str):
    """Test 5: GET /api/auth/verify - Valid token"""
    print(f"\n{YELLOW}[TEST 5] GET /api/auth/verify (VALID TOKEN){RESET}")
    
    if not token:
        results.add_fail("Verify with valid token", "No token available from login test")
        return
    
    try:
        response = requests.get(
            f"{BACKEND_URL}/auth/verify",
            headers={"Authorization": f"Bearer {token}"},
            timeout=10
        )
        
        if response.status_code != 200:
            results.add_fail(
                "Verify with valid token returns 200",
                f"Expected 200, got {response.status_code}. Response: {response.text}"
            )
            return
        
        results.add_pass("Verify with valid token returns 200")
        
        data = response.json()
        
        if "ok" not in data or data["ok"] != True:
            results.add_fail(
                "Response contains 'ok: true'",
                f"Response: {data}"
            )
            return
        
        results.add_pass("Response contains 'ok: true'")
        
        if "user" not in data:
            results.add_fail(
                "Response contains 'user'",
                f"Response: {data}"
            )
            return
        
        results.add_pass("Response contains 'user'")
        
    except Exception as e:
        results.add_fail("Verify with valid token", f"Exception: {str(e)}")


def test_verify_without_token(results: TestResults):
    """Test 6: GET /api/auth/verify - Missing token"""
    print(f"\n{YELLOW}[TEST 6] GET /api/auth/verify (MISSING TOKEN){RESET}")
    
    try:
        response = requests.get(
            f"{BACKEND_URL}/auth/verify",
            timeout=10
        )
        
        if response.status_code != 401:
            results.add_fail(
                "Verify without token returns 401",
                f"Expected 401, got {response.status_code}"
            )
            return
        
        results.add_pass("Verify without token returns 401")
        
    except Exception as e:
        results.add_fail("Verify without token", f"Exception: {str(e)}")


def test_verify_with_invalid_token(results: TestResults):
    """Test 7: GET /api/auth/verify - Invalid token"""
    print(f"\n{YELLOW}[TEST 7] GET /api/auth/verify (INVALID TOKEN){RESET}")
    
    invalid_tokens = [
        "invalid_token_string",
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.invalid.signature",
        "Bearer malformed",
    ]
    
    for invalid_token in invalid_tokens:
        try:
            response = requests.get(
                f"{BACKEND_URL}/auth/verify",
                headers={"Authorization": f"Bearer {invalid_token}"},
                timeout=10
            )
            
            if response.status_code != 401:
                results.add_fail(
                    f"Verify with invalid token '{invalid_token[:20]}...' returns 401",
                    f"Expected 401, got {response.status_code}"
                )
                continue
            
            results.add_pass(f"Verify with invalid token returns 401")
            
        except Exception as e:
            results.add_fail(f"Verify with invalid token", f"Exception: {str(e)}")


def test_put_flavours_without_token(results: TestResults):
    """Test 8: PUT /api/flavours - Without token"""
    print(f"\n{YELLOW}[TEST 8] PUT /api/flavours (WITHOUT TOKEN){RESET}")
    
    try:
        response = requests.put(
            f"{BACKEND_URL}/flavours",
            json={"items": [{"name": "Test", "color": "#FFFFFF"}]},
            timeout=10
        )
        
        if response.status_code != 401:
            results.add_fail(
                "PUT /api/flavours without token returns 401",
                f"Expected 401, got {response.status_code}"
            )
            return
        
        results.add_pass("PUT /api/flavours without token returns 401")
        
    except Exception as e:
        results.add_fail("PUT /api/flavours without token", f"Exception: {str(e)}")


def test_put_flavours_with_token(results: TestResults, token: str):
    """Test 9: PUT /api/flavours - With valid token"""
    print(f"\n{YELLOW}[TEST 9] PUT /api/flavours (WITH VALID TOKEN){RESET}")
    
    if not token:
        results.add_fail("PUT /api/flavours with token", "No token available from login test")
        return
    
    test_flavours = [
        {"name": "Čokoládová", "color": "#3D2817"},
        {"name": "Vanilková", "color": "#F3E5AB"},
        {"name": "Jahodová", "color": "#FC5A8D"},
    ]
    
    try:
        response = requests.put(
            f"{BACKEND_URL}/flavours",
            json={"items": test_flavours},
            headers={"Authorization": f"Bearer {token}"},
            timeout=10
        )
        
        if response.status_code != 200:
            results.add_fail(
                "PUT /api/flavours with token returns 200",
                f"Expected 200, got {response.status_code}. Response: {response.text}"
            )
            return
        
        results.add_pass("PUT /api/flavours with token returns 200")
        
        data = response.json()
        
        if "ok" not in data or data["ok"] != True:
            results.add_fail(
                "Response contains 'ok: true'",
                f"Response: {data}"
            )
            return
        
        results.add_pass("Response contains 'ok: true'")
        
        # Verify persistence by getting flavours again
        get_response = requests.get(f"{BACKEND_URL}/flavours", timeout=10)
        
        if get_response.status_code != 200:
            results.add_fail(
                "GET /api/flavours after PUT returns 200",
                f"Expected 200, got {get_response.status_code}"
            )
            return
        
        results.add_pass("GET /api/flavours after PUT returns 200")
        
        get_data = get_response.json()
        saved_items = get_data.get("items", [])
        
        if len(saved_items) != len(test_flavours):
            results.add_fail(
                "Saved flavours count matches",
                f"Expected {len(test_flavours)}, got {len(saved_items)}"
            )
            return
        
        results.add_pass("Saved flavours count matches")
        
        # Verify each flavour
        for idx, (expected, actual) in enumerate(zip(test_flavours, saved_items)):
            if expected["name"] != actual.get("name") or expected["color"] != actual.get("color"):
                results.add_fail(
                    f"Flavour {idx} matches",
                    f"Expected {expected}, got {actual}"
                )
                return
        
        results.add_pass("All saved flavours match expected values")
        
    except Exception as e:
        results.add_fail("PUT /api/flavours with token", f"Exception: {str(e)}")


def test_put_flavours_max_items(results: TestResults, token: str):
    """Test 10: PUT /api/flavours - Max 10 items"""
    print(f"\n{YELLOW}[TEST 10] PUT /api/flavours (MAX 10 ITEMS){RESET}")
    
    if not token:
        results.add_fail("PUT /api/flavours max items", "No token available from login test")
        return
    
    # Create 10 flavours
    ten_flavours = [
        {"name": f"Příchuť {i+1}", "color": f"#{i:02d}{i:02d}{i:02d}"}
        for i in range(10)
    ]
    
    try:
        response = requests.put(
            f"{BACKEND_URL}/flavours",
            json={"items": ten_flavours},
            headers={"Authorization": f"Bearer {token}"},
            timeout=10
        )
        
        if response.status_code != 200:
            results.add_fail(
                "PUT /api/flavours with 10 items returns 200",
                f"Expected 200, got {response.status_code}"
            )
            return
        
        results.add_pass("PUT /api/flavours with 10 items returns 200")
        
        # Verify all 10 are saved
        get_response = requests.get(f"{BACKEND_URL}/flavours", timeout=10)
        get_data = get_response.json()
        saved_items = get_data.get("items", [])
        
        if len(saved_items) != 10:
            results.add_fail(
                "All 10 flavours saved",
                f"Expected 10, got {len(saved_items)}"
            )
            return
        
        results.add_pass("All 10 flavours saved")
        
    except Exception as e:
        results.add_fail("PUT /api/flavours max items", f"Exception: {str(e)}")


def test_put_flavours_more_than_10(results: TestResults, token: str):
    """Test 11: PUT /api/flavours - More than 10 items"""
    print(f"\n{YELLOW}[TEST 11] PUT /api/flavours (MORE THAN 10 ITEMS){RESET}")
    
    if not token:
        results.add_fail("PUT /api/flavours >10 items", "No token available from login test")
        return
    
    # Create 12 flavours
    twelve_flavours = [
        {"name": f"Příchuť {i+1}", "color": f"#{i:02d}{i:02d}{i:02d}"}
        for i in range(12)
    ]
    
    try:
        response = requests.put(
            f"{BACKEND_URL}/flavours",
            json={"items": twelve_flavours},
            headers={"Authorization": f"Bearer {token}"},
            timeout=10
        )
        
        # Should either return 422 validation error or accept and truncate to 10
        if response.status_code == 422:
            results.add_pass("PUT /api/flavours with >10 items returns 422 validation error")
        elif response.status_code == 200:
            # Check if truncated to 10
            get_response = requests.get(f"{BACKEND_URL}/flavours", timeout=10)
            get_data = get_response.json()
            saved_items = get_data.get("items", [])
            
            if len(saved_items) <= 10:
                results.add_pass(
                    "PUT /api/flavours with >10 items truncates to 10",
                    f"Saved {len(saved_items)} items"
                )
            else:
                results.add_fail(
                    "PUT /api/flavours with >10 items truncates to 10",
                    f"Expected ≤10, got {len(saved_items)}"
                )
        else:
            results.add_fail(
                "PUT /api/flavours with >10 items returns 422 or 200",
                f"Got {response.status_code}"
            )
        
    except Exception as e:
        results.add_fail("PUT /api/flavours >10 items", f"Exception: {str(e)}")


def test_put_flavours_empty_list(results: TestResults, token: str):
    """Test 12: PUT /api/flavours - Empty list"""
    print(f"\n{YELLOW}[TEST 12] PUT /api/flavours (EMPTY LIST){RESET}")
    
    if not token:
        results.add_fail("PUT /api/flavours empty list", "No token available from login test")
        return
    
    try:
        response = requests.put(
            f"{BACKEND_URL}/flavours",
            json={"items": []},
            headers={"Authorization": f"Bearer {token}"},
            timeout=10
        )
        
        if response.status_code != 200:
            results.add_fail(
                "PUT /api/flavours with empty list returns 200",
                f"Expected 200, got {response.status_code}"
            )
            return
        
        results.add_pass("PUT /api/flavours with empty list returns 200")
        
        # Verify empty list is saved
        get_response = requests.get(f"{BACKEND_URL}/flavours", timeout=10)
        get_data = get_response.json()
        saved_items = get_data.get("items", [])
        
        if len(saved_items) != 0:
            results.add_fail(
                "Empty list saved correctly",
                f"Expected 0 items, got {len(saved_items)}"
            )
            return
        
        results.add_pass("Empty list saved correctly")
        
    except Exception as e:
        results.add_fail("PUT /api/flavours empty list", f"Exception: {str(e)}")


def test_end_to_end_round_trip(results: TestResults):
    """Test 13: End-to-end round trip"""
    print(f"\n{YELLOW}[TEST 13] END-TO-END ROUND TRIP{RESET}")
    
    # Login
    try:
        login_response = requests.post(
            f"{BACKEND_URL}/auth/login",
            json={"username": ADMIN_USERNAME, "password": ADMIN_PASSWORD},
            timeout=10
        )
        
        if login_response.status_code != 200:
            results.add_fail("E2E: Login", f"Login failed with {login_response.status_code}")
            return
        
        token = login_response.json()["token"]
        results.add_pass("E2E: Login successful")
        
        # Test 1: Save 3 flavours
        three_flavours = [
            {"name": "Mátová", "color": "#98FF98"},
            {"name": "Karamelová", "color": "#C68E17"},
            {"name": "Ořechová", "color": "#8B4513"},
        ]
        
        put_response = requests.put(
            f"{BACKEND_URL}/flavours",
            json={"items": three_flavours},
            headers={"Authorization": f"Bearer {token}"},
            timeout=10
        )
        
        if put_response.status_code != 200:
            results.add_fail("E2E: Save 3 flavours", f"PUT failed with {put_response.status_code}")
            return
        
        results.add_pass("E2E: Save 3 flavours")
        
        # Get and verify
        get_response = requests.get(f"{BACKEND_URL}/flavours", timeout=10)
        saved_items = get_response.json().get("items", [])
        
        if len(saved_items) != 3:
            results.add_fail("E2E: Verify 3 flavours", f"Expected 3, got {len(saved_items)}")
            return
        
        for idx, (expected, actual) in enumerate(zip(three_flavours, saved_items)):
            if expected["name"] != actual.get("name") or expected["color"] != actual.get("color"):
                results.add_fail("E2E: Verify 3 flavours match", f"Mismatch at index {idx}")
                return
        
        results.add_pass("E2E: Verify 3 flavours match")
        
        # Test 2: Save 10 flavours
        ten_flavours = [
            {"name": f"Příchuť {i+1}", "color": f"#{(i*25):02X}{(i*25):02X}{(i*25):02X}"}
            for i in range(10)
        ]
        
        put_response = requests.put(
            f"{BACKEND_URL}/flavours",
            json={"items": ten_flavours},
            headers={"Authorization": f"Bearer {token}"},
            timeout=10
        )
        
        if put_response.status_code != 200:
            results.add_fail("E2E: Save 10 flavours", f"PUT failed with {put_response.status_code}")
            return
        
        results.add_pass("E2E: Save 10 flavours")
        
        # Get and verify
        get_response = requests.get(f"{BACKEND_URL}/flavours", timeout=10)
        saved_items = get_response.json().get("items", [])
        
        if len(saved_items) != 10:
            results.add_fail("E2E: Verify 10 flavours", f"Expected 10, got {len(saved_items)}")
            return
        
        results.add_pass("E2E: Verify 10 flavours")
        
        # Test 3: Save 0 flavours
        put_response = requests.put(
            f"{BACKEND_URL}/flavours",
            json={"items": []},
            headers={"Authorization": f"Bearer {token}"},
            timeout=10
        )
        
        if put_response.status_code != 200:
            results.add_fail("E2E: Save 0 flavours", f"PUT failed with {put_response.status_code}")
            return
        
        results.add_pass("E2E: Save 0 flavours")
        
        # Get and verify
        get_response = requests.get(f"{BACKEND_URL}/flavours", timeout=10)
        saved_items = get_response.json().get("items", [])
        
        if len(saved_items) != 0:
            results.add_fail("E2E: Verify 0 flavours", f"Expected 0, got {len(saved_items)}")
            return
        
        results.add_pass("E2E: Verify 0 flavours (empty list)")
        
    except Exception as e:
        results.add_fail("E2E round trip", f"Exception: {str(e)}")


def main():
    print(f"\n{BLUE}{'='*60}{RESET}")
    print(f"{BLUE}Backend API Testing - Ice Cream Shop Admin{RESET}")
    print(f"{BLUE}{'='*60}{RESET}")
    print(f"Backend URL: {BACKEND_URL}")
    print(f"Admin User: {ADMIN_USERNAME}")
    print(f"{BLUE}{'='*60}{RESET}\n")
    
    results = TestResults()
    
    # Test 1: Public flavours endpoint
    test_get_flavours_public(results)
    
    # Test 2-4: Login tests
    token = test_login_correct_credentials(results)
    test_login_wrong_credentials(results)
    test_login_validation_errors(results)
    
    # Test 5-7: Verify tests
    test_verify_with_valid_token(results, token)
    test_verify_without_token(results)
    test_verify_with_invalid_token(results)
    
    # Test 8-12: PUT flavours tests
    test_put_flavours_without_token(results)
    test_put_flavours_with_token(results, token)
    test_put_flavours_max_items(results, token)
    test_put_flavours_more_than_10(results, token)
    test_put_flavours_empty_list(results, token)
    
    # Test 13: End-to-end round trip
    test_end_to_end_round_trip(results)
    
    # Print summary
    success = results.summary()
    
    # Exit with appropriate code
    sys.exit(0 if success else 1)


if __name__ == "__main__":
    main()
