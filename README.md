# WorkHoy

**Proyecto:** Plataforma para encontrar trabajos temporales de forma rápida y segura.
**Institución:** CIBERTEC - Desarrollo de Entornos Web
**Tipo:** SPA (Single Page Application) con React

---

## Estructura de carpetas

```
WorkHoy/
├── index.html                  → HTML principal (en la raíz para Vite)
├── public/                     → Archivos estáticos
├── src/
│   ├── main.jsx                → Punto de entrada de React
│   ├── App.jsx                 → Componente raíz + rutas
│   ├── recursos/               → logo e íconos (SVG)
│   ├── componentes/            → Componentes reutilizables (Boton, TarjetaVacante, ...)
│   ├── paginas/
│   │   ├── empresa/            → Dashboard, Publicar, Mis Vacantes, Detalle, Calificar
│   │   └── trabajador/         → Buscar, Detalle, Mis Postulaciones
│   ├── contexto/               → UsuarioContext y VacantesContext (Context API + useReducer)
│   ├── datos/                  → datosIniciales.js (mock) y storage.js (localStorage)
│   └── estilos/                → TODO el CSS en una sola carpeta
├── package.json                → Dependencias y scripts
└── vite.config.js              → Configuración de Vite
```

Los nombres de carpetas están en español para que todo el equipo (incluido
alguien de segundo ciclo) entienda la organización sin depender de inglés.

## Tecnologías

- React + JSX con componentes funcionales y hooks
- react-router-dom para las rutas
- Context API + useReducer para el estado global
- localStorage para persistir los datos (sin backend)
- CSS plano con variables en `src/estilos/variables.css`
- Vite como servidor de desarrollo

## Cómo ejecutar

```bash
npm install   # Instala las dependencias (se genera node_modules)
npm run dev   # Inicia el servidor en http://localhost:5173
```

## Usuarios de prueba (demo)

| Rol | Correo | Contraseña |
|-----|--------|------------|
| Empresa | empresa1@workhoy.com | 123456 |
| Empresa | empresa2@workhoy.com | 123456 |
| Trabajador | juan@workhoy.com | 123456 |
| Trabajador | maria@workhoy.com | 123456 |

## Rutas principales

| Ruta | Pantalla | Rol |
|------|----------|-----|
| `/` | Landing (selección de rol) | Público |
| `/login` | Iniciar sesión | Público |
| `/registro` | Crear cuenta | Público |
| `/empresa/dashboard` | Métricas de la empresa | Empresa |
| `/empresa/publicar` | Publicar vacante | Empresa |
| `/empresa/vacantes` | Mis vacantes | Empresa |
| `/empresa/vacantes/:id` | Detalle + postulantes | Empresa |
| `/empresa/calificar/:postulacionId` | Calificar trabajador | Empresa |
| `/trabajador/buscar` | Buscar vacantes con filtros | Trabajador |
| `/trabajador/vacantes/:id` | Detalle + postular | Trabajador |
| `/trabajador/postulaciones` | Mis postulaciones | Trabajador |
| `/perfil` | Editar perfil | Ambos |

## Nota

El proyecto no tiene backend: todos los datos viven en `localStorage` y
se siembran desde `src/datos/datosIniciales.js` la primera vez que se abre
la aplicación. Cualquier cambio de estado (publicar, postular, aceptar,
rechazar, calificar) se refleja al instante y sobrevive al refresco.
