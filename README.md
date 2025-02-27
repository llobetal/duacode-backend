Proyecto Duacode Backend

Este es el backend de la API Duacode. Proporciona un conjunto de endpoints RESTful para gestionar información relacionada con los usuarios y duacoders, incluyendo autenticación, creación y exportación de datos en varios formatos.

Requisitos previos

Antes de empezar, asegúrate de tener instalado en tu máquina lo siguiente:

Node.js (versión 16.x o superior) - Descargar Node.js
MySQL (o MariaDB) - Instalar MySQL
Docker (si prefieres usar Docker para gestionar la base de datos) - Instalar Docker
Configuración opcional
Si quieres correr la base de datos dentro de un contenedor Docker, puedes hacerlo siguiendo las instrucciones abajo.

Clonar el proyecto

Primero, clona el repositorio de GitHub en tu máquina local:

git clone https://github.com/tu-usuario/duacode-backend.git

Instalar dependencias

Una vez dentro del directorio del proyecto, ejecuta el siguiente comando para instalar todas las dependencias:

npm install

Esto instalará todas las librerías necesarias para ejecutar la API, como NestJS, TypeORM, MySQL, etc.

Configuración de variables de entorno

El proyecto utiliza variables de entorno para gestionar configuraciones sensibles, como credenciales de la base de datos y claves de autenticación. Crea un archivo .env en la raíz del proyecto (o usa el archivo .env.example si existe) con el siguiente contenido:

DB_HOST=127.0.0.1   # Cambia esto si usas Docker u otra IP para la base de datos
DB_PORT=3306        # Puerto de MySQL
DB_USERNAME=root    # Usuario de MySQL
DB_PASSWORD=tu_clave # Contraseña de MySQL
DB_DATABASE=duacode # Nombre de la base de datos
JWT_SECRET=tu_secreto_de_jwt
Si estás usando Docker para la base de datos, ajusta el DB_HOST a la dirección IP del contenedor de Docker. Un ejemplo con Docker sería:


Migraciones de la base de datos

El proyecto utiliza TypeORM para interactuar con la base de datos. Para asegurarte de que la estructura de la base de datos esté actualizada, ejecuta las migraciones:

npm run migration:run
npm run seed

Esto creará las tablas necesarias en la base de datos según las definiciones de las entidades e insertará datos de ejemplo junto a un usuario admin para probar la autorización.

Ejecutar el proyecto

Una vez que las dependencias estén instaladas y la base de datos configurada, puedes iniciar el proyecto en modo desarrollo utilizando el siguiente comando:

npm run start:dev

Esto ejecutará la API en http://localhost:3000. Si todo está correctamente configurado, se verá algo como esto en la terminal:

[Nest] 32284  - 02/26/2025, 3:39:30 PM   LOG [NestApplication] Nest application successfully started

Verificar la API

Puedes probar que la API esté funcionando abriendo tu navegador y visitando:

http://localhost:3000/

Esto debería mostrar un mensaje como "Hello World!" si todo está configurado correctamente.

Usar la API

El proyecto utiliza JSON Web Tokens (JWT) para autenticar a los usuarios. Para autenticarte, debes enviar una solicitud POST a un endpoint de login, que te devolverá el token. Un ejemplo de cómo hacerlo sería:

Endpoint de login:

POST http://localhost:3000/auth/login

Body de la solicitud:

{
  "username": "admin",
  "password": "admin123"
}

La respuesta será un objeto JSON con el token:

{
  "access_token": "tu_token_aqui"
}

Este token debe ser incluido en los encabezados de las solicitudes posteriores como un Bearer token.

Ejemplo de solicitud con autenticación

Para probar los endpoints que requieren autenticación (por ejemplo, exportar los datos), debes incluir el token JWT en el encabezado Authorization de la solicitud:

Ejemplo con fetch en el navegador (F12/Consola):

const token = 'tu_token_aqui';  // Reemplaza con el token obtenido

fetch('http://localhost:3000/api/duacoders/export/excel', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
  },
})
  .then(response => response.blob())
  .then(blob => {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'duacoders.xlsx';  // Nombre del archivo
    link.click();
  })
  .catch(error => console.error('Error:', error));

Endpoints disponibles

GET /api/duacoders

Obtiene una lista de todos los duacoders registrados.

POST /api/duacoders

Crea un nuevo duacoder.

Body de la solicitud:

{
  "nif": "12345678A",
  "nombre": "Paco Pérez",
  "biografia": "Desarrollador NodeJS y NestJS",
  "departamento": "Desarrollo",
  "puesto": "Backend Developer",
  "skills": ["NodeJS", "NestJS", "TypeORM"],
  "foto": "https://example.com/foto1.jpg",
  "OmeletteType": "WITH_ONION",
  "fechaNacimiento": "1990-01-01"
}

GET /api/duacoders/:nif

Obtiene los detalles de un duacoder por su NIF.

PUT /api/duacoders/:nif

Actualiza los datos de un duacoder.

DELETE /api/duacoders/:nif

Elimina un duacoder por su NIF.

GET /api/duacoders/export/excel

Exporta los duacoders a un archivo Excel.

GET /api/duacoders/export/pdf/:nif

Exporta los detalles de un duacoder a un archivo PDF.

Scripts adicionales

Ejecutar las migraciones: npm run migration:run
Ver logs en desarrollo: npm run start:dev
Iniciar el proyecto en producción: npm run start:prod

Tecnologías utilizadas

NestJS: Framework de Node.js para construir aplicaciones del lado del servidor.
TypeORM: ORM para interactuar con la base de datos.
JWT: Para manejar la autenticación de usuarios.
MySQL: Base de datos relacional.