import os
import random
import string

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait


BASE_URL = "http://localhost:5173"
TEST_EMAILS = ["sam_shojaie@yahoo.com", "test@example.com"]
PASSWORD_LENGTHS = [0, 1, 8, 16]

VALID_EMAIL = os.environ.get("TEST_LOGIN_EMAIL", TEST_EMAILS[0])
VALID_PASSWORD = os.environ.get("TEST_LOGIN_PASSWORD")

# Match the messages returned by your app's authentication service.
EXPECTED_REJECTIONS = {
    "invalid login credentials",
    "missing email or password",
}


def generate_password(length):
    characters = string.ascii_letters + string.digits + "!@#$%^&*"
    password = "".join(random.choices(characters, k=length))

    # Ensure a negative case doesn't use the known valid password.
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
    wait = WebDriverWait(driver, 15)
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

    return WebDriverWait(driver, 15).until(login_result)


def test_invalid_login(driver, email, password):
    submit_login(driver, email, password)
    result, message = wait_for_login_result(driver)

    if result != "error":
        raise AssertionError("Invalid credentials unexpectedly logged in")

    if message.casefold() not in EXPECTED_REJECTIONS:
        raise AssertionError(
            f"Unexpected error instead of credential rejection: {message}"
        )


def test_valid_login(driver, email, password):
    submit_login(driver, email, password)
    result, message = wait_for_login_result(driver)

    if result != "success":
        raise AssertionError(f"Valid login was rejected: {message}")


def main():

    driver = webdriver.Chrome()
    failures = []

    def run_case(name, test, email, password):
        try:
            reset_session(driver)
            test(driver, email, password)
            print(f"PASS: {name}")
        except Exception as error:
            failures.append(name)
            print(f"FAIL: {name}: {type(error).__name__}: {error}")

    try:
        for email in TEST_EMAILS:
            for length in PASSWORD_LENGTHS:
                run_case(
                    f"invalid login: {email}, password length {length}",
                    test_invalid_login,
                    email,
                    generate_password(length),
                )

        run_case(
            f"valid login: {VALID_EMAIL}",
            test_valid_login,
            VALID_EMAIL,
            VALID_PASSWORD,
        )

    
    
    finally:
        driver.quit()

    if failures:
        raise SystemExit(
            "Failed tests:\n" + "\n".join(f"- {name}" for name in failures)
        )

    print("All login tests passed!")


if __name__ == "__main__":
    main()