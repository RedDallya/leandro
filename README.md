# Sistema de Gestión de Clientes y Viajes - Agencia de Turismo

Este repositorio contiene una plataforma web completa para administrar clientes, viajes y la documentación asociada dentro de una agencia de turismo. Incluye un **backend en Node.js/Express** con base de datos MySQL y un **frontend web** responsivo en HTML, CSS y JavaScript puro.

## 🚀 Características principales

- Autenticación con JWT y control de roles (`admin_superior`, `admin`, `operador`, `lector`).
- Gestión integral de clientes, viajes y documentos categorizados en cotizaciones, liquidaciones, vouchers, pasajes e itinerarios.
- Almacenamiento de archivos en la nube mediante Amazon S3 (o servicio compatible).
- Generación de PDFs para cada sección del viaje.
- Registro y trazabilidad de envíos por email o WhatsApp Business API.
- Docker Compose para orquestar los servicios de base de datos y API.
- Interfaz web moderna y adaptable para visualizar y operar sobre la información.

## 🗂️ Estructura del proyecto

```
├── backend
│   ├── Dockerfile
│   ├── package.json
│   ├── .env.example
│   └── src
│       ├── app.js
│       ├── config/
│       ├── middleware/
│       ├── models/
│       ├── routes/
│       ├── services/
│       └── utils/
├── frontend
│   ├── index.html
│   ├── css/
│   └── js/
└── docker-compose.yml
```

## 🧰 Requisitos previos

- Docker y Docker Compose instalados.
- Cuenta y credenciales válidas del proveedor de almacenamiento (S3 compatible).
- Credenciales de WhatsApp Business API o SMTP si se requiere envío real de mensajes.

## ⚙️ Puesta en marcha

1. Copia el archivo de variables de entorno del backend:

   ```bash
   cp backend/.env.example backend/.env
   ```

   Ajusta las credenciales de base de datos, almacenamiento y servicios externos.

2. Levanta los servicios con Docker Compose:

   ```bash
   docker-compose up --build
   ```

   - La API quedará disponible en `http://localhost:4000`.
   - MySQL se expone en el puerto `3306` (usuario `agencia_user`, contraseña `agencia_pass`).

3. Abre el archivo `frontend/index.html` en tu navegador o sirve la carpeta `frontend` con el servidor de tu preferencia.

4. Crea un usuario manualmente en la base de datos (por ejemplo con un script SQL) y autentícate desde el frontend para comenzar a operar.

## 🔌 Endpoints principales

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/auth/login` | Autenticación y emisión de token JWT |
| GET | `/clientes` | Listado de clientes con documentos personales |
| POST | `/clientes` | Alta de cliente |
| GET | `/clientes/:id` | Detalle de cliente |
| POST | `/clientes/:id/documentos` | Subida de documentos personales |
| GET | `/viajes` | Listado de viajes |
| POST | `/viajes` | Alta de viaje |
| GET | `/viajes/:id` | Detalle de viaje |
| POST | `/documentos/upload` | Subida de documentos de viaje |
| GET | `/documentos/:id` | Obtiene el enlace firmado del documento |
| POST | `/pdf/:section/:id` | Genera PDF de una sección |
| POST | `/envios` | Registra y ejecuta envíos por email o WhatsApp |

## 🛡️ Seguridad y roles

- Los endpoints están protegidos por el middleware de autorización que valida el token JWT y las políticas de acceso según el rol.
- Se registra el usuario que realiza cada carga de documentos o envío de información.

## 📝 Notas adicionales

- El proyecto usa Sequelize como ORM y sincroniza los modelos automáticamente al iniciar la API (`sequelize.sync()`). Para entornos productivos se recomienda implementar migraciones controladas.
- Los servicios de envío (WhatsApp y email) están preparados para integrarse con Meta Cloud API y SMTP respectivamente. Ajusta los parámetros en el `.env` para habilitar el envío real.
- La generación de PDFs utiliza `pdfkit`; es posible personalizar las plantillas desde `backend/src/utils/pdfGenerator.js`.

## 📄 Licencia

Este proyecto se distribuye bajo la licencia MIT. NO es de uso coemrcial ni se admiten copias o plagios ni adaptarlo y extenderlo.
