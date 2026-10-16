Run the login and signup Selenium tests with Chrome installed and the app running (`npm run dev` in a separate terminal).

```powershell
.venv\Scripts\python.exe -m pip install -r selenuim_test/requirements.txt
.venv\Scripts\python.exe selenuim_test/ui_test.py
```

By default, Chrome opens visibly. Valid login uses `sam_shojaie@yahoo.com` with password `123456`; no login environment variables are needed. You can override these with `TEST_LOGIN_EMAIL` and `TEST_LOGIN_PASSWORD`. Successful signup is skipped until its credentials are supplied:

```powershell
$env:TEST_SIGNUP_EMAIL = "your-new-test-account@example.com"
$env:TEST_SIGNUP_PASSWORD = "your-new-test-password"
.venv\Scripts\python.exe selenuim_test/ui_test.py
```

Use an unused email address you control for signup. This test contacts the real configured Supabase service, creates an account, and may send a confirmation email. It does not delete the account. Use a fresh test email on subsequent runs; Supabase may conceal duplicate registrations, so a UI redirect alone does not prove a new account was created. Signup accepts a redirect to login or an authenticated home page, depending on email confirmation settings. Confirm the account's email before using it for the successful login test if confirmation is enabled.

Optional environment variables:

- `TEST_BASE_URL`: defaults to `http://localhost:5173`.
- `TEST_HEADLESS=1`: optionally hide Chrome while running; it is visible by default.
- `TEST_WAIT_SECONDS`: defaults to `20`.

The script preserves the original random invalid-password cases and adds missing-email login and six signup validation cases. It prints PASS/FAIL/SKIP per case, returns a nonzero exit code on failure, and closes Chrome after the suite finishes. Live authentication errors such as service outages or rate limits count as failures, rather than valid credential rejections.




npx --yes supabase start -x logflare,vector,realtime

.\.venv\Scripts\python.exe api/api.py


npm run dev