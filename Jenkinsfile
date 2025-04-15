pipeline {
    agent any

    environment {
        SSH_CRED_ID = 'your-ssh-credential-id'  // Replace with your actual Jenkins SSH credentials ID
        REPO_URL = 'git@github.com:your-username/your-repo.git' // Must be SSH URL, not HTTPS
        BRANCH = 'main'
    }

    stages {
        stage('Checkout Repository') {
            steps {
                sh 'AM done'
                }
            }
        }

        stage('Verify Checkout') {
            steps {
                sh 'echo "Repository content:" && ls -la'
            }
        }
    }

    post {
        always {
            echo 'Pipeline execution complete.'
        }
    }
