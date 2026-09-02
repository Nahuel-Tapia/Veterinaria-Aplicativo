# Análisis Integral del Proyecto - TUDS DA 2025

Este documento contiene un análisis exhaustivo del contexto, arquitectura, pila tecnológica, estructura de código, flujos funcionales y oportunidades de mejora del proyecto **TUDS - DA - 2025** (Tecnicatura Universitaria en Desarrollo de Software - Desarrollo de Aplicaciones).

---

## 1. Resumen Ejecutivo y Contexto

El proyecto es una aplicación web Fullstack monolítica en estructura de monorepo desacoplado (`backend` y `frontend`), desarrollada como plantilla u objeto de estudio educativo para la gestión de usuarios, autenticación basada en tokens JWT y control de acceso basado en roles (RBAC).

* **Propósito Principal:** Proveer una plataforma con panel administrativo (Back-Office) donde usuarios autenticados con rol de administrador pueden listar, crear, editar y eliminar usuarios de la plataforma.
* **Modelo de Arquitectura:** Desacoplado Frontend-Backend mediante una API RESTful en Node.js/Express y un cliente Single Page Application (SPA) desarrollado en React.

---

## 2. Arquitectura del Backend (`/backend`)

El backend sigue un patrón de **Arquitectura en Capas (Layered Architecture)** con **Inyección de Dependencias custom**, promoviendo el desacoplamiento entre controladores, lógica de negocio y persistencia de datos.

### 2.1. Pila Tecnológica Backend
* **Entorno de Ejecución:** Node.js (configurado como ES Modules con `"type": "module"`).
* **Framework Web:** Express v5.1.0 (`express`).
* **Base de Datos & ODM:** MongoDB gestionado mediante Mongoose v8.15.1 (`mongoose`).
* **Seguridad & Autenticación:**
  * `bcrypt`: Cifrado y verificación de contraseñas.
  * `jsonwebtoken`: Generación y verificación de tokens de acceso JWT.
* **CORS:** Middleware de `cors` para habilitar peticiones origen cruzado en desarrollo.

### 2.2. Estructura de Directorios Backend
```text
backend/
├── config.js                       # Configuración base del sistema
├── configure_dpendencies.js        # Registro de dependencias en el contenedor DI
├── index.js                        # Punto de entrada principal e inicio de Express/MongoDB
├── controllers/                    # Definición de rutas y endpoints de la API
│   ├── controllers.js
│   ├── login.js
│   └── user.js
├── exceptions/                     # Excepciones de dominio personalizadas
│   ├── forbidden_exception.js
│   ├── invalid_argument_exception.js
│   └── invalid_credentials_exception.js
├── libs/                           # Librerías auxiliares y contenedor de Inyección de Dependencias
│   └── dependencies.js
├── middlewares/                    # Middlewares de Express
│   ├── authorization_middleware.js
│   ├── configure_middlewares.js
│   ├── cors_middleware.js
│   ├── error_handler_middleware.js
│   └── log_middleware.js
├── models/                         # Modelos y esquemas de Mongoose
│   └── user.js
├── services/                       # Capa de servicios y lógica de negocio
│   ├── login.js
│   └── user.js
└── test/                           # Archivos de pruebas de peticiones HTTP
    ├── login.http
    └── user.http
```

### 2.3. Patrones de Diseño Destacados
1. **Contenedor de Inyección de Dependencias (`libs/dependencies.js`):**
   Implementa un registro global dinámico (`addDependency`, `getDependency`) que permite a los servicios instanciar modelos o servicios hermanos sin acoplamiento directo entre ficheros.
2. **Excepciones de Dominio Personalizadas (`exceptions/`):**
   Utiliza clases que heredan de `Error` especificando códigos de estado HTTP (`statusCode`), lo cual simplifica el tratamiento global en el middleware de errores.
3. **Control de Acceso por Roles (RBAC):**
   Mediante la función middleware `checkForRole(role)` se valida que el token JWT contenga el rol requerido (`admin`) antes de permitir la ejecución de los endpoints sensibles `/api/user`.

---

## 3. Arquitectura del Frontend (`/frontend`)

El frontend está desarrollado como una SPA reactiva moderna basada en componentes funcionales de React.

### 3.1. Pila Tecnológica Frontend
* **Biblioteca UI:** React v19.1.0 & React DOM.
* **Tooling / Bundler:** Vite v7.0.4.
* **Enrutamiento:** React Router DOM v7.8.2 (`BrowserRouter`, `Routes`, `Route`).
* **Estilos:** Hojas de estilo CSS nativas modulares por componente (`App.css`, `Menu.css`, `Snackbar.css`, `index.css`).

### 3.2. Estructura de Directorios Frontend
```text
frontend/
├── public/                         # Recursos estáticos
├── src/
│   ├── App.jsx                     # Componente raíz con inicialización de contexto y token
│   ├── main.jsx                    # Punto de entrada de React DOM
│   ├── components/                 # Componentes de interfaz de usuario
│   │   ├── About.jsx
│   │   ├── Body.jsx
│   │   ├── Button.jsx
│   │   ├── Content.jsx
│   │   ├── Form.jsx
│   │   ├── Head.jsx
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Menu.jsx
│   │   ├── MenuIcon.jsx
│   │   ├── Modal.jsx
│   │   ├── MultiSelectField.jsx
│   │   ├── NotFound.jsx
│   │   ├── Router.jsx
│   │   ├── Session.jsx
│   │   ├── Snackbar.jsx
│   │   ├── TextField.jsx
│   │   ├── Usuario.jsx
│   │   └── Usuarios.jsx
│   ├── libs/                       # Abstracción de cliente HTTP
│   │   └── api.js
│   └── services/                   # Servicios para consumo de endpoints
│       ├── loginService.js
│       └── userService.js
```

### 3.3. Manejo de Estado Global y UI Contexts
El frontend implementa varios contextos de React para desacoplar responsabilidades:
* **`SessionProvider` (`Session.jsx`):** Mantiene el estado de autenticación (`isLoggedIn`) y los datos del usuario activo (`user`).
* **`SnackbarProvider` (`Snackbar.jsx`):** Proporciona un sistema global para encolar notificaciones toast (éxito, error, advertencias).
* **`ModalProvider` (`Modal.jsx`):** Ofrece diálogos modales interactivos reutilizables para confirmación de acciones (como la eliminación de usuarios).

### 3.4. Cliente HTTP Custom (`libs/api.js`)
Provee funciones envoltorio sobre `fetch` (`getJson`, `postJson`, `patch`, `deleteItem`) encargadas de:
* Insertar la URL base configurable (`VITE_API_URL` o `/api`).
* Adjuntar dinámicamente los encabezados HTTP (incluyendo `Authorization: Bearer <token>`).
* Serializar payloads JSON y parsear respuestas automáticamente.

---

## 4. Endpoints y Contrato de API

| Método | Endpoint | Middleware / Protección | Descripción |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/login` | Público | Autentica credenciales (`username`, `password`) y retorna token JWT y datos de usuario. |
| **GET** | `/api/user` | `checkForRole('admin')` | Obtiene la lista de usuarios (o un usuario por filtro de búsqueda). |
| **POST** | `/api/user` | `checkForRole('admin')` | Crea un nuevo usuario en la base de datos (con contraseña hasheada). |
| **PATCH** | `/api/user/:uuid` | `checkForRole('admin')` | Actualiza parcialmente los campos de un usuario identificado por `uuid`. |
| **DELETE** | `/api/user/:uuid` | `checkForRole('admin')` | Elimina permanentemente un usuario por su `uuid`. |

---

## 5. Hallazgos, Inconsistencias y Oportunidades de Mejora

Durante el análisis del código fuente se han identificado los siguientes detalles técnicos y áreas de oportunidad:

### 5.1. Errores Sintácticos y Defectos de Código
1. **Error en `Usuarios.jsx` (Línea 26):**
   Existe un carácter numérico `4` suelto al final de la línea:
   ```javascript
   snackbar.enqueue('Usuario eliminado', { variant: 'success' });4
   ```
   *Impacto:* Error de sintaxis en tiempo de compilación/ejecución.

2. **Ruta Faltante en el Router (`Router.jsx` / `Menu.jsx`):**
   El componente `Menu.jsx` incluye un enlace a la ruta `/contact`, pero dicha ruta no está definida en `Router.jsx`, lo que provoca que renderice la página de `NotFound.jsx`.

3. **Errata en Nombre de Archivo (`backend/configure_dpendencies.js`):**
   Falta la letra `e` en la palabra *dependencies* (`configure_dpendencies.js`).

4. **Errata en Nombre de Variable Middleware (`cors_middleware.js`):**
   Exporta la variable como `corsModdleware` en lugar de `corsMiddleware`.

### 5.2. Oportunidades de Mejora Arquitectónica y de Seguridad
1. **Comentario vs. Configuración de Expiración en JWT (`login.js`):**
   El parámetro especifica `expiresIn: '24h'`, mientras que el comentario en el código indica `// El token expirará en 1 hora`.
2. **Uso de Generador de UUID:**
   En `user.js` (servicio) se utiliza `crypto.randomUUID()`. Se requiere asegurar que la versión del runtime de Node.js sea $\ge 14.17.0$ o Node 16+ para su soporte nativo.
3. **Persistencia de Sesión al Recargar:**
   En `App.jsx` se lee la sesión de `localStorage` al montar el componente, pero si la sesión expira en el servidor o el token es inválido, no se valida la vigencia del token JWT en el cliente.
4. **Validación de Entradas en Backend:**
   Las validaciones actuales se realizan con bloques `if` manuales. Se recomienda incorporar librerías de validación de esquemas como **Zod** o **Joi** para un control más robusto de los payloads recibidos.

---

## 6. Guía de Ejecución Local

### 6.1. Requisitos Previos
* Node.js v18 o superior.
* Instancia funcional de MongoDB (local o MongoDB Atlas).

### 6.2. Configuración del Backend
1. Ir al directorio `backend`:
   ```bash
   cd backend
   ```
2. Instalar dependencias:
   ```bash
   npm install
   ```
3. Crear el archivo `config.local.js` en `backend/` con el siguiente contenido:
   ```javascript
   export default {
     port: 3000,
     dbConnection: 'mongodb://localhost:27017/tuds2025',
     jwtKey: 'clave_secreta_super_segura_tuds_2025',
     cors: true,
   };
   ```
4. Iniciar el servidor en modo desarrollo:
   ```bash
   npm run dev
   ```

### 6.3. Configuración del Frontend
1. Ir al directorio `frontend`:
   ```bash
   cd frontend
   ```
2. Instalar dependencias:
   ```bash
   npm install
   ```
3. Iniciar el servidor de desarrollo Vite:
   ```bash
   npm run dev
   ```
4. Acceder en el navegador a `http://localhost:5173`.

---

## 7. Conclusión

El proyecto representa una base solida y bien estructurada para la enseñanza y desarrollo de aplicaciones web fullstack con **Node.js, Express, MongoDB y React**. La separación clara de responsabilidades, la inclusión de control de acceso por roles (RBAC) y la implementación de contextos globales en React facilitan la escalabilidad del sistema. Aplicando las correcciones señaladas en la sección 5, el proyecto quedará totalmente estabilizado y preparado para futuras expansiones.
