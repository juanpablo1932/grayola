# Aplicación de Gestión de Proyectos

Este proyecto es una aplicación de gestión de proyectos desarrollada con Next.js y Supabase. A continuación, se detallan sus funcionalidades principales, aspectos técnicos y pasos para su ejecución en local.

---

## Descripción General

La aplicación contempla inicialmente una **página Home** con la opción de inicio de sesión por **correo electrónico**. Esta es la única opción habilitada, tanto en el frontend como en el backend.

### Flujo de Usuario

- Al hacer clic en "Email", el usuario es redirigido a la ruta `/login`, donde encuentra:
  - Formulario de inicio de sesión.
  - Opción deshabilitada de registro de usuario (por requerimiento del enunciado).
  - Hipervínculo a los **Términos de Servicio**.

Al iniciar sesión, el usuario será redirigido a una ruta específica, dependiendo de su **rol**:

- **Cliente** (`cliente`): redirigido a `/create`, donde puede:
  - Crear un proyecto con campos de **título**, **descripción** y **archivos adjuntos**.

- **Project Manager** (`project_manager`): redirigido a `/admin`, donde puede:
  - Ver una tabla con todos los proyectos creados por clientes.
  - Asignar un diseñador a cada proyecto desde el menú de acciones.
  - Editar título, descripción y asignar diseñador en la ruta de edición.
  - No puede editar los archivos adjuntos.

- **Diseñador** (`disenador`): redirigido a `/projects`, donde puede:
  - Ver los proyectos que le han sido asignados.
  - No puede editar los proyectos.

### Funcionalidades adicionales

- Todas las páginas protegidas incluyen un botón de **cerrar sesión**, que termina la sesión desde el servidor.
- El sistema redirige a:
  - Una página de **error 404** si la ruta no existe.
  - Una página de **acceso denegado** si el usuario no tiene permisos para acceder a una ruta.

---

## Aspectos Técnicos

### Backend

- **Supabase** con las siguientes tablas:
  - `profiles`: usuarios registrados.
  - `project`: proyectos creados.
  - `project_files`: archivos adjuntos.

- Relaciones entre tablas para realizar consultas complejas.
- Políticas de seguridad (RLS) para controlar el acceso según el rol del usuario (SELECT, INSERT, UPDATE, DELETE).
- **Storage Bucket** para manejar archivos adjuntos, accesibles solo por usuarios con permisos adecuados.

#### Usuarios registrados (registro deshabilitado):

##### Clientes:
- `sara_cliente@gmail.com` / `sc1234`
- `pablo_cliente@gmail.com` / `pc1234`

##### Diseñadores:
- `juan_disenador@gmail.com` / `jd1234`
- `luis_disenador@gmail.com` / `ld1234`

##### Project Manager:
- `pm@gmail.com` / `pm1234`

---

### Frontend

- **Framework**: Next.js
- **Librerías utilizadas**:
  - `react-hook-form`
  - `shadcn`
  - `TailwindCSS`
  - `TanStack Query`
- Sistema de rutas protegidas mediante **Middleware** y roles.
- Autenticación y cierre de sesión gestionados con **Supabase Auth**.

---

## Levantar el Proyecto en Local

1. Clona el repositorio:
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Crea un archivo `.env.local` en la raíz del proyecto con el siguiente contenido:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://vrrooigwrbattwrwahzk.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZycm9vaWd3cmJhdHR3cndhaHprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyMjQzMDUsImV4cCI6MjA1OTgwMDMwNX0.FJ6_1YBmiZN_bshgeyAPLvQdeumikI-4Roxv6LcazX4
   ```
4. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

---

## Deployment

El proyecto está desplegado en Vercel:

**[https://grayola-three.vercel.app/](https://grayola-three.vercel.app/)**

---

## Licencia

Este proyecto fue desarrollado con fines académicos y de prueba técnica.
