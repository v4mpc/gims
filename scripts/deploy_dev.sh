#!/bin/bash


UI_HOME_FOLDER="/Users/v4mpc/repo/gims/console"
UI_DIST_FOLDER="${UI_HOME_FOLDER}/dist"
BACKEND_STATIC_FOLDER="/Users/v4mpc/repo/gims/src/main/resources/static"
BACKEND_TEMPLATES_FOLDER="/Users/v4mpc/repo/gims/src/main/resources/templates"


# Find the container ID using port 5432
container_id=$(docker ps --filter "publish=5432" --format "{{.ID}}") && \

# Check if a container ID was found
if [ -n "$container_id" ]; then
  echo "Stopping container using port 5432: $container_id"
  docker stop "$container_id"
else
  echo "No container is using port 5432."
fi



docker-compose -f /Users/v4mpc/repo/gims/docker/docker-compose-db.yml up -d  && \



echo "Building UI project"
cd ${UI_HOME_FOLDER} && yarn build && \

echo "Copy build artifacts to Spring Boot"
rm "${BACKEND_STATIC_FOLDER}"/assets/*.js
rm "${BACKEND_STATIC_FOLDER}"/assets/*.css
cp -r "${UI_DIST_FOLDER}/assets" ${BACKEND_STATIC_FOLDER}

rm "${BACKEND_TEMPLATES_FOLDER}/index.html"
cp "${UI_DIST_FOLDER}/index.html" ${BACKEND_TEMPLATES_FOLDER}

cd /Users/v4mpc/repo/gims && ./mvnw clean package && java -jar /Users/v4mpc/repo/gims/target/gims-0.0.1-SNAPSHOT.jar --spring.profiles.active=dev





