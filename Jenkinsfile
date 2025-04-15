pipeline {
    agent none

    stages {
        stage('Build Frontend') {
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

        stage('Build Image') {
            agent any
            steps {
                sh 'docker build --tag vampc/gims:latest --tag vampc/gims:v${BUILD_ID} -f docker/Dockerfile .'

            }
        }

        stage('Login to Docker') {
            agent any
            steps {
                withCredentials([
                        string(credentialsId: 'DOCKER_USERNAME', variable: 'DOCKER_USERNAME'),
                        string(credentialsId: 'DOCKER_PASSWORD', variable: 'DOCKER_PASSWORD')
                ]) {
                    sh 'echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin'
                }
            }
        }

        stage('Publish Container') {
            agent any
            steps {
                script{
                    if (env.BRANCH_NAME == 'main') {
                        sh "docker push vampc/gims:latest"
                    }
                }
                sh 'docker push vampc/gims:v${BUILD_ID}'

            }
        }


    }

    post {
        always {
            node {
                sh 'docker logout'
            }
        }
    }

}