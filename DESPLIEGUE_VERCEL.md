# Guía de Despliegue en Vercel — VetCare Pro 🚀

Esta guía explica paso a paso cómo desplegar la plataforma **VetCare Pro** (Frontend Web + Backend Express) en **Vercel** de manera 100% gratuita.

---

## ❓ ¿Necesito una Base de Datos en la Nube?

**SÍ.** En tu computadora local usas una instancia local de MongoDB (`mongodb://localhost:27017`), pero en Vercel (la nube) los servidores necesitan conectarse a una base de datos accesible públicamente desde internet.

### 🍃 La Solución Gratuita: MongoDB Atlas
1. Crea una cuenta gratuita en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Crea un **Cluster Gratuito (Shared - Tier M0)**.
3. En la sección **Database Access**, crea un usuario de base de datos (ej. `vetuser` / `contraseña_segura`).
4. En **Network Access**, agrega la IP `0.0.0.0/0` (permitir conexiones desde cualquier lugar, necesario para Vercel).
5. Copia la cadena de conexión de MongoDB Atlas (URI), que se ve así:
   `mongodb+srv://vetuser:contraseña_segura@cluster0.mongodb.net/vetcarepro?retryWrites=true&w=majority`

---

## ⚙️ Estructura para Vercel (`vercel.json`)

Para que Vercel sirva tanto el Frontend React como la API de Express en el mismo dominio, se configura un archivo `vercel.json` en la raíz.

```json
{
  "version": 2,
  "builds": [
    {
      "src": "backend/index.js",
      "use": "@vercel/node"
    },
    {
      "src": "frontend/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "backend/index.js"
    },
    {
      "src": "/(.*)",
      "dest": "frontend/$1"
    }
  ]
}
```

---

## 🚀 Pasos para Desplegar en Vercel

### Paso 1: Subir el proyecto a GitHub
1. Inicia repositorio Git (si no está iniciado) y sube el código a GitHub:
   ```bash
   git add .
   git commit -m "VetCare Pro listo para desplegar"
   git push origin main
   ```

### Paso 2: Importar en Vercel
1. Ingresa a [Vercel Dashboard](https://vercel.com/dashboard) e inicia sesión con GitHub.
2. Haz clic en **"Add New..." $\rightarrow$ "Project"**.
3. Selecciona tu repositorio de GitHub `clase2025` (o `vetcare-pro`).

### Paso 3: Configurar Variables de Entorno en Vercel
En la sección **Environment Variables** de Vercel, agrega las siguientes variables:

| Variable | Valor | Descripción |
|---|---|---|
| `dbConnection` | `mongodb+srv://vetuser:password@cluster...` | Cadena de conexión de MongoDB Atlas |
| `jwtKey` | `clave_secreta_super_segura_tuds_2025` | Clave secreta para firmar tokens JWT |
| `cors` | `true` | Habilitar CORS en producción |

### Paso 4: Poblar la Base de Datos de Producción (Opcional)
Para cargar los usuarios y servicios iniciales en tu base de datos de MongoDB Atlas, ejecuta localmente el script apuntando a tu URI de Atlas:
```bash
dbConnection="mongodb+srv://vetuser:password@cluster..." node backend/seed.js
```

---

## 📱 ¿Y la App Móvil React Native?

La aplicación móvil en `mobile/` se despliega y distribuye mediante **Expo Application Services (EAS)**:
1. En `mobile/src/api/client.ts`, cambia `API_BASE_URL` por la URL de producción que te asignó Vercel (ej. `https://tu-proyecto.vercel.app/api`).
2. Para generar el APK de Android o build de iOS:
   ```bash
   cd mobile
   npx eas build -p android --profile preview
   ```
