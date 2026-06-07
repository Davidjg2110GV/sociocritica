import { useState, useEffect } from "react";
import "./styles/konsenso.css";

// Components
import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import { BottomNav } from "./components/BottomNav";

// Views
import { Dashboard } from "./views/Dashboard";
import { Validacion } from "./views/Validacion";
import { Voceria } from "./views/Voceria";

// Constants & Types
import type { ValidacionRegistro, Territorio, Recurso } from "./constants/data";

export default function App() {
  const [screen, setScreen]           = useState<string>("dashboard");
  const [step, setStep]               = useState<number>(1);
  const [zona, setZona]               = useState<Territorio | null>(null);
  const [recurso, setRecurso]         = useState<Recurso | null>(null);
  const [resultado, setResultado]     = useState<string | null>(null);
  const [pendSync, setPendSync]       = useState<number>(2);
  const [theme, setTheme]             = useState<"dark" | "light">("dark");
  const [historial, setHistorial]     = useState<ValidacionRegistro[]>([
    { id: "V001", zona: "Zona A · Calle Bolívar", recurso: "Agua",  estado: "Confirmado OK", sync: true },
    { id: "V002", zona: "Zona B · Av. Sucre",     recurso: "Gas",   estado: "Parcial",       sync: false },
    { id: "V003", zona: "Zona C · Calle Miranda", recurso: "CLAP",  estado: "Falta",         sync: true },
  ]);

  // Synchronize layout body theme class
  useEffect(() => {
    if (theme === "light") {
      document.body.classList.add("light-theme");
    } else {
      document.body.classList.remove("light-theme");
    }
  }, [theme]);

  const goNav = (s: string) => { 
    setScreen(s); 
    resetVal(); 
  };

  const resetVal = () => { 
    setStep(1); 
    setZona(null); 
    setRecurso(null); 
    setResultado(null); 
  };

  const confirmar = (tipo: string) => {
    if (!zona || !recurso) return;
    const v: ValidacionRegistro = { 
      id: `V${Date.now()}`, 
      zona: zona.nombre, 
      recurso: recurso.tipo, 
      estado: tipo as ValidacionRegistro["estado"], 
      sync: false 
    };
    setHistorial(p => [v, ...p]);
    setPendSync(p => p + 1);
    setResultado(tipo);
    setStep(4);
  };

  const toggleTheme = () => {
    setTheme(t => t === "dark" ? "light" : "dark");
  };

  const NAV_ITEMS = [
    { id: "dashboard",  icon: "◈", label: "Recursos" },
    { id: "validacion", icon: "✓", label: "Validar"  },
    { id: "voceria",    icon: "◎", label: "Vocería"  },
  ];

  return (
    <div className={`app-wrapper ${theme === "light" ? "light-theme" : ""}`}>
      {/* HEADER */}
      <Header 
        pendSync={pendSync} 
        theme={theme} 
        toggleTheme={toggleTheme} 
      />

      {/* RESPONSIVE LAYOUT CONTAINER */}
      <div className="layout-container">
        {/* DESKTOP SIDEBAR NAVIGATION */}
        <Sidebar 
          screen={screen} 
          goNav={goNav} 
          navItems={NAV_ITEMS} 
        />

        {/* MAIN CONTENT AREA */}
        <main className="main-content">
          {screen === "dashboard"  && <Dashboard />}
          {screen === "validacion" && (
            <Validacion 
              step={step} 
              setStep={setStep} 
              zona={zona} 
              setZona={setZona} 
              recurso={recurso} 
              setRecurso={setRecurso} 
              confirmar={confirmar} 
              resultado={resultado} 
              reset={resetVal} 
              historial={historial} 
            />
          )}
          {screen === "voceria"    && <Voceria />}
        </main>
      </div>

      {/* BOTTOM NAVIGATION (MOBILE ONLY) */}
      <BottomNav 
        screen={screen} 
        goNav={goNav} 
        navItems={NAV_ITEMS} 
      />
    </div>
  );
}
