import React from "react";
import { CICLO_ACTIVO, HISTORIAL_CICLOS } from "../constants/data";

export const Voceria: React.FC = () => {
  return (
    <div className="fade-in">
      <div className="section-label">CICLO ACTIVO</div>
      
      <div className="vocero-active-card">
        <div className="vocero-info-header">
          <div>
            <div className="vocero-alias">{CICLO_ACTIVO.alias}</div>
            <div className="vocero-dates">{CICLO_ACTIVO.inicio} → {CICLO_ACTIVO.fin}</div>
          </div>
          <div className="vocero-status-pill">ACTIVO</div>
        </div>
        <div className="vocero-notice">
          <span style={{ color: "var(--status-limit-dot)" }}>⚠</span>
          Visible solo durante su ciclo activo · Sin permanencia
        </div>
      </div>

      {/* Anti-concentration */}
      <div className="vocero-lock-card">
        <span style={{ fontSize: 24 }}>🔒</span>
        <div>
          <div className="lock-title">ANTI-CONCENTRACIÓN ACTIVO</div>
          <div className="lock-subtitle">Rotación obligatoria · Vocero fijo bloqueado</div>
        </div>
      </div>

      <div className="section-label">HISTORIAL DE CICLOS</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {HISTORIAL_CICLOS.map(c => (
          <div key={c.id} className="card voceria-history-item">
            <div>
              <div style={{ fontSize: "0.95rem", color: "var(--text-primary)", fontWeight: 600 }}>{c.alias}</div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: 4, letterSpacing: 0.5 }}>
                {c.inicio} → {c.fin}
              </div>
            </div>
            <div style={{ textAlign: "right", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
              <div 
                style={{ 
                  borderRadius: 20, 
                  padding: "3px 12px", 
                  fontSize: 9, 
                  fontWeight: 700, 
                  letterSpacing: 0.5,
                  backgroundColor: "var(--bg-primary)",
                  border: "1px solid var(--border-color)",
                  color: "var(--text-secondary)"
                }}
              >
                FINALIZADO
              </div>
              <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--accent-color)", marginTop: 2 }}>
                {c.validaciones}
              </div>
              <div style={{ fontSize: "0.6rem", color: "var(--text-tertiary)", letterSpacing: 0.5, fontWeight: 700 }}>
                VALIDACIONES
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
