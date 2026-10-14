import React, { useState } from 'react';
import '../styles/pedidos.css';

const CATALOGO_TORTAS = [
  {
    id: 1,
    nombre: "Torta Blueberry",
    categoria: "Frutales",
    precio: 15000,
    imagen: "/images/torta-blueberry.png",
    descripcion: "Deliciosa torta con relleno de arándanos frescos y crema suave de la casa."
  },
  {
    id: 2,
    nombre: "Torta Bizcocho Café",
    categoria: "Especiales",
    precio: 18000,
    imagen: "/images/bizcocho-cafe.webp",
    descripcion: "Esponjoso bizcocho de café artesanal con suave crema estilo tiramisú."
  },
  {
    id: 3,
    nombre: "Mini Pastel Capricho",
    categoria: "Individuales",
    precio: 8000,
    imagen: "/images/minipastel.jpg",
    descripcion: "Ideal para regalar o disfrutar un capricho personal en cualquier momento."
  }
];

export default function Tortas() {
  const [categoria, setCategoria] = useState('Todas');
  const [carrito, setCarrito] = useState([]);

  const categorias = ['Todas', 'Frutales', 'Especiales', 'Individuales'];

  const tortasFiltradas = categoria === 'Todas'
    ? CATALOGO_TORTAS
    : CATALOGO_TORTAS.filter(torta => torta.categoria === categoria);

  const agregarAlCarrito = (producto) => {
    setCarrito(prev => [...prev, producto]);
    alert(`¡${producto.nombre} agregado al carrito!`);
  };

  return (
    <div className="pedidos-page">
      <header className="pedidos-header">
        <div>
          <h1>Nuestras Tortas</h1>
          <p style={{ color: "var(--cocoa-soft)", marginTop: "6px" }}>
            Catálogo exclusivo de repostería artesanal Dulce Capricho
          </p>
        </div>
      </header>

      {/* Barra de Filtros */}
      <div className="pedidos-toolbar">
        <div className="toolbar-group">
          <label>Categoría:</label>
          {categorias.map(cat => (
            <button
              key={cat}
              className={`btn-secondary ${categoria === cat ? 'btn-activo' : ''}`}
              style={{
                padding: "8px 16px",
                borderRadius: "20px",
                cursor: "pointer",
                fontWeight: categoria === cat ? "700" : "500",
                background: categoria === cat ? "var(--rose)" : "transparent",
                color: categoria === cat ? "#fff" : "var(--wine)",
                borderColor: categoria === cat ? "var(--rose)" : "rgba(58, 35, 24, 0.22)"
              }}
              onClick={() => setCategoria(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de Tortas */}
      <section style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        gap: "24px"
      }}>
        {tortasFiltradas.map(torta => (
          <article key={torta.id} className="pedido-card" style={{ display: "flex", flexDirection: "column" }}>
            <div style={{
              width: "100%",
              height: "200px",
              borderRadius: "12px",
              overflow: "hidden",
              marginBottom: "14px",
              background: "var(--cream)"
            }}>
              <img 
                src={torta.imagen} 
                alt={torta.nombre} 
                style={{ width: "100%", height: "100%", objectFit: "cover" }} 
              />
            </div>
            
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <span className="estado-badge estado-en-preparacion">{torta.categoria}</span>
              <span style={{ fontFamily: "Fraunces, serif", fontWeight: "700", color: "var(--wine)", fontSize: "1.2rem" }}>
                ${torta.precio.toLocaleString('es-CL')}
              </span>
            </div>

            <h2 style={{ fontFamily: "Fraunces, serif", color: "var(--wine)", fontSize: "1.25rem", marginBottom: "8px" }}>
              {torta.nombre}
            </h2>

            <p style={{ color: "var(--cocoa-soft)", fontSize: "0.9rem", flexGrow: 1, marginBottom: "16px" }}>
              {torta.descripcion}
            </p>

            <button 
              className="btn-secondary"
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "10px",
                fontWeight: "600",
                cursor: "pointer",
                background: "var(--wine)",
                color: "#fff",
                border: "none"
              }}
              onClick={() => agregarAlCarrito(torta)}
            >
              Añadir al Carrito
            </button>
          </article>
        ))}
      </section>
    </div>
  );
}