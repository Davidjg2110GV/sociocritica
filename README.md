# KONSENSO - Frontend del Proyecto Nexus PMV

Este repositorio contiene la implementacion modular de la interfaz de usuario para KONSENSO, una aplicacion diseñada para la validacion y monitoreo de recursos en territorio bajo un enfoque offline-first. El sistema esta construido con React y TypeScript, enfocado en la responsividad y en la experiencia de usuario adaptable.

## Estructura del Proyecto

El proyecto ha sido restructurado desde un componente monolito a una arquitectura modular estandar de React para garantizar la escalabilidad y facilitar el mantenimiento.

```
sociocritica/
├── README.md              # Documentacion tecnica del frontend
├── konsenso_pmv.tsx       # Punto de entrada y orquestador del estado principal
└── src/
    ├── components/        # Componentes de presentacion compartidos
    │   ├── BottomNav.tsx  # Navegacion inferior para dispositivos moviles
    │   ├── Header.tsx     # Barra superior con indicadores de estado y control de tema
    │   └── Sidebar.tsx    # Panel de navegacion lateral para pantallas grandes
    ├── constants/
    │   └── data.ts        # Tipos de TypeScript, constantes y utilidades de mapeo
    ├── styles/
    │   └── konsenso.css   # Estilos globales, variables CSS para temas y animaciones
    └── views/             # Vistas de las pantallas principales de la aplicacion
        ├── Dashboard.tsx  # Monitor de recursos y mapa visual de zonas
        ├── Validacion.tsx # Flujo interactivo por pasos para confirmacion de arribos
        └── Voceria.tsx    # Ciclos de voceria activos e historicos
```

## Arquitectura y Caracteristicas Clave

### 1. Enfoque Offline-First
La interfaz simula operaciones sin conexion a internet. Muestra de forma destacada el estado fuera de linea (OFFLINE) y mantiene una cola visual de elementos pendientes por sincronizar en el dispositivo del usuario. Al realizar validaciones, los registros se encolan en el historial con un indicador de estado pendiente de sincronizacion.

### 2. Responsividad Adaptativa (Mobile & Desktop)
El diseño se adapta dinamicamente al tamaño de pantalla del dispositivo mediante consultas de medios (media queries) en la hoja de estilos global:
* **Dispositivos Moviles (pantallas menores a 768px):** Oculta la barra lateral y activa una barra de navegacion fija en la parte inferior para facilitar el uso con una sola mano. Las vistas de recursos se apilan verticalmente.
* **Pantallas de Escritorio y Tablets (pantallas mayores a 768px):** Activa un menu lateral izquierdo fijo y reorganiza la cuadricula. La vista de recursos de la pantalla principal se divide en una distribucion de dos columnas, ubicando el estado detallado a la izquierda y el mapa visual de zonas a la derecha para aprovechar el ancho de pantalla.

### 3. Sistema de Temas Claro y Oscuro
El cambio de tema se gestiona mediante variables de CSS personalizadas definidas en `:root` y en la clase `.light-theme`.
* El estado del tema (`dark` o `light`) se controla en el componente raiz `konsenso_pmv.tsx` y se propaga a traves de la clase `.light-theme` inyectada en el contenedor padre.
* Un hook `useEffect` aplica la clase al elemento `body` del documento para asegurar que el color de fondo general de la ventana se active de manera uniforme sin dejar bordes de color incorrecto.
* Todos los colores semanticos de los estados (Verde para Disponible, Amarillo para Limitado, Rojo para Sin Disponibilidad y Morado para Reportes) se ajustan dinamicamente en funcion del tema activo para cumplir con estandares de accesibilidad y contraste.

### 4. Animaciones y Micro-interacciones
Se han integrado estilos especificos para proporcionar retroalimentacion visual al usuario:
* **Transiciones de color:** El cambio entre modo claro y oscuro tiene una duracion de 300 milisegundos aplicada de manera global.
* **Efectos al pasar el cursor (Hover):** Las tarjetas y botones poseen desplazamientos hacia arriba y cambios de color de borde sutiles que guian el foco visual.
* **Transicion de entrada:** Las pantallas cargan con una animacion de desplazamiento ascendente y opacidad progresiva (fade-in-up) controlada por la clase `.fade-in`.

## Especificaciones Tecnicas de los Componentes

### Punto de Entrada (`konsenso_pmv.tsx`)
Administra los estados globales de la aplicacion:
* Pantalla activa (`screen`)
* Paso actual en el asistente de validacion (`step`)
* Selecciones del formulario (`zona`, `recurso` y `resultado`)
* Registros pendientes por sincronizar (`pendSync`)
* Historial de validaciones realizadas
* Tema de color activo (`theme`)

### Datos y Tipos (`src/constants/data.ts`)
Define contratos estrictos de TypeScript para las entidades del negocio:
* `Territorio`: Estructura para zonas geograficas.
* `Recurso`: Datos de recursos basicos con marcas de tiempo y estados semanticos.
* `ZonaMapa`: Estructura simplificada para el mapa ciego.
* `Ciclo` e `HistorialCiclo`: Administracion de metadatos de vocerias.
* `ValidacionRegistro`: Estructura para la cola de transacciones.

### Hoja de Estilos (`src/styles/konsenso.css`)
Contiene las declaraciones CSS tradicionales sin dependencias externas como Tailwind o preprocesadores. Utiliza la tipografia Outfit importada directamente desde Google Fonts.

## Integracion en un Proyecto React

Para integrar este modulo en una aplicacion de React existente:

1. Mueva la carpeta `src` y el archivo `konsenso_pmv.tsx` al directorio correspondiente de su proyecto (por ejemplo, dentro del directorio `src` de una instalacion de Vite o Create React App).
2. Asegurese de que su compilador soporte TypeScript y CSS modular.
3. Importe el componente `App` desde `konsenso_pmv.tsx` y rendericelo en su componente raiz:

```tsx
import App from "./path/to/konsenso_pmv";

function MainApp() {
  return (
    <App />
  );
}

export default MainApp;
```
# sociocritica
