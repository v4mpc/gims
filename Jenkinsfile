pipeline {
    agent none


    environment {
        JAVA_HOME = '/usr/lib/jvm/java-17-openjdk'
        PATH = "${JAVA_HOME}/bin:${env.PATH}"
    }

    stages{
        stage('Build Frontend (Node.js with Yarn)') {
            agent {
                docker {
                    image 'node:18-alpine' // Includes Yarn by default
                }
            }
            steps {
                dir('console') {
                    sh 'yarn install'
                    sh 'yarn build'
                    sh 'ls dist '
                }
            }
        }
    }

}