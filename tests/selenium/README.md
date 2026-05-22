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
- Ensure the backend and frontend are running before executing the tests.
- Jenkins/TestNG report pattern: `**/testng-results.xml`.
- If your frontend is on a different port, change the `BASE_URL` in the test or pass `-DbaseUrl=http://localhost:5173` to Maven.
