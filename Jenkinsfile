pipeline {
  agent any
  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Run Selenium UI tests (with Xvfb)') {
      steps {
        // Option A: use Xvfb plugin on Jenkins (ensure plugin installed)
        wrap([$class: 'Xvfb']) {
          sh '''
            cd tests/selenium
            ./run-tests.sh
          '''
        }

        // Option B: run inside a Selenium container with real browser (requires Docker plugin or agent with Docker)
        // docker.image('selenium/standalone-chrome-debug:latest').inside('-e DISPLAY') {
        //   sh 'cd tests/selenium && mvn -DbaseUrl=http://localhost:5173 -Dheadless=false test'
        // }
      }
    }
  }
}
