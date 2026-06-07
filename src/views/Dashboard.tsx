import { useState } from "react";
import { RECURSOS, ZONAS_MAPA, SEM } from "../constants/data";

export const Dashboard = () => {
  const [detalle, setDetalle] = useState<string | null>(null);

  return (
    <div className="fade-in">
      <div className="dashboard-layout">
        
        {/* Left Column: Resources */}
        <div>
          <div className="section-label">ESTADO DE RECURSOS</div>
          <div className="resources-grid">
            {RECURSOS.map(r => {
              const open = detalle === r.id;
              const statusClass = r.estado.toLowerCase();
              const statusKey = statusClass === 'verde' ? 'ok' : statusClass === 'amarillo' ? 'limit' : 'none';
              
              return (
                <div 
                  key={r.id} 
                  onClick={() => setDetalle(open ? null : r.id)}
                  className="card"
                  style={{ 
                    cursor: "pointer",
                    borderColor: `var(--status-${statusKey}-border)`
                  }}
                >
                  <div className="resource-card-body">
                    <div className="resource-icon-container">{r.icono}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "1.05rem", fontWeight: 700 }}>{r.tipo}</div>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: 2 }}>Act: {r.fecha}</div>
                    </div>
                    <div className="resource-status-info">
                      <div 
                        className="status-dot" 
                        style={{ 
                          backgroundColor: `var(--status-${statusKey}-dot)`,
                          boxShadow: `0 0 10px var(--status-${statusKey}-dot)` 
                        }} 
                      />
                      <div 
                        className="status-label"
                        style={{ color: `var(--status-${statusKey}-dot)` }}
                      >
                        {SEM[r.estado].label}
                      </div>
                    </div>
                  </div>
                  
                  {open && (
                    <div className="zones-detail-container">
                      <div className="zones-detail-grid">
                        {["Zona A","Zona B","Zona C","Zona D","Zona E"].map((z, i) => {
                          const estados = ["VERDE","AMARILLO","ROJO","VERDE","AMARILLO"];
                          const zEstado = estados[i].toLowerCase();
                          const zStatusKey = zEstado === 'verde' ? 'ok' : zEstado === 'amarillo' ? 'limit' : 'none';
                          return (
                            <div 
                              key={z} 
                              className="zone-mini-card"
                              style={{ backgroundColor: `var(--status-${zStatusKey}-bg)` }}
                            >
                              <div 
                                className="zone-mini-dot" 
                                style={{ backgroundColor: `var(--status-${zStatusKey}-dot)` }} 
                              />
                              <div className="zone-mini-label">{z.replace("Zona ", "")}</div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Blind Map */}
        <div>
          <div className="section-label">MAPA CIEGO · ZONAS</div>
          <div className="card map-card">
            <div className="zones-grid">
              {ZONAS_MAPA.map(z => {
                const zStatusClass = z.estado.toLowerCase();
                const zStatusKey = zStatusClass === 'verde' ? 'ok' : zStatusClass === 'amarillo' ? 'limit' : 'none';
                return (
                  <div 
                    key={z.id} 
                    className="map-zone-item"
                    style={{ border: `1px solid var(--status-${zStatusKey}-border)` }}
                  >
                    <div 
                      className="status-dot" 
                      style={{ 
                        backgroundColor: `var(--status-${zStatusKey}-dot)`,
                        boxShadow: `0 0 8px var(--status-${zStatusKey}-dot)` 
                      }} 
                    />
                    <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-primary)" }}>
                      Zona {z.label}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="map-legend">
              {Object.entries(SEM).map(([k, v]) => {
                const statusKey = k.toLowerCase() === 'verde' ? 'ok' : k.toLowerCase() === 'amarillo' ? 'limit' : 'none';
                return (
                  <div key={k} className="legend-item">
                    <div className="legend-dot" style={{ backgroundColor: `var(--status-${statusKey}-dot)` }} />
                    <span className="legend-label">{v.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
