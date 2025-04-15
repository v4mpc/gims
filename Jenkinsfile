pipeline {
    agent none

    stages{
        stage('Build Frontend (Node.js with Yarn)') {
            agent {
                docker {
                    image 'node:18-alpine'
                    reuseNode true

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