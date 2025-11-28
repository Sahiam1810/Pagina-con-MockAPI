# 📘 Proyecto de Pagina hecha con IA e implementacion de mockAPI

**Autor:** Sahiam Valentina Esteban  
**Institución:** Campuslands  

---

## Descripción del Proyecto

TrendGear es un panel de administración desarrollado como caso de estudio para una tienda en línea ficticia especializada en dispositivos tecnológicos. El sistema permite gestionar la base de datos de clientes mediante operaciones CRUD (Crear, Leer, Actualizar, Eliminar), proporcionando una interfaz intuitiva para analistas de datos que necesitan administrar información de marketing y ventas.

### Características principales:
- Dashboard con métricas y estadísticas en tiempo real
- Gestión completa de clientes (CRUD)
- Filtros dinámicos por categoría, país y búsqueda
- Exportación de datos a CSV
- Diseño responsive y moderno

---

## Tecnologías Utilizadas

| Tecnología 
|------------
| HTML5 
| CSS3 
| JavaScript 
| MockAPI | Servicio REST para persistencia de datos |

---

## Requerimientos

- Navegador web moderno (Chrome, Firefox, Edge, Safari)
- Conexión a internet (para consumir la API REST)
- No requiere instalación de dependencias ni servidor local

---

## Ejecución

1. Clonar o descargar el repositorio
2. Abrir el archivo `index.html` en cualquier navegador web
3. La aplicación se conectará automáticamente a la API REST

\`\`\`bash
# Opción 1: Abrir directamente
Doble clic en index.html

# Opción 2: Usar Live Server (VS Code)
Click derecho en index.html > "Open with Live Server"
\`\`\`

---

## Enlace de Despliegue

> **URL del proyecto desplegado:**  
> 

---

## Estructura del Proyecto

\`\`\`
MockAPI3/
│
├── index.html          
├── styles.css          l
├── script.js          
└── README.md          
\`\`\`

---

## Persistencia de Datos

Los datos se almacenan en un servicio REST externo (MockAPI) con el siguiente endpoint:

\`\`\`
https://6928423eb35b4ffc5014e22c.mockapi.io/clientes
\`\`\`

### Schema de Datos

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id_cliente` | Object ID | Identificador único (autogenerado) |
| `nombre` | String | Nombre completo del cliente |
| `edad` | Number | Edad del cliente |
| `genero` | String | Género (Masculino/Femenino/Otro) |
| `pais` | String | País de residencia |
| `tipo_dispositivo` | String | Dispositivo usado (Desktop/Mobile/Tablet) |
| `metodo_pago` | String | Método de pago preferido |
| `monto_compra` | Number | Monto total de compra |
| `fecha_compra` | Date | Fecha de la última compra |
| `categoria_producto` | String | Categoría del producto adquirido |
| `descuento_usado` | Boolean | Si utilizó descuento |


---

## Buenas Prácticas Implementadas

### Código Limpio
- Separación de responsabilidades (HTML, CSS, JS)
- Nombres de variables y funciones descriptivos
- Comentarios en secciones clave del código
- Funciones modulares y reutilizables

### Diseño y UX/UI
- Paleta de colores consistente (#1B4079, #4D7C8A, #7F9C96, #8FAD88, #CBDF90)
- Diseño responsive 
- Notificaciones toast para acciones del usuario
- Modales de confirmación para acciones destructivas

### Rendimiento
- Fetch API nativo (sin librerías externas)
- Manipulación eficiente del DOM
- Delegación de eventos donde es posible
- Estados de carga para mejor experiencia de usuario


### Seguridad
- Validación de datos en formularios
- Confirmación antes de eliminar registros
- Manejo de errores en peticiones HTTP
