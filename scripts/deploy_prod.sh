#!/bin/bash

UI_HOME_FOLDER="/Users/v4mpc/repo/gims/console"
UI_DIST_FOLDER="${UI_HOME_FOLDER}/dist"
BACKEND_STATIC_FOLDER="/Users/v4mpc/repo/gims/src/main/resources/static"
BACKEND_TEMPLATES_FOLDER="/Users/v4mpc/repo/gims/src/main/resources/templates"

echo "Building UI project"
cd ${UI_HOME_FOLDER} && yarn build

echo "Copy build artifacts to Spring Boot"
rm "${BACKEND_STATIC_FOLDER}"/assets/*.js
rm "${BACKEND_STATIC_FOLDER}"/assets/*.css
cp -r "${UI_DIST_FOLDER}/assets" ${BACKEND_STATIC_FOLDER}

rm "${BACKEND_TEMPLATES_FOLDER}/index.html"
cp "${UI_DIST_FOLDER}/index.html" ${BACKEND_TEMPLATES_FOLDER}



echo "Building and Deploying to Production"

#cd /Users/v4mpc/repo/gims && ./mvnw spring-boot:build-image

cd /Users/v4mpc/repo/gims/ &&  docker build -t gims:1.0.0 -f /Users/v4mpc/repo/gims/docker/Dockerfile .


docker save -o /Users/v4mpc/Downloads/gims.tar gims:1.0.0


scp /Users/v4mpc/Downloads/gims.tar rootjsi:/tmp

ssh rootjsi /usr/bin/docker load -i /tmp/gims.tar



#
#
##ssh rootjsi rm /root/repo/gims/gims-1.0.0.jar
#scp /Users/v4mpc/repo/gims/target/gims-1.0.0.jar rootjsi:/root/repo/gims
##ssh rootjsi /usr/bin/supervisorctl restart gims:gims_00