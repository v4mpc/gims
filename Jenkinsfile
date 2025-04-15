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
        stage('Build Backend') {
            agent any
            steps {
                sh './mvnw clean package -DskipTests'

            }
        }

        stage('Build Container') {
            agent any
            steps {
                sh 'docker build --no-cache --tag vampc/gims:latest --tag vampc/gims:v${BUILD_ID} -f docker/Dockerfile .'

            }
        }

        stage('Publish Container') {
            agent any
            steps {
                sh 'echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin'
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
            sh 'docker logout'
        }
    }

}