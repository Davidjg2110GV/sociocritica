# KONSENSO -- Frontend del Proyecto Nexus PMV

## Descripcion General

KONSENSO es la interfaz de usuario del Proyecto Nexus PMV, una aplicacion orientada a la validacion y monitoreo de recursos en territorio bajo un enfoque **offline-first**. El sistema permite a usuarios en campo registrar el estado de disponibilidad de recursos basicos (agua, gas, alimentos CLAP) por zona geografica, manteniendo una cola local de sincronizacion cuando no existe conexion a internet.

El frontend esta construido con **React 18**, **TypeScript** y **Vite**, empaquetado para despliegue en **Vercel**. El diseno es completamente responsivo y soporta temas claro y oscuro con transiciones fluidas.

---

## Tabla de Contenidos

- [Pila Tecnologica](#pila-tecnologica)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Arquitectura de la Aplicacion](#arquitectura-de-la-aplicacion)
- [Flujo de Datos y Gestion de Estado](#flujo-de-datos-y-gestion-de-estado)
- [Sistema de Diseno](#sistema-de-diseno)
- [Componentes](#componentes)
- [Vistas](#vistas)
- [Modelo de Datos](#modelo-de-datos)
- [Despliegue](#despliegue)
- [Desarrollo Local](#desarrollo-local)
- [Historial de Cambios Arquitectonicos](#historial-de-cambios-arquitectonicos)

---

## Pila Tecnologica

| Capa | Tecnologia | Version |
|---|---|---|
| Biblioteca de UI | React | 18.3.x |
| Lenguaje | TypeScript | 5.2.x |
| Empaquetador | Vite | 5.3.x |
| Plugin de compilacion | @vitejs/plugin-react | 4.3.x |
| Estilos | CSS nativo (Custom Properties) | -- |
| Tipografia | Google Fonts (Outfit) | -- |
| Hosting | Vercel | -- |

No se utilizan dependencias externas de estilos (Tailwind, Sass, styled-components) ni librerias de estado (Redux, Zustand). La aplicacion mantiene una huella de dependencias minima de forma intencional.

---

## Estructura del Proyecto

```
sociocritica/
├── index.html                 # Punto de entrada HTML para Vite
├── package.json               # Dependencias, scripts de construccion y metadatos
├── tsconfig.json              # Configuracion del compilador TypeScript
├── vite.config.ts             # Configuracion de Vite con plugin de React
├── .gitignore                 # Exclusiones de control de versiones
├── README.md                  # Este documento
└── src/
    ├── main.tsx               # Bootstrap de React: monta <App /> en el DOM
    ├── App.tsx                # Componente raiz y orquestador del estado global
    ├── vite-env.d.ts          # Declaraciones de tipos para el cliente de Vite
    ├── components/            # Componentes de presentacion reutilizables
    │   ├── Header.tsx         # Barra superior con indicadores de estado
    │   ├── Sidebar.tsx        # Panel de navegacion lateral (escritorio)
    │   └── BottomNav.tsx      # Barra de navegacion inferior (movil)
    ├── constants/
    │   └── data.ts            # Interfaces TypeScript, datos estaticos y utilidades
    ├── styles/
    │   └── konsenso.css       # Hoja de estilos global, variables CSS y animaciones
    └── views/                 # Pantallas principales de la aplicacion
        ├── Dashboard.tsx      # Monitor de recursos y mapa visual de zonas
        ├── Validacion.tsx     # Flujo de validacion por pasos
        └── Voceria.tsx        # Gestion de ciclos de voceria
```

---

## Arquitectura de la Aplicacion

### Cadena de Arranque

El proceso de inicializacion sigue una cadena lineal:

```
index.html
  └─> src/main.tsx            (ReactDOM.createRoot)
        └─> src/App.tsx        (Componente raiz, estado global)
              ├─> Header       (Siempre visible)
              ├─> Sidebar      (Visible >= 768px)
              ├─> Vista activa (Dashboard | Validacion | Voceria)
              └─> BottomNav    (Visible < 768px)
```

`index.html` referencia `src/main.tsx` como modulo ES. Vite procesa este archivo como punto de entrada para la resolucion de dependencias y la compilacion. El archivo `main.tsx` monta el componente `<App />` directamente en el nodo `#root` del DOM, sin envoltorio de `StrictMode` en produccion para evitar doble renderizado.

### Patron de Composicion

La aplicacion sigue un patron de **Smart Container / Dumb Components**:

- **App.tsx** actua como contenedor inteligente: mantiene todo el estado global y distribuye datos y callbacks a sus componentes hijos via props.
- **Componentes de presentacion** (`Header`, `Sidebar`, `BottomNav`) reciben datos de solo lectura y funciones de navegacion. No poseen estado propio relevante al dominio.
- **Vistas** (`Dashboard`, `Validacion`, `Voceria`) pueden contener estado local de UI (por ejemplo, el detalle expandido en Dashboard) pero delegan las mutaciones de estado de dominio al componente raiz.

### Enfoque Offline-First

La interfaz esta disenada para operar sin conexion a internet de forma predeterminada:

- El indicador `OFFLINE` en la cabecera permanece visible en todo momento, senalizando que el sistema no depende de conectividad en tiempo real.
- Las validaciones de campo se registran localmente y se anaden a una cola de sincronizacion (`pendSync`). Cada registro nuevo incrementa el contador y se marca con un estado de sincronizacion pendiente (`sync: false`).
- El badge de sincronizacion en la cabecera muestra la cantidad de registros en espera de ser enviados al servidor cuando se restablezca la conexion.
- La logica de sincronizacion efectiva con el backend queda fuera del alcance de este modulo frontend y sera implementada en fases posteriores del proyecto.

---

## Flujo de Datos y Gestion de Estado

### Estado Global (App.tsx)

El componente raiz administra los siguientes estados mediante `useState`:

| Estado | Tipo | Proposito |
|---|---|---|
| `screen` | `string` | Pantalla activa (`"dashboard"`, `"validacion"`, `"voceria"`) |
| `step` | `number` | Paso actual en el asistente de validacion (1-4) |
| `zona` | `Territorio \| null` | Zona geografica seleccionada en el flujo de validacion |
| `recurso` | `Recurso \| null` | Recurso seleccionado para validar |
| `resultado` | `string \| null` | Resultado de la ultima validacion registrada |
| `pendSync` | `number` | Cantidad de registros pendientes de sincronizacion |
| `theme` | `"dark" \| "light"` | Tema visual activo |
| `historial` | `ValidacionRegistro[]` | Registros historicos de validaciones realizadas |

### Propagacion del Tema

El tema se gestiona en dos niveles para garantizar cobertura completa:

1. **Clase CSS en el contenedor**: El componente `App` aplica la clase `light-theme` al elemento `div.app-wrapper` cuando el tema activo es claro.
2. **Clase CSS en el body**: Un efecto secundario (`useEffect`) sincroniza la clase `light-theme` con el elemento `<body>` del documento. Esto asegura que el color de fondo de la ventana del navegador coincida con el tema sin dejar margenes o bordes con el color incorrecto.

### Flujo de Validacion

El flujo de validacion sigue una maquina de estados secuencial de 4 pasos:

```
Paso 1: Seleccion de Zona
    └─> Paso 2: Seleccion de Recurso
          └─> Paso 3: Confirmacion de Arribo
                └─> Paso 4: Resumen y Registro
                      └─> [Volver a Paso 1]
```

Al confirmar en el Paso 3, se ejecuta la funcion `confirmar()` que:
1. Construye un objeto `ValidacionRegistro` con marca de tiempo unica como identificador.
2. Inserta el registro al inicio del historial (orden cronologico descendente).
3. Incrementa el contador de sincronizacion pendiente.
4. Avanza al Paso 4 mostrando el resumen con el resultado registrado.

---

## Sistema de Diseno

### Variables CSS y Temas

La hoja de estilos (`konsenso.css`) implementa un sistema de temas dual basado en CSS Custom Properties. El tema oscuro se define en `:root` como predeterminado y el tema claro se activa mediante la clase `.light-theme`:

**Categorias de variables:**

| Categoria | Ejemplos | Descripcion |
|---|---|---|
| Fondos | `--bg-primary`, `--bg-card`, `--bg-card-hover` | Colores de superficie y estados interactivos |
| Texto | `--text-primary`, `--text-secondary`, `--text-tertiary` | Jerarquia tipografica de tres niveles |
| Bordes | `--border-color`, `--border-card` | Separadores y contornos de contenedores |
| Acento | `--accent-color`, `--accent-hover` | Color primario de la marca y su estado hover |
| Sombras | `--shadow` | Sombras de elevacion para tarjetas |
| Cabecera | `--header-bg` | Fondo semitransparente con soporte para backdrop-filter |
| Navegacion | `--nav-bg`, `--nav-btn-color` | Colores de barras de navegacion |
| Estados semanticos | `--status-ok-*`, `--status-limit-*`, `--status-none-*`, `--status-report-*` | Cada estado define tres sub-variables: `dot` (color del indicador), `bg` (fondo atenuado) y `border` (borde sutil) |
| Voceria | `--vocero-bg`, `--vocero-border`, `--vocero-text` | Colores especificos del modulo de voceria |

### Paleta Cromatica de Estados

| Estado | Significado | Color (Oscuro) | Color (Claro) |
|---|---|---|---|
| OK (Verde) | Recurso disponible | `#22c55e` | `#16a34a` |
| Limitado (Amarillo) | Disponibilidad parcial o restringida | `#eab308` | `#ca8a04` |
| Sin disponibilidad (Rojo) | Recurso no disponible | `#ef4444` | `#dc2626` |
| Reporte (Morado) | Reporte especial o incidencia | `#a855f7` | `#7c3aed` |

Los colores se ajustan entre temas para cumplir con estandares de contraste y legibilidad sobre sus respectivos fondos.

### Tipografia

La aplicacion utiliza la fuente **Outfit** de Google Fonts con pesos tipograficos de 300 a 800, complementada por la pila de sistema como fallback: `'Outfit', system-ui, -apple-system, sans-serif`.

### Animaciones y Transiciones

| Efecto | Implementacion | Duracion |
|---|---|---|
| Transicion de tema | Propiedad `transition` en `body` para `background-color` y `color` | 300ms ease |
| Entrada de pantalla | Keyframe `fadeInUp` (opacidad 0 a 1, desplazamiento Y de 10px a 0) | 400ms cubic-bezier |
| Hover en tarjetas | `translateY(-2px)` con cambio de `border-color` | 300ms cubic-bezier |
| Hover en botones de navegacion | `translateX(4px)` con cambio de color | 200ms ease |
| Hover en zonas del mapa | `scale(1.03)` | 200ms ease |
| Hover en botones de confirmacion | `translateY(-3px)` con `brightness(1.15)` y sombra ampliada | 200ms cubic-bezier |

---

## Componentes

### Header (`src/components/Header.tsx`)

Barra superior fija con posicion `sticky`. Implementa `backdrop-filter: blur(12px)` para un efecto de glassmorphism sobre el contenido desplazado.

**Props:**

| Prop | Tipo | Descripcion |
|---|---|---|
| `pendSync` | `number` | Numero de registros pendientes de sincronizacion |
| `theme` | `string` | Tema activo (`"dark"` o `"light"`) |
| `toggleTheme` | `() => void` | Callback para alternar el tema |

**Elementos visuales:**
- Logotipo y subtitulo del proyecto
- Badge de sincronizacion pendiente (visible solo cuando `pendSync > 0`)
- Indicador de estado offline con punto luminoso
- Boton circular de alternancia de tema

### Sidebar (`src/components/Sidebar.tsx`)

Panel de navegacion lateral con ancho fijo de 250px. Solo se muestra en pantallas con ancho minimo de 768px, controlado mediante media query CSS (`display: none` por defecto, `display: flex` en escritorio).

**Props:**

| Prop | Tipo | Descripcion |
|---|---|---|
| `screen` | `string` | Identificador de la pantalla activa |
| `goNav` | `(s: string) => void` | Funcion de navegacion |
| `navItems` | `NavItem[]` | Lista de elementos de navegacion |

El boton activo se distingue visualmente con un borde lateral izquierdo de color de acento y tipografia en negritas.

### BottomNav (`src/components/BottomNav.tsx`)

Barra de navegacion fija en la parte inferior de la pantalla, disenada para uso con una sola mano en dispositivos moviles. Se oculta en pantallas de escritorio (>= 768px). Incluye un indicador circular bajo el elemento activo.

**Props:** Identicas a las del componente `Sidebar`.

---

## Vistas

### Dashboard (`src/views/Dashboard.tsx`)

Pantalla principal que presenta el estado de los recursos y un mapa visual de zonas.

**Disposicion responsiva:**
- **Movil (< 768px):** Columna unica con los recursos apilados sobre el mapa.
- **Escritorio (>= 768px):** Cuadricula de dos columnas con proporcion `1.2fr 0.8fr`. La columna izquierda muestra las tarjetas de recursos y la derecha el mapa ciego de zonas.

**Funcionalidades:**
- Tarjetas de recursos expandibles al hacer clic. Al expandir una tarjeta, se muestra una sub-cuadricula con el estado desglosado por zona.
- Mapa ciego con indicadores de semaforo por zona y leyenda de estados.
- Los colores de estado se resuelven dinamicamente mediante variables CSS con interpolacion: `var(--status-${statusKey}-dot)`.

### Validacion (`src/views/Validacion.tsx`)

Asistente de validacion de 4 pasos con barra de progreso visual.

**Paso 1 -- Seleccion de Zona:** Lista de territorios disponibles con navegacion por boton. Debajo se muestra el historial reciente de validaciones con indicadores de color y estado de sincronizacion.

**Paso 2 -- Seleccion de Recurso:** Lista de recursos filtrada con indicadores de semaforo. Cada recurso muestra su estado actual con color y etiqueta.

**Paso 3 -- Confirmacion de Arribo:** Cuadricula de 4 opciones de resultado (`Confirmado OK`, `Falta`, `Parcial`, `Reporte`), cada una con un color de estado asociado y efecto de hover.

**Paso 4 -- Resumen:** Pantalla de confirmacion con indicador visual del resultado, mensaje de cola offline y boton para iniciar una nueva validacion.

**Props:**

| Prop | Tipo | Descripcion |
|---|---|---|
| `step` | `number` | Paso actual del asistente |
| `setStep` | `(step: number) => void` | Setter del paso |
| `zona` | `Territorio \| null` | Zona seleccionada |
| `setZona` | `(zona: Territorio \| null) => void` | Setter de zona |
| `recurso` | `Recurso \| null` | Recurso seleccionado |
| `setRecurso` | `(recurso: Recurso \| null) => void` | Setter de recurso |
| `confirmar` | `(tipo: string) => void` | Registra la validacion con el resultado indicado |
| `resultado` | `string \| null` | Ultimo resultado registrado |
| `reset` | `() => void` | Reinicia el asistente al paso 1 |
| `historial` | `ValidacionRegistro[]` | Historial de validaciones |

### Voceria (`src/views/Voceria.tsx`)

Vista de gestion de ciclos de voceria con mecanismo de anti-concentracion.

**Secciones:**
- **Ciclo Activo:** Tarjeta con el alias del vocero actual, fechas de vigencia e indicador de estado. Incluye aviso de temporalidad.
- **Anti-concentracion:** Tarjeta informativa que indica la politica de rotacion obligatoria.
- **Historial de Ciclos:** Lista cronologica de ciclos anteriores con alias, fechas, estado finalizado y conteo de validaciones realizadas.

---

## Modelo de Datos

### Interfaces TypeScript (`src/constants/data.ts`)

```typescript
interface Territorio {
  id: string;        // Identificador unico (ej: "T001")
  nombre: string;    // Nombre descriptivo (ej: "Zona A - Calle Bolivar")
}

interface Recurso {
  id: string;                            // Identificador unico
  tipo: string;                          // Tipo de recurso (ej: "Agua", "Gas")
  icono: string;                         // Representacion visual Unicode
  estado: "VERDE" | "AMARILLO" | "ROJO"; // Estado de semaforo actual
  fecha: string;                         // Ultima fecha de actualizacion
}

interface ZonaMapa {
  id: string;                            // Referencia al territorio
  label: string;                         // Etiqueta corta para el mapa (ej: "A")
  estado: "VERDE" | "AMARILLO" | "ROJO"; // Estado de semaforo
}

interface Ciclo {
  id: string;        // Identificador del ciclo
  alias: string;     // Nombre del vocero
  inicio: string;    // Fecha de inicio
  fin: string;       // Fecha de finalizacion
}

interface HistorialCiclo extends Omit<Ciclo, never> {
  validaciones: number; // Total de validaciones en el ciclo
}

interface ValidacionRegistro {
  id: string;        // Identificador unico basado en marca de tiempo
  zona: string;      // Nombre de la zona validada
  recurso: string;   // Tipo de recurso validado
  estado: "Confirmado OK" | "Parcial" | "Falta" | "Reporte";
  sync: boolean;     // Indica si el registro fue sincronizado con el servidor
}
```

### Funcion Auxiliar

`getEstadoColor(estado: string): string` -- Mapea un estado de validacion a su variable CSS de color correspondiente. Se utiliza para renderizar indicadores de color en el historial y la pantalla de resumen.

---

## Despliegue

### Vercel

El proyecto esta configurado para despliegue automatico en Vercel. La plataforma detecta el framework Vite automaticamente y ejecuta el proceso de construccion.

**Comando de construccion:** `tsc && vite build`

Este comando ejecuta primero la verificacion de tipos con el compilador de TypeScript y, si no hay errores, procede a la construccion del bundle de produccion con Vite. La salida se genera en el directorio `dist/`.

**Requisitos criticos para el despliegue:**

1. El archivo `src/vite-env.d.ts` debe existir con la referencia `/// <reference types="vite/client" />`. Sin este archivo, el compilador de TypeScript no puede resolver las importaciones de archivos CSS y la construccion falla.
2. Todos los archivos fuente deben residir dentro del directorio `src/`, segun lo especificado en `tsconfig.json` (`"include": ["src"]`).
3. No deben existir importaciones de `React` sin uso directo. Con la configuracion `"jsx": "react-jsx"`, el compilador inyecta React automaticamente. La regla `"noUnusedLocals": true` en tsconfig causa errores de compilacion si se importa React explicitamente sin referenciarlo.

---

## Desarrollo Local

### Requisitos Previos

- Node.js (version 18 o superior recomendada)
- npm

### Instalacion y Ejecucion

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo con recarga en caliente
npm run dev

# Verificar tipos y construir para produccion
npm run build

# Previsualizar la construccion de produccion localmente
npm run preview
```

### Integracion en un Proyecto Existente

Para integrar este modulo en una aplicacion React existente:

1. Copie la carpeta `src/` completa al directorio correspondiente de su proyecto.
2. Asegurese de que su entorno soporte TypeScript con la configuracion `"jsx": "react-jsx"`.
3. Importe y renderice el componente `App`:

```tsx
import App from "./path/to/App";

function MainApp() {
  return <App />;
}

export default MainApp;
```

---

## Historial de Cambios Arquitectonicos

### Reestructuracion de Monolito a Arquitectura Modular

**Contexto:** El codigo original consistia en un unico archivo TSX (`konsenso_pmv.tsx`) que contenia la totalidad de la logica, los datos, los estilos inline y las vistas de la aplicacion en mas de 1300 lineas. Esta estructura impedia la escalabilidad, dificultaba las revisiones de codigo y hacia imposible la reutilizacion de componentes.

**Cambios realizados:**
- Extraccion de los estilos inline a una hoja de estilos CSS global (`konsenso.css`) con sistema de variables para temas.
- Separacion de las interfaces TypeScript, constantes y funciones auxiliares al modulo `constants/data.ts`.
- Descomposicion de los componentes de presentacion (`Header`, `Sidebar`, `BottomNav`) en archivos independientes con interfaces de props tipadas.
- Aislamiento de cada vista de negocio (`Dashboard`, `Validacion`, `Voceria`) en su propio modulo.
- El archivo raiz se convirtio en un orquestador de estado que delega la presentacion a sus componentes hijos.

### Migracion a Vite para Despliegue en Vercel

**Contexto:** El proyecto originalmente no disponia de una configuracion de empaquetado. Para habilitar el despliegue en Vercel, se integro Vite como empaquetador junto con la cadena de herramientas necesaria.

**Archivos de configuracion creados:**
- `package.json` -- Scripts de construccion y dependencias de React, TypeScript y Vite.
- `vite.config.ts` -- Configuracion del plugin de React para Vite.
- `tsconfig.json` -- Reglas del compilador TypeScript adaptadas al modo bundler de Vite.
- `index.html` -- Punto de entrada HTML con referencia al modulo `src/main.tsx`.
- `src/main.tsx` -- Bootstrap de React que monta el componente raiz.
- `src/vite-env.d.ts` -- Declaraciones de tipos del cliente de Vite.

### Correccion de Errores de Compilacion en Vercel

**Problema:** El despliegue en Vercel fallaba con error 404 debido a que la construccion de produccion no se completaba exitosamente.

**Causas identificadas:**

1. **Archivo raiz fuera de `src/`:** El componente principal (`konsenso_pmv.tsx`) residia en la raiz del proyecto y utilizaba rutas relativas `./src/...` para sus importaciones. Cuando `main.tsx` dentro de `src/` lo importaba con `../konsenso_pmv`, el compilador de TypeScript no podia resolver correctamente la cadena de dependencias.

2. **Importaciones de React sin uso directo:** Con la configuracion `"jsx": "react-jsx"` en tsconfig, React se inyecta automaticamente en la compilacion JSX. Las importaciones explicitas de `import React from "react"` quedaban sin referencia directa y, combinadas con la regla `"noUnusedLocals": true`, generaban errores fatales de compilacion en cada archivo afectado.

**Resolucion:**
- Se movio el componente principal a `src/App.tsx` con rutas relativas corregidas.
- Se eliminaron todas las importaciones explicitas de React, reemplazandolas por importaciones especificas de hooks (`useState`, `useEffect`).
- Se actualizo `tsconfig.json` para incluir unicamente el directorio `src/`.
- Se creo `src/vite-env.d.ts` con la referencia de tipos del cliente de Vite para la resolucion de modulos CSS.
- Se elimino el archivo monolito original (`konsenso_pmv.tsx`) de la raiz del proyecto.

---

## Licencia

Este proyecto forma parte del Proyecto Nexus PMV y su uso esta sujeto a los terminos definidos por la organizacion correspondiente.
