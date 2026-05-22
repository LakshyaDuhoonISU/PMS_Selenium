# Selenium UI tests (Maven)

This folder contains a small Maven project that runs Selenium end-to-end tests against the frontend running at `http://localhost:3000`.

Prerequisites:

- Java 17+ installed
- Maven installed
- Chrome browser installed (or update tests to use a different browser)

Run tests:

```bash
cd tests/selenium
mvn test
```

Notes:

- Tests use WebDriverManager to automatically download the correct ChromeDriver.
- Ensure the backend (`npm run dev` in `backend`) and frontend (`npm run dev` in `frontend`) are running on `localhost:3000` and `localhost:3000` respectively (frontend is default). If your frontend is on a different port change the `BASE_URL` in the test.
