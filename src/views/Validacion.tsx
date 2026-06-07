import React from "react";
import { 
  Territorio, 
  Recurso, 
  ValidacionRegistro, 
  TERRITORIOS, 
  RECURSOS, 
  SEM, 
  getEstadoColor 
} from "../constants/data";

interface ValidacionProps {
  step: number;
  setStep: (step: number) => void;
  zona: Territorio | null;
  setZona: (zona: Territorio | null) => void;
  recurso: Recurso | null;
  setRecurso: (recurso: Recurso | null) => void;
  confirmar: (tipo: string) => void;
  resultado: string | null;
  reset: () => void;
  historial: ValidacionRegistro[];
}

export const Validacion: React.FC<ValidacionProps> = ({
  step,
  setStep,
  zona,
  setZona,
  recurso,
  setRecurso,
  confirmar,
  resultado,
  reset,
  historial
}) => {
  return (
    <div className="fade-in">
      {/* Progress bar */}
      <div className="progress-bar-container">
        {[1, 2, 3].map(i => (
          <div 
            key={i} 
            className="progress-bar-step"
            style={{ 
              backgroundColor: step > i 
                ? "var(--accent-color)" 
                : step === i 
                  ? "var(--accent-color)" 
                  : "var(--border-color)",
              opacity: step >= i ? 1 : 0.3
            }} 
          />
        ))}
      </div>

      {step === 1 && (
        <>
          <div className="section-label">PASO 1 · SELECCIONAR ZONA</div>
          <div className="button-grid" style={{ marginBottom: 24 }}>
            {TERRITORIOS.map(t => (
              <button 
                key={t.id} 
                onClick={() => { setZona(t); setStep(2); }}
                className="zone-select-btn"
              >
                <span style={{ color: "var(--accent-color)", fontSize: 16 }}>◈</span>
                <span style={{ color: "var(--text-primary)", fontSize: "0.9rem", fontWeight: 600 }}>{t.nombre}</span>
                <span style={{ marginLeft: "auto", color: "var(--text-tertiary)", fontSize: 16 }}>›</span>
              </button>
            ))}
          </div>
          {historial.length > 0 && (
            <>
              <div className="section-label" style={{ marginTop: 24 }}>HISTORIAL RECIENTE</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {historial.slice(0, 5).map(v => {
                  const color = getEstadoColor(v.estado);
                  return (
                    <div key={v.id} className="history-item">
                      <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: color, flexShrink: 0 }} />
                      <div style={{ flex: 1, fontSize: "0.75rem", color: "var(--text-secondary)" }}>
                        {v.zona} · <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>{v.recurso}</span>
                      </div>
                      <div style={{ fontSize: "0.75rem", color: color, fontWeight: 700 }}>{v.estado}</div>
                      {!v.sync && <span style={{ fontSize: "0.75rem", color: "var(--status-limit-dot)" }}>⟳</span>}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </>
      )}

      {step === 2 && (
        <>
          <div className="section-label">PASO 2 · SELECCIONAR RECURSO</div>
          <div style={{ fontSize: "0.85rem", color: "var(--accent-color)", fontWeight: 700, marginBottom: 16, display: "flex", alignItems: "center", gap: 6 }}>
            <span>📍</span> {zona?.nombre}
          </div>
          <div className="button-grid">
            {RECURSOS.map(r => {
              const statusClass = r.estado.toLowerCase();
              const statusKey = statusClass === 'verde' ? 'ok' : statusClass === 'amarillo' ? 'limit' : 'none';
              return (
                <button 
                  key={r.id} 
                  onClick={() => { setRecurso(r); setStep(3); }}
                  className="zone-select-btn"
                  style={{ borderColor: `var(--status-${statusKey}-border)` }}
                >
                  <span style={{ fontSize: 28 }}>{r.icono}</span>
                  <div style={{ flex: 1, textAlign: "left" }}>
                    <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--text-primary)" }}>{r.tipo}</div>
                    <div 
                      style={{ 
                        fontSize: "0.7rem", 
                        color: `var(--status-${statusKey}-dot)`, 
                        marginTop: 2, 
                        fontWeight: 700, 
                        letterSpacing: 0.5 
                      }}
                    >
                      {SEM[r.estado].label}
                    </div>
                  </div>
                  <div 
                    style={{ 
                      width: 10, 
                      height: 10, 
                      borderRadius: "50%", 
                      backgroundColor: `var(--status-${statusKey}-dot)`,
                      boxShadow: `0 0 6px var(--status-${statusKey}-dot)` 
                    }} 
                  />
                </button>
              );
            })}
          </div>
          <button className="back-btn" onClick={() => setStep(1)}>← Volver</button>
        </>
      )}

      {step === 3 && (
        <>
          <div className="section-label">PASO 3 · CONFIRMAR LLEGADA</div>
          <div style={{ fontSize: "0.85rem", color: "var(--accent-color)", fontWeight: 700, marginBottom: 4 }}>📍 {zona?.nombre}</div>
          <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: 20 }}>{recurso?.icono} {recurso?.tipo}</div>
          <div style={{ fontSize: "0.9rem", color: "var(--text-primary)", textAlign: "center", marginBottom: 16, fontWeight: 700, letterSpacing: 0.5 }}>¿LLEGÓ EL RECURSO?</div>
          
          <div className="confirm-grid">
            <button 
              className="choice-btn" 
              style={{
                backgroundColor: "var(--status-ok-bg)",
                borderColor: "var(--status-ok-border)",
                borderWidth: "2px",
                borderStyle: "solid",
                color: "var(--status-ok-dot)"
              }}
              onClick={() => confirmar("Confirmado OK")}
            >
              <span style={{ fontSize: 32 }}>✓</span>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.5 }}>SÍ · LLEGÓ</span>
            </button>
            <button 
              className="choice-btn" 
              style={{
                backgroundColor: "var(--status-none-bg)",
                borderColor: "var(--status-none-border)",
                borderWidth: "2px",
                borderStyle: "solid",
                color: "var(--status-none-dot)"
              }}
              onClick={() => confirmar("Falta")}
            >
              <span style={{ fontSize: 32 }}>✕</span>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.5 }}>NO · FALTA</span>
            </button>
            <button 
              className="choice-btn" 
              style={{
                backgroundColor: "var(--status-limit-bg)",
                borderColor: "var(--status-limit-border)",
                borderWidth: "2px",
                borderStyle: "solid",
                color: "var(--status-limit-dot)"
              }}
              onClick={() => confirmar("Parcial")}
            >
              <span style={{ fontSize: 32 }}>≈</span>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.5 }}>PARCIAL</span>
            </button>
            <button 
              className="choice-btn" 
              style={{
                backgroundColor: "var(--status-report-bg)",
                borderColor: "var(--status-report-border)",
                borderWidth: "2px",
                borderStyle: "solid",
                color: "var(--status-report-dot)"
              }}
              onClick={() => confirmar("Reporte")}
            >
              <span style={{ fontSize: 32 }}>⚑</span>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.5 }}>REPORTE</span>
            </button>
          </div>
          
          <button className="back-btn" onClick={() => setStep(2)}>← Volver</button>
        </>
      )}

      {step === 4 && (
        <div style={{ textAlign: "center", padding: "28px 0" }}>
          <div style={{ fontSize: 72, marginBottom: 14 }}>
            {resultado === "Confirmado OK" ? "✅" : resultado === "Falta" ? "🔴" : resultado === "Parcial" ? "🟡" : "🟣"}
          </div>
          <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 6, letterSpacing: 1 }}>REGISTRADO</div>
          <div style={{ fontSize: 12, color: getEstadoColor(resultado || ""), fontWeight: 700, letterSpacing: 2, marginBottom: 6 }}>{resultado?.toUpperCase()}</div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "var(--status-limit-bg)", border: "1px solid var(--status-limit-border)", borderRadius: 20, padding: "4px 14px", marginBottom: 28, fontSize: 10, color: "var(--status-limit-dot)" }}>
            ⟳ En cola de sincronización offline
          </div>
          <div>
            <button onClick={reset}
              style={{ background: "var(--accent-color)", border: "none", borderRadius: 12, padding: "14px 36px", color: "var(--bg-primary)", fontWeight: 800, fontSize: 13, cursor: "pointer", letterSpacing: 2, fontFamily: "var(--font-sans)", transition: "all 0.2s ease" }}>
              NUEVA VALIDACIÓN
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
