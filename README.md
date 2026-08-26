## Challenge Técnico: Mantenimiento de Súper Héroes (Angular 21)

Este proyecto es una aplicación SPA desarrollada en **Angular 21** como parte de un challenge técnico. La aplicación permite gestionar (CRUD) un listado de súper héroes, cumpliendo con los siguientes requisitos:

### Requisitos

- **Servicios:**
  - Registro, consulta, búsqueda, edición y eliminación de súper héroes completamente gestionados desde servicios Angular.
  - Los datos se almacenan en localStorage y las operaciones simulan la latencia de una API, sin requerir un backend.
  - Incluye **tests unitarios** para garantizar la lógica del servicio.

- **Estructura modular de componentes:**
  - La aplicación está compuesta por varios componentes reutilizables y especializados:
    - Listado paginado de héroes con acciones de añadir, editar y borrar.
    - Filtros y formularios independientes para alta y edición, con validaciones y reutilización de lógica.
    - Diálogo de confirmación para borrado.
    - Header y otros componentes compartidos.
  - Cada componente está enfocado en una responsabilidad clara, facilitando el mantenimiento y la escalabilidad.
  - **Tests unitarios** implementados para los componentes clave.

- **Extras implementados:**
  - Uso de **Angular Material** para una interfaz moderna y accesible.
  - Rutas y navegación entre páginas (SPA completa).
  - Indicadores de carga gestionados mediante LoadingService y Signals durante las operaciones asíncronas simuladas.
  - Directiva personalizada para mostrar el nombre del héroe en mayúsculas en formularios.
  - Comunicación entre componentes basada en eventos y buenas prácticas de Angular.

---

#### ¿Cómo ejecutar la aplicación?

1. Instala las dependencias:
   ```bash
   npm install
   ```
2. Inicia la aplicación:
   ```bash
   npm start
   ```
3. Accede a [http://localhost:4200](http://localhost:4200) en tu navegador.

#### ¿Cómo ejecutar los tests?

```bash
npm test
```

### Construir la imagen Docker

Desde la raíz del proyecto, ejecuta:

```sh
docker build -t gonzalodonaireapp .
```

### Ejecutar el contenedor

```sh
docker run -p 8080:80 gonzalodonaireapp
```

Luego abre tu navegador en [http://localhost:8080](http://localhost:8080) para ver la aplicación.

### Notas

- El archivo `nginx.conf` personalizado se utiliza para soportar rutas de aplicaciones Angular (SPA).
- El build de Angular se copia desde `dist/RIU-Frontend-GonzaloDonaire/browser` a la carpeta de Nginx.
- Si cambias el nombre del proyecto o la estructura de carpetas, ajusta la ruta en el `Dockerfile` según corresponda.

---

**Autor:** Gonzalo Donaire
