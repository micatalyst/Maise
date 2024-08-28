"use client";

import "@/styles/components/Toolbar.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

import { useState } from "react";

export default function Toolbar({ onFilter }) {
  const [activeFilter, setActiveFilter] = useState("Tudo");

  return (
    <div className="toolbar">
      <div className="search">
        <input
          type="text"
          placeholder="Pesquise por documentos e/ou autores"
          aria-label="Campo de pesquisa de conteúdos"
        />
        <button type="button" aria-label="botão de pesquisa dos conteúdos">
          <FontAwesomeIcon icon={faMagnifyingGlass} />
        </button>
      </div>
      <div className="filter" aria-label="Filtragem por tipos de conteúdo">
        <span>Filtrar por:</span>
        <div>
          <button
            type="button"
            className={activeFilter === "Tudo" ? "active" : ""}
            aria-pressed={activeFilter === "Tudo"}
            onClick={() => {
              onFilter("Tudo");
              setActiveFilter("Tudo");
            }}
          >
            Tudo
          </button>
          <button
            type="button"
            className={activeFilter === "Texto" ? "active" : ""}
            aria-pressed={activeFilter === "Texto"}
            onClick={() => {
              onFilter("Texto");
              setActiveFilter("Texto");
            }}
          >
            Textos
          </button>
          <button
            type="button"
            className={activeFilter === "Imagem" ? "active" : ""}
            aria-pressed={activeFilter === "Imagem"}
            onClick={() => {
              onFilter("Imagem");
              setActiveFilter("Imagem");
            }}
          >
            Imagens
          </button>
          <button
            type="button"
            className={activeFilter === "Áudio" ? "active" : ""}
            aria-pressed={activeFilter === "Áudio"}
            onClick={() => {
              onFilter("Áudio");
              setActiveFilter("Áudio");
            }}
          >
            Áudios
          </button>
          <button
            type="button"
            className={activeFilter === "Vídeo" ? "active" : ""}
            aria-pressed={activeFilter === "Vídeo"}
            onClick={() => {
              onFilter("Vídeo");
              setActiveFilter("Vídeo");
            }}
          >
            Vídeos
          </button>
        </div>
      </div>
    </div>
  );
}
