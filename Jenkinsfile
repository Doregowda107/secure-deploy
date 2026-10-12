
pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/Doregowda107/secure-deploy.git'
            }
        }

        stage('Install Frontend Dependencies') {
            steps {
                dir('client') {
                    bat 'npm ci'
                }
            }
        }

        stage('Install Backend Dependencies') {
            steps {
                dir('server') {
                    bat 'npm ci'
                }
            }
        }

        stage('Frontend Lint') {
            steps {
                dir('client') {
                    bat 'npm run lint'
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir('client') {
                    bat 'npm run build'
                }
            }
        }

        stage('SonarQube Analysis') {
            steps {
                withCredentials([
                    string(
                        credentialsId: 'sonarqube-token',
                        variable: 'SONAR_TOKEN'
                    )
                ]) {
                    bat '''
                        sonar-scanner.bat ^
                          -D"sonar.projectKey=secure-deploy" ^
                          -D"sonar.sources=." ^
                          -D"sonar.host.url=http://localhost:9000" ^
                          -D"sonar.token=%SONAR_TOKEN%"
                    '''
                }
            }
        }
        
stage('SonarQube Quality Gate') {
    steps {
        timeout(time: 5, unit: 'MINUTES') {
            waitForQualityGate abortPipeline: true
        }
    }
}


        stage('Gitleaks Secret Scan') {
            steps {
                bat '''
                    docker run --rm -v "%CD%:/repo" ghcr.io/gitleaks/gitleaks:v8.30.1 detect --source="/repo" --no-banner
                '''
            }
        }

        stage('Build Frontend Docker Image') {
            steps {
                bat 'docker build -t secure-deploy-frontend:latest client'
            }
        }

        stage('Build Backend Docker Image') {
            steps {
                bat 'docker build -t secure-deploy-backend:latest server'
            }
        }

        stage('Trivy Frontend Image Scan') {
            steps {
                bat '''
                    docker run --rm -v /var/run/docker.sock:/var/run/docker.sock -v trivy-cache:/root/.cache/ aquasec/trivy:latest image --scanners vuln --severity HIGH,CRITICAL --exit-code 1 secure-deploy-frontend:latest
                '''
            }
        }

        stage('Trivy Backend Image Scan') {
            steps {
                bat '''
                    docker run --rm -v /var/run/docker.sock:/var/run/docker.sock -v trivy-cache:/root/.cache/ aquasec/trivy:latest image --scanners vuln --severity HIGH,CRITICAL --exit-code 1 secure-deploy-backend:latest
                '''
            }
        }
    }
}