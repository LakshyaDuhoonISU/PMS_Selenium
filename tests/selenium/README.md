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

## Running tests with a visible browser on Jenkins

By default CI agents are headless. To run tests with a real (non-headless) browser you have two common options:

1. Use `Xvfb` (recommended for classic Jenkins agents)

- Install `Xvfb` on the Jenkins agent and either install the Jenkins `Xvfb` plugin or use `xvfb-run`.
- Example (pipeline uses the plugin's `wrap([$class: 'Xvfb'])`): see `Jenkinsfile` at repository root.
- Alternatively, configure the job to run this wrapper script which automatically uses `xvfb-run` when no $DISPLAY is present:

```bash
cd tests/selenium
./run-tests.sh
```

2. Use a Selenium container with a real browser (exposes VNC for debugging)

- Use `selenium/standalone-chrome-debug` or `selenium/standalone-chrome` as the Docker image.
- `standalone-chrome-debug` includes a VNC server so you can connect and watch the browser.
- Example Jenkins pipeline snippet (commented) is included in the repository `Jenkinsfile`.

Important checklist for interactive runs

- Ensure Chrome (or Chromium) is installed on the agent or provided by the container.
- Ensure the Jenkins agent user can launch GUI processes or Xvfb is available.
- If you want to watch the test interactively, use `standalone-chrome-debug` and connect to its VNC port.

## Troubleshooting when Jenkins doesn't open a browser

1. Check the Jenkins console log for errors from ChromeDriver or Chrome. Look for lines mentioning "chrome" or "org.openqa.selenium".

2. Verify `DISPLAY` and Chrome presence on the agent. On the agent shell run:

```bash
echo "DISPLAY=$DISPLAY"
which google-chrome chromium chromium-browser || true
google-chrome --version || chromium-browser --version || true
```

3. If `DISPLAY` is not set, either enable `Xvfb` on the agent or run the pipeline inside a container that provides a browser. The provided `run-tests.sh` will automatically use `xvfb-run` if available and `$DISPLAY` is unset.

4. Ensure the pipeline actually passes `-Dheadless=false` to Maven. Example:

```bash
cd tests/selenium
./run-tests.sh -DbaseUrl=http://localhost:5173 -Dheadless=false
```

5. If Chrome isn't installed on the agent, prefer the Docker approach with `selenium/standalone-chrome-debug` (includes browser + VNC). The commented example in the `Jenkinsfile` shows how to run tests inside that container.

6. If tests still start headless, add logging to confirm the TestNG test reads the system property by printing its value in `@BeforeMethod` (the test currently defaults to headless=true if property missing).
