'use client';

import '@/styles/components/Content_Typology_Container.scss';

import Content_Typology_Card from '@/components/Content_Typology_Card';

import { useState, useEffect } from 'react';

export default function Tornar_Acessivel() {
  const desktopBreakpoint = '(min-width: 1066px)';
  const isMatching = window.matchMedia(desktopBreakpoint).matches;
  const [mediaQueryMatches, setMediaQueryMatches] = useState(isMatching);

  useEffect(() => {
    // Define a função de verificação da media query
    const checkMediaQuery = () => {
      const isMatching = window.matchMedia(desktopBreakpoint).matches;
      setMediaQueryMatches(isMatching);
    };

    // Adiciona um listener de eventos para mudanças na media query
    const mediaQueryList = window.matchMedia(desktopBreakpoint);
    mediaQueryList.addEventListener('change', checkMediaQuery);

    // Limpeza ao desmontar o componente
    return () => mediaQueryList.removeEventListener('change', checkMediaQuery);
  }, []); // Não depende de nada, roda apenas na montagem do componente

  return (
    <main className="main content-typology-pre-info">
      {mediaQueryMatches !== undefined && !mediaQueryMatches && <h1>Tornar Acessível</h1>}
      <p className="content-typology-pre-info-paragraph">
        <span>Seleciona</span> o tipo de conteúdo que pretendes tornar mais acessível e não a vertente pela qual se vai tornar mais acessível.
      </p>
      <div className="content-typology-card-container">
        <Content_Typology_Card type="Texto" />
        <Content_Typology_Card type="Imagem" />
        <Content_Typology_Card type="Áudio" />
        <Content_Typology_Card type="Vídeo" />
      </div>
    </main>
  );
}
