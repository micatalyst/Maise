"use client";

import "@/styles/components/Toolbar.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

export default function Toolbar() {
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
          <button type="button"> Tudo </button>
          <button type="button"> Textos </button>
          <button type="button"> Imagens </button>
          <button type="button"> Áudios </button>
          <button type="button"> Vídeos </button>
        </div>
      </div>
    </div>
  );
}
