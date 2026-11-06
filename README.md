# TaskFlow

TaskFlow es una aplicación para registrar y procesar solicitudes. Incluye una interfaz Vue 3, una API Express con Socket.IO, un worker en segundo plano y MongoDB y Redis.

## Requisitos

- **Docker Desktop** con Docker Compose, para iniciar todo el proyecto con el método recomendado.
- Para desarrollo sin contenedores: **Node.js 20 o superior** y npm, además de MongoDB y Redis (puedes usar los contenedores de Docker para estos dos servicios).
- Puertos disponibles: `8080` (interfaz), `3000` (API), `27018` (MongoDB publicado por Docker) y `6380` (Redis publicado por Docker). En modo local, Vite usa `5173`.

## Iniciar todo con Docker

Desde la carpeta raíz del proyecto:

```powershell
docker compose up --build
```

Abre la aplicación en <http://localhost:8080>. La API queda disponible en <http://localhost:3000>.

Para detener los servicios, presiona `Ctrl+C`. Si los iniciaste en segundo plano con `docker compose up --build -d`, usa:

```powershell
docker compose down
```

MongoDB conserva los datos en el volumen `mongo_data` al detener los contenedores.

## Desarrollo local

1. Inicia MongoDB y Redis. Puedes iniciar los servicios de datos definidos por el proyecto con Docker:

   ```powershell
   docker compose up -d mongoserver redisserver
   ```

   Docker los publica en `localhost:27018` (MongoDB) y `localhost:6380` (Redis).

2. En `backend`, `worker` y `frontend`, crea el archivo `.env` a partir de `.env.example`. En PowerShell, desde la raíz:

   ```powershell
   Copy-Item backend\.env.example backend\.env
   Copy-Item worker\.env.example worker\.env
   Copy-Item frontend\.env.example frontend\.env
   ```

   Para backend y worker, ajusta los valores de conexión de sus archivos `.env` a los puertos publicados por Docker:

   ```dotenv
   MONGO_URI=mongodb://localhost:27018/taskflow
   REDIS_HOST=localhost
   REDIS_PORT=6380
   ```

   El `.env` del frontend puede conservar los valores de ejemplo (`VITE_API_URL=http://localhost:3000/api` y `VITE_SOCKET_URL=http://localhost:3000`).

3. Instala las dependencias de cada aplicación:

   ```powershell
   cd backend
   npm install
   cd ..\worker
   npm install
   cd ..\frontend
   npm install
   ```

4. Inicia cada proceso en una terminal distinta, desde la raíz del proyecto:

   ```powershell
   cd backend
   npm run dev
   ```

   ```powershell
   cd worker
   npm start
   ```

   ```powershell
   cd frontend
   npm run dev
   ```

   Abre <http://localhost:5173>. Para detener MongoDB y Redis al terminar:

   ```powershell
   docker compose down
   ```

## Compilar el frontend

Desde `frontend`:

```powershell
npm run build
```

El resultado de producción se genera en `frontend/dist`.
