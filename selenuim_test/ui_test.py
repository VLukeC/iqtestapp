import os
import random
import string
from urllib.parse import urlparse

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait


BASE_URL = os.environ.get("TEST_BASE_URL", "http://localhost:5173").rstrip("/")
WAIT_SECONDS = int(os.environ.get("TEST_WAIT_SECONDS", "20"))
TEST_EMAILS = ["selenium-invalid@example.com"]
PASSWORD_LENGTHS = [0, 1, 8, 16]

VALID_EMAIL = os.environ.get("TEST_LOGIN_EMAIL", "sam_shojaie@yahoo.com")
VALID_PASSWORD = os.environ.get("TEST_LOGIN_PASSWORD", "123456")

EXPECTED_REJECTIONS = {
    "invalid login credentials",
    "missing email or password",
}


def generate_password(length):
    characters = string.ascii_letters + string.digits + "!@#$%^&*"
    password = "".join(random.choices(characters, k=length))

    while VALID_PASSWORD is not None and password == VALID_PASSWORD:
        password = "".join(random.choices(characters, k=length))

    return password


def reset_session(driver):
    driver.get(BASE_URL)
    driver.delete_all_cookies()
    driver.execute_script(
        "window.localStorage.clear();"
        "window.sessionStorage.clear();"
    )


def submit_login(driver, email, password):
    wait = WebDriverWait(driver, WAIT_SECONDS)
    driver.get(f"{BASE_URL}/login")

    email_input = wait.until(
        EC.visibility_of_element_located(
            (By.CSS_SELECTOR, 'input[type="email"]')
        )
    )
    email_input.clear()
    email_input.send_keys(email)

    password_input = driver.find_element(
        By.CSS_SELECTOR, 'input[type="password"]'
    )
    password_input.clear()
    if password:
        password_input.send_keys(password)

    wait.until(
        EC.element_to_be_clickable(
            (By.XPATH, "//button[normalize-space()='Login']")
        )
    ).click()


def wait_for_login_result(driver):
    def login_result(browser):
        logout_buttons = browser.find_elements(
            By.XPATH, "//button[normalize-space()='Logout']"
        )
        if any(button.is_displayed() for button in logout_buttons):
            return ("success", "")

        errors = browser.find_elements(
            By.CSS_SELECTOR, "p.text-red-400"
        )
        for error in errors:
            if error.is_displayed():
                message = error.text.strip()
                if message:
                    return ("error", message)

        return False

    return WebDriverWait(driver, WAIT_SECONDS).until(login_result)


def test_invalid_login(driver, email, password, expected_rejections=EXPECTED_REJECTIONS):
    submit_login(driver, email, password)
    result, message = wait_for_login_result(driver)

    if result != "error":
        raise AssertionError("Invalid credentials unexpectedly logged in")

    if message.casefold() not in expected_rejections:
        raise AssertionError(
            f"Unexpected error instead of credential rejection: {message}"
        )


def test_valid_login(driver, email, password):
    submit_login(driver, email, password)
    result, message = wait_for_login_result(driver)

    if result != "success":
        raise AssertionError(f"Valid login was rejected: {message}")



def submit_signup(driver, email, password, confirmation):
    driver.get(f"{BASE_URL}/signup")
    wait = WebDriverWait(driver, WAIT_SECONDS)
    for placeholder, value in [
        ("Email", email), ("Password", password), ("Confirm Password", confirmation),
    ]:
        field = wait.until(EC.visibility_of_element_located(
            (By.CSS_SELECTOR, f'input[placeholder="{placeholder}"]')
        ))
        field.clear()
        if value:
            field.send_keys(value)
    wait.until(EC.element_to_be_clickable(
        (By.XPATH, "//button[normalize-space()='Sign Up']")
    )).click()


def wait_for_signup_result(driver):
    def signup_result(browser):
        for error in browser.find_elements(By.CSS_SELECTOR, "div.text-red-300"):
            if error.is_displayed() and error.text.strip():
                return ("error", error.text.strip())

        path = urlparse(browser.current_url).path.rstrip("/")
        if path == "/login":
            return ("success", "")
        if path == "" and any(element.is_displayed() for element in
            browser.find_elements(By.XPATH, "//button[normalize-space()='Logout']")):
            return ("success", "")
        return False
    return WebDriverWait(driver, WAIT_SECONDS).until(signup_result)


def test_invalid_signup(driver, email, password, confirmation, expected_error):
    submit_signup(driver, email, password, confirmation)
    result, message = wait_for_signup_result(driver)
    if result != "error" or message != expected_error:
        raise AssertionError(f"Expected signup rejection: {expected_error}; got {result}: {message}")
    if urlparse(driver.current_url).path.rstrip("/") != "/signup":
        raise AssertionError("Invalid signup navigated away from signup")
    button = driver.find_element(By.XPATH, "//button[normalize-space()='Sign Up']")
    if not button.is_enabled():
        raise AssertionError("Signup button remained disabled after validation failure")


def test_valid_signup(driver, email, password):
    submit_signup(driver, email, password, password)
    result, message = wait_for_signup_result(driver)
    if result != "success":
        raise AssertionError(f"Valid signup was rejected: {message}")
    
def setting_test(driver, email, password):
    test_valid_login(driver, email, password)
    #http://localhost:5173/account

def main():
    if bool(VALID_EMAIL) != bool(VALID_PASSWORD):
        raise SystemExit("Set both TEST_LOGIN_EMAIL and TEST_LOGIN_PASSWORD, or neither.")
    

    options = webdriver.ChromeOptions()
    if os.environ.get("TEST_HEADLESS", "0") == "1":
        options.add_argument("--headless=new")
    options.add_argument("--window-size=1280,900")
    driver = webdriver.Chrome(options=options)
    failures = []
    passed = 0
    skipped = 0

    def run_case(name, test, *args):
        nonlocal passed
        try:
            reset_session(driver)
            test(driver, *args)
            passed += 1
            print(f"PASS: {name}")
        except Exception as error:
            failures.append(name)
            # Do not print raw WebDriver exceptions, which may contain credentials.
            print(f"FAIL: {name}: {type(error).__name__}")
            if isinstance(error, AssertionError):
                print(str(error))

    try:
        for email in TEST_EMAILS:
            for length in PASSWORD_LENGTHS:
                run_case(
                    f"invalid login: password length {length}",
                    test_invalid_login, email, generate_password(length),
                )
        run_case("login with missing email", test_invalid_login, "", "test-password", {"missing email or phone"})
        if VALID_EMAIL and VALID_PASSWORD:
            run_case("valid login", test_valid_login, VALID_EMAIL, VALID_PASSWORD)
        else:
            skipped += 1
            print("SKIP: valid login (set TEST_LOGIN_EMAIL and TEST_LOGIN_PASSWORD)")

        for name, email, password, confirmation, expected in [
            ("empty fields", "", "", "", "Please fill in all required fields."),
            ("missing email", "", "secret123", "secret123", "Please fill in all required fields."),
            ("missing password", "test@example.com", "", "secret123", "Please fill in all required fields."),
            ("missing confirmation", "test@example.com", "secret123", "", "Please fill in all required fields."),
            ("mismatched passwords", "test@example.com", "secret123", "different123", "Passwords do not match."),
            ("short password", "test@example.com", "12345", "12345", "Password must be at least 6 characters."),
        ]:
            run_case(f"signup: {name}", test_invalid_signup, email, password, confirmation, expected)

    finally:
        driver.quit()

    print(f"Results: {passed} passed, {len(failures)} failed, {skipped} skipped.")
    if failures:
        raise SystemExit("Failed tests:\n" + "\n".join(f"- {name}" for name in failures))


if __name__ == "__main__":
    main()
