#!/bin/bash

# Navega al directorio del repositorio
cd /home/softwaavanzado/proyecto2/saproyecto2

# Asegúrate de que estás en la rama correcta
git checkout develop

# Hace pull del último código
git pull origin develop

# Ejecuta Docker Compose
docker-compose up -d
