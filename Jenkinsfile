pipeline {
    agent none

    stages{
        stage('Build Frontend (Node.js with Yarn)') {
            agent {
                docker {
                    image 'node:18-alpine'
                    reuseNode true
                    args '-v /var/run/docker.sock:/var/run/docker.sock'

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