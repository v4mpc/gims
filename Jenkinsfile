pipeline {
    agent none

    stages{
        stage('Build Frontend (Node.js with Yarn)') {
            agent {
                docker {
                    image 'node:18-alpine'
                }
            }
            steps {
                dir('console') {
                    sh 'yarn install'
                    sh 'yarn build'
                }
            }
        }
    }

}