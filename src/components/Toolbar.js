'use client';

import '@/styles/components/Toolbar.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faXmark, faCaretDown } from '@fortawesome/free-solid-svg-icons';

import { useState, useEffect } from 'react';

export default function Toolbar({ onFilterType, filter, onSearch, onTabUpdate, mediaQueryMatches }) {
  const [activeFilter, setActiveFilter] = useState('Tudo');

  const [searchValue, setSearchValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleInputChange = (event) => {
    setSearchValue(event.target.value.trimStart());
  };

  // Função para a pesquisa dos conteúdos (pelo teclado) por input recebido pelo utilizador

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      onSearch(searchValue);
      if (searchValue) {
        setHasSearched(true);
      } else {
        setHasSearched(false);
      }
    }
  };

  // Função para a pesquisa dos conteúdos (pelo botão) por input recebido pelo utilizador // Garante que o botão não é spamado caso não esteja a ser feita qualquer tipo de pesquisa

  const handleSearchButton = () => {
    onSearch(searchValue);
    if (searchValue) {
      setHasSearched(true);
    } else {
      setHasSearched(false);
    }
  };

  const handleClearSearchButton = () => {
    setHasSearched(false);
    onSearch(''); // Garante que a pesquisa é limpa de qualquer filtragem por input de texto devolvendo / mostrando ao utilizador todos os possiveis conteúdos novamente
    setSearchValue(''); // limpeza do campo de pesquisa / input de texto
  };

  // Tab Update Filters Reset

  useEffect(() => {
    setHasSearched(false);
    onSearch('');
    setSearchValue('');
    setActiveFilter('Tudo');
  }, [onTabUpdate]);

  // Com este useEffect é possivel que o utilizador consiga o mesmo resultado acima apenas apagando todo o texto do campo de pesquisa

  useEffect(() => {
    if (hasSearched) {
      if (!searchValue) {
        setHasSearched(false);
        onSearch(searchValue);
      }
    }
  }, [searchValue, hasSearched]);

  // Componentes dos Botões de pesquisa e limpeza da pesquisa

  const SearchButton = (
    <button
      type="button"
      onMouseDown={handleSearchButton} // Troquei o onClic event pelo "onMouseDown" para prevenir que ao carregar no botão, este perde-se o seu focus provocando a funcionalidade do botão sem focus / de limpeza
      aria-label="Botão de pesquisa de conteúdos"
    >
      <FontAwesomeIcon icon={faMagnifyingGlass} />
    </button>
  );

  const ClearSearchButton = (
    <button
      type="button"
      onMouseDown={handleClearSearchButton}
      aria-label="Botão de limpeza da pesquisa dos conteúdos"
    >
      <FontAwesomeIcon icon={faXmark} />
    </button>
  );

  const MobileToolbar = (
    <div
      className="filter"
      aria-label="Filtragem por tipos de conteúdo"
    >
      <label htmlFor="filter">Filtrar por:</label>
      
      <div className="forms-select">
        <FontAwesomeIcon icon={faCaretDown} />
        <select
          id="filter"
          name="filter"
          value={filter}
          onChange={(e) => {
            onFilterType(e.target.value);
            setActiveFilter(e.target.value);
          }}
          required
        >
          <option value="Tudo">Tudo</option>
          <option value="Texto">Texto</option>
          <option value="Imagem">Imagem</option>
          <option value="Áudio">Áudio</option>
          <option value="Vídeo">Vídeo</option>
        </select>
      </div>
    </div>
  );

  const DesktopToolbar = (
    <div
      className="filter"
      aria-label="Filtragem por tipos de conteúdo"
    >
      <span>Filtrar por:</span>
      <div>
        <button
          type="button"
          className={activeFilter === 'Tudo' ? 'active' : ''}
          aria-pressed={activeFilter === 'Tudo'}
          onClick={() => {
            onFilterType('Tudo');
            setActiveFilter('Tudo');
          }}
        >
          Tudo
        </button>
        <button
          type="button"
          className={activeFilter === 'Texto' ? 'active' : ''}
          aria-pressed={activeFilter === 'Texto'}
          onClick={() => {
            onFilterType('Texto');
            setActiveFilter('Texto');
          }}
        >
          Textos
        </button>
        <button
          type="button"
          className={activeFilter === 'Imagem' ? 'active' : ''}
          aria-pressed={activeFilter === 'Imagem'}
          onClick={() => {
            onFilterType('Imagem');
            setActiveFilter('Imagem');
          }}
        >
          Imagens
        </button>
        <button
          type="button"
          className={activeFilter === 'Áudio' ? 'active' : ''}
          aria-pressed={activeFilter === 'Áudio'}
          onClick={() => {
            onFilterType('Áudio');
            setActiveFilter('Áudio');
          }}
        >
          Áudios
        </button>
        <button
          type="button"
          className={activeFilter === 'Vídeo' ? 'active' : ''}
          aria-pressed={activeFilter === 'Vídeo'}
          onClick={() => {
            onFilterType('Vídeo');
            setActiveFilter('Vídeo');
          }}
        >
          Vídeos
        </button>
      </div>
    </div>
  );

  return (
    <div className="toolbar">
      <div className="search">
        <input
          type="text"
          inputMode="search"
          placeholder="Pesquise por conteúdos..."
          value={searchValue}
          aria-label="Campo de pesquisa de conteúdos"
          aria-keyshortcuts="Enter" // ponderar em fazer um sistema que realmente distribui automaticamente os aria-keyshortcuts (em caso da existência de keyshortcuts).
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            setIsFocused(true);
          }}
          onBlur={() => {
            setIsFocused(false);
          }}
        />
        {/* Ternary Operator com as condições para a renderização dos botões */}
        {!isFocused && !searchValue ? SearchButton : isFocused ? SearchButton : !isFocused && searchValue && !hasSearched ? SearchButton : ClearSearchButton}
      </div>
      {mediaQueryMatches === undefined ? '' : mediaQueryMatches ? DesktopToolbar : MobileToolbar}
    </div>
  );
}
