
set COMPOSE_DIR=C:\Users\nancy\repo\gims\docker

cd /d %COMPOSE_DIR%

docker compose down

docker compose pull

docker compose up -d