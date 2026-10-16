import os

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait
from selenium.common.exceptions import TimeoutException, UnexpectedAlertPresentException

BASE_URL = os.environ.get("TEST_BASE_URL", "http://localhost:5173").rstrip("/")
WAIT_SECONDS = int(os.environ.get("TEST_WAIT_SECONDS", "20"))
VALID_EMAIL = os.environ.get("TEST_LOGIN_EMAIL", "lreed0383@gmail.com")
VALID_PASSWORD = os.environ.get("TEST_LOGIN_PASSWORD", "123123")


def reset_session(driver):
    driver.get(BASE_URL)
    driver.delete_all_cookies()
    driver.execute_script("window.localStorage.clear();" "window.sessionStorage.clear();")


def submit_login(driver, email, password):
    wait = WebDriverWait(driver, WAIT_SECONDS)
    driver.get(f"{BASE_URL}/login")
    email_input = wait.until(EC.visibility_of_element_located((By.CSS_SELECTOR, 'input[type="email"]')))
    email_input.clear()
    email_input.send_keys(email)
    password_input = driver.find_element(By.CSS_SELECTOR, 'input[type="password"]')
    password_input.clear()
    if password:
        password_input.send_keys(password)
    wait.until(EC.element_to_be_clickable((By.XPATH, "//button[normalize-space()='Login']"))).click()


def wait_for_login_result(driver):
    def login_result(browser):
        logout_buttons = browser.find_elements(By.XPATH, "//button[normalize-space()='Logout']")
        if any(button.is_displayed() for button in logout_buttons):
            return ("success", "")
        errors = browser.find_elements(By.CSS_SELECTOR, "p.text-red-400")
        for error in errors:
            if error.is_displayed() and error.text.strip():
                return ("error", error.text.strip())
        return False
    return WebDriverWait(driver, WAIT_SECONDS).until(login_result)


def dismiss_alert(driver):
    try:
        alert = WebDriverWait(driver, 2).until(EC.alert_is_present())
        print(f"ALERT: {alert.text}", flush=True)
        alert.accept()
    except TimeoutException:
        pass


def test_quiz_generation(driver, length):
    wait = WebDriverWait(driver, 120)
    if not VALID_EMAIL or not VALID_PASSWORD:
        raise AssertionError("Quiz testing requires valid login credentials")
    submit_login(driver, VALID_EMAIL, VALID_PASSWORD)
    result, message = wait_for_login_result(driver)
    if result != "success":
        raise AssertionError(f"Quiz login failed: {message}")
    print("PASS: Logged in for quiz testing", flush=True)

    driver.get(BASE_URL)
    wait.until(EC.element_to_be_clickable((By.XPATH, "//button[normalize-space()='Start Quiz'] | //a[normalize-space()='Start Quiz']"))).click()

    def find_quiz_input(browser):
        try:
            elements = browser.find_elements(By.CSS_SELECTOR, 'input[name="quizLength"]')
            return elements[0] if elements and elements[0].is_displayed() else False
        except UnexpectedAlertPresentException:
            dismiss_alert(browser)
            return False

    quiz_input = wait.until(find_quiz_input)
    length_button = wait.until(EC.element_to_be_clickable((By.XPATH, f"//button[@type='button' and normalize-space()='{length}']")))
    length_button.click()
    assert quiz_input.get_attribute("value") == str(length), f"Expected selected length {length}, got {quiz_input.get_attribute('value')}"
    print(f"PASS: Selected {length} questions", flush=True)
    wait.until(EC.element_to_be_clickable((By.XPATH, "//button[normalize-space()='Start Quiz']"))).click()
    print(f"Generating {length} questions...", flush=True)

    def quiz_ready(browser):
        for alert in browser.find_elements(By.CSS_SELECTOR, '[role="alert"]'):
            if alert.is_displayed() and alert.text.strip():
                raise AssertionError(f"Quiz generation failed: {alert.text}")
        options = browser.find_elements(By.CSS_SELECTOR, 'input[type="radio"][name="answer"]')
        return len(options) == 4

    wait.until(quiz_ready)
    print("PASS: Quiz generated successfully", flush=True)
    question_texts = []
    for index in range(length):
        question = wait.until(EC.visibility_of_element_located((By.CSS_SELECTOR, "p.text-2xl.font-semibold")))
        question_text = question.text.strip()
        assert question_text, f"Question {index + 1} is empty"
        question_texts.append(question_text)
        options = driver.find_elements(By.CSS_SELECTOR, 'input[type="radio"][name="answer"]')
        assert len(options) == 4, f"Question {index + 1} has {len(options)} options instead of 4"
        for option in options:
            assert option.get_attribute("value").strip(), f"Question {index + 1} contains an empty answer option"
        options[0].click()
        assert options[0].is_selected(), f"Answer selection failed for question {index + 1}"
        print(f"PASS: Question {index + 1} has text, 4 options, and selectable answers", flush=True)
        if index < length - 1:
            wait.until(EC.element_to_be_clickable((By.XPATH, "//button[normalize-space()='Next']"))).click()
            wait.until(lambda browser: browser.find_element(By.CSS_SELECTOR, "p.text-2xl.font-semibold").text.strip() != question_text)
    assert len(set(question_texts)) == length, "Duplicate questions were generated"
    print("PASS: No duplicate questions", flush=True)
    submit_button = wait.until(EC.visibility_of_element_located((By.XPATH, "//button[normalize-space()='Submit Quiz']")))
    assert submit_button.is_enabled(), "Submit Quiz button is disabled on the final question"
    print("PASS: Submit Quiz button available on final question", flush=True)
    if length > 1:
        wait.until(EC.element_to_be_clickable((By.XPATH, "//button[normalize-space()='Previous']"))).click()
        wait.until(lambda browser: browser.find_element(By.CSS_SELECTOR, "p.text-2xl.font-semibold").text.strip() == question_texts[-2])
        selected_options = driver.find_elements(By.CSS_SELECTOR, 'input[type="radio"][name="answer"]:checked')
        assert len(selected_options) == 1, "Previously selected answer was not preserved"
        print("PASS: Previous question navigation works", flush=True)
        print("PASS: Previous answer selection preserved", flush=True)
    print(f"PASS: {length}-question quiz UI test completed", flush=True)


def main():
    options = webdriver.ChromeOptions()
    if os.environ.get("TEST_HEADLESS", "0") == "1":
        options.add_argument("--headless=new")
    options.add_argument("--window-size=1280,900")
    driver = webdriver.Chrome(options=options)
    driver.set_page_load_timeout(120)
    failures = []
    passed = 0

    def run_case(name, test, *args):
        nonlocal passed
        try:
            reset_session(driver)
            test(driver, *args)
            passed += 1
            print(f"PASS: {name}")
        except Exception as error:
            failures.append(name)
            print(f"FAIL: {name}: {type(error).__name__}")
            if isinstance(error, AssertionError):
                print(str(error))

    try:
        run_case("Generate 5-question quiz", test_quiz_generation, 5)
        run_case("Generate 10-question quiz", test_quiz_generation, 10)
    finally:
        driver.quit()
    print(f"Results: {passed} passed, {len(failures)} failed.")
    if failures:
        raise SystemExit("Failed tests:\n" + "\n".join(f"- {name}" for name in failures))


if __name__ == "__main__":
    main()
