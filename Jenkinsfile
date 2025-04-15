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
                    sh 'cp -r dist/assets "$WORKSPACE/src/main/resources/static/"'
                    sh 'cp dist/index.html "$WORKSPACE/src/main/resources/static/"'
                }
            }
        }
        stage('Build Backend (Spring Boot)') {
            agent any
            steps {
                dir('src') {
                    sh './mvnw clean package -DskipTests'
                }
            }
        }
    }

}