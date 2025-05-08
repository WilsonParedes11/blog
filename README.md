Blog - Sistema de Gestión de Publicaciones

Este repositorio contiene un sistema de gestión de publicaciones compuesto por un backend desarrollado en Laravel y un frontend construido con Vue 3 y Vite. El objetivo del proyecto es permitir a los usuarios gestionar publicaciones de blog, con funcionalidades como creación, edición, eliminación y visualización de publicaciones, además de interacción mediante comentarios y categorías.

## Estructura del Proyecto

blog-backend/   # Backend del proyecto (Laravel)  
blog-frontend/  # Frontend del proyecto (Vue 3 + Vite)

### Backend - Laravel

El backend está desarrollado con Laravel, un framework PHP robusto y escalable. Proporciona una API para gestionar las publicaciones, manejar la autenticación de usuarios y administrar comentarios y categorías.

### Frontend - Vue 3

El frontend está construido con Vue 3 y Vite, ofreciendo una interfaz de usuario moderna y reactiva para interactuar con el sistema.

## Requisitos Previos

Asegúrate de tener instaladas las siguientes herramientas en tu sistema:

- PHP >= 8.1  
- Composer >= 2.0  
- Node.js >= 16.x  
- npm >= 8.x  
- MySQL o cualquier base de datos compatible con Laravel  
- Git (opcional, para clonar el repositorio)

## Configuración del Proyecto

### 1. Clonar el Repositorio

git clone https://github.com/tu-usuario/blog.git  
cd blog

### 2. Configurar el Backend

cd blog-backend  
composer install  
cp .env.example .env  

Luego, edita el archivo .env para configurar la conexión a tu base de datos.

php artisan key:generate  
php artisan migrate  
# (Opcional) Ejecuta seeders si deseas datos de prueba:  
php artisan db:seed  
php artisan serve  

El backend estará disponible en: http://localhost:8000

### 3. Configurar el Frontend

cd ../blog-frontend  
npm install  
npm run dev  

El frontend estará disponible en: http://localhost:5174

## Scripts Útiles

### Backend

- php artisan serve: Inicia el servidor de desarrollo  
- php artisan migrate: Ejecuta las migraciones  
- php artisan db:seed: Población de datos de prueba

### Frontend

- npm run dev: Inicia el servidor de desarrollo  
- npm run build: Compila el proyecto para producción  
- npm run lint: Ejecuta el linter para verificar errores de código

## Notas Adicionales

- Asegúrate de que el backend y el frontend estén configurados para comunicarse correctamente. Por defecto, el backend debería estar en http://localhost:8000 y el frontend en http://localhost:5174.  
- Si estás desplegando el proyecto en un entorno de producción, asegúrate de configurar correctamente las variables de entorno y utilizar un servidor web como Nginx o Apache para el backend.

## Licencia

Este proyecto está licenciado bajo la MIT License.
"""

# Guardar el archivo
file_path = "/mnt/data/README.md"
with open(file_path, "w", encoding="utf-8") as f:
    f.write(readme_content)

file_path
