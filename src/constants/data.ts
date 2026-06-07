export interface Territorio {
  id: string;
  nombre: string;
}

export interface Recurso {
  id: string;
  tipo: string;
  icono: string;
  estado: "VERDE" | "AMARILLO" | "ROJO";
  fecha: string;
}

export interface ZonaMapa {
  id: string;
  label: string;
  estado: "VERDE" | "AMARILLO" | "ROJO";
}

export interface Ciclo {
  id: string;
  alias: string;
  inicio: string;
  fin: string;
}

export interface HistorialCiclo {
  id: string;
  alias: string;
  inicio: string;
  fin: string;
  validaciones: number;
}

export interface ValidacionRegistro {
  id: string;
  zona: string;
  recurso: string;
  estado: "Confirmado OK" | "Parcial" | "Falta" | "Reporte";
  sync: boolean;
}

export const TERRITORIOS: Territorio[] = [
  { id: "T001", nombre: "Zona A · Calle Bolívar" },
  { id: "T002", nombre: "Zona B · Av. Sucre" },
  { id: "T003", nombre: "Zona C · Calle Miranda" },
  { id: "T004", nombre: "Zona D · Sector Norte" },
  { id: "T005", nombre: "Zona E · Av. Principal" },
];

export const RECURSOS: Recurso[] = [
  { id: "R001", tipo: "Agua", icono: "💧", estado: "VERDE", fecha: "2026-06-05" },
  { id: "R002", tipo: "Gas", icono: "🔥", estado: "AMARILLO", fecha: "2026-06-04" },
  { id: "R003", tipo: "CLAP", icono: "📦", estado: "ROJO", fecha: "2026-06-03" },
];

export const ZONAS_MAPA: ZonaMapa[] = [
  { id: "T001", label: "A", estado: "VERDE" },
  { id: "T002", label: "B", estado: "AMARILLO" },
  { id: "T003", label: "C", estado: "ROJO" },
  { id: "T004", label: "D", estado: "VERDE" },
  { id: "T005", label: "E", estado: "AMARILLO" },
];

export const CICLO_ACTIVO: Ciclo = {
  id: "C001", alias: "Vocero · Alpha",
  inicio: "01/06/2026", fin: "30/06/2026",
};

export const HISTORIAL_CICLOS: HistorialCiclo[] = [
  { id: "C000", alias: "Vocero · Omega", inicio: "01/05/2026", fin: "31/05/2026", validaciones: 47 },
  { id: "B999", alias: "Vocero · Beta",  inicio: "01/04/2026", fin: "30/04/2026", validaciones: 38 },
  { id: "B998", alias: "Vocero · Gamma", inicio: "01/03/2026", fin: "31/03/2026", validaciones: 52 },
];

export const SEM = {
  VERDE:    { label: "DISPONIBLE" },
  AMARILLO: { label: "LIMITADO" },
  ROJO:     { label: "SIN DISPONIB." },
};

export const getEstadoColor = (estado: string): string => {
  switch (estado) {
    case "Confirmado OK": return "var(--status-ok-dot)";
    case "Parcial": return "var(--status-limit-dot)";
    case "Falta": return "var(--status-none-dot)";
    case "Reporte": return "var(--status-report-dot)";
    default: return "var(--text-secondary)";
  }
};
