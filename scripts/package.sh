#!/bin/bash
set -e

UI_HOME_FOLDER="/Users/v4mpc/repo/gims/console"
UI_DIST_FOLDER="${UI_HOME_FOLDER}/dist"
BACKEND_STATIC_FOLDER="/Users/v4mpc/repo/gims/src/main/resources/static"
BACKEND_TEMPLATES_FOLDER="/Users/v4mpc/repo/gims/src/main/resources/templates"




BUILD_ID='001'

#echo "Building UI project"
#cd ${UI_HOME_FOLDER} && yarn build
#
#echo "Copy build artifacts to Spring Boot"
#rm "${BACKEND_STATIC_FOLDER}"/assets/*.js
#rm "${BACKEND_STATIC_FOLDER}"/assets/*.css
#cp -r "${UI_DIST_FOLDER}/assets" ${BACKEND_STATIC_FOLDER}
#
#rm "${BACKEND_TEMPLATES_FOLDER}/index.html"
#cp "${UI_DIST_FOLDER}/index.html" ${BACKEND_TEMPLATES_FOLDER}
#


echo "Building container image"
docker build --no-cache --tag vampc/gims:latest --tag vampc/gims:v${BUILD_ID} -f /Users/v4mpc/repo/gims/docker/Dockerfile /Users/v4mpc/repo/gims && \

set -a && \
source .env && \
set +a && \

echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin && \

docker push vampc/gims:v${BUILD_ID}

docker logout




