'use client';

import '@/styles/components/Content_Typology_Card.scss';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react';

export default function Content_Typology_Card(props) {
  const pathname = usePathname();

  const typeDescription = (type) => {
    switch (type) {
      case 'Texto':
        return (
          <p className="content-typology-info">
            Complementa os teus <span>textos</span> (visuais) com alternativas
            <span> sonoras</span>.
          </p>
        );
      case 'Imagem':
        return (
          <p className="content-typology-info">
            Complementa as tuas <span>imagens</span> (visuais) com alternativas
            <span> sonoras</span>.
          </p>
        );
      case 'Áudio':
        return (
          <p className="content-typology-info">
            Complementa os teus <span>áudios</span> (sonoros) com alternativas
            <span> escritas</span>.
          </p>
        );
      case 'Vídeo':
        return (
          <p className="content-typology-info">
            Complementa os teus <span>vídeos</span> (audiovisuais) com alternativas
            <span> sonoras</span> e <span> escritas</span>.
          </p>
        );
    }
  };

  const typeExamples = (type) => {
    switch (type) {
      case 'Texto':
        return (
          <div className="type-examples-container">
            <span>Livros</span>
            <span>Artigos</span>
            <span>Documentos Académicos</span>
          </div>
        );
      case 'Imagem':
        return (
          <div className="type-examples-container">
            <span>Palestras</span>
            <span>Apresentações (slides)</span>
          </div>
        );
      case 'Áudio':
        return (
          <div className="type-examples-container">
            <span>Fotografias</span>
            <span>Slides</span>
            <span>Cartazes</span>
          </div>
        );
      case 'Vídeo':
        return (
          <div className="type-examples-container">
            <span>Palestras</span>
            <span>Documentários</span>
            <span>Tutoriais</span>
          </div>
        );
    }
  };

  const typeImages = (type) => {
    switch (type) {
      case 'Texto':
        return (
          <Image
            src="/images/type_Text.png"
            //layout="responsive"
            priority={true}
            alt="livro aberto"
            width={1252}
            height={804}
          />
        );
      case 'Imagem':
        return (
          <Image
            src="/images/type_Image.png"
            //layout="responsive"
            priority={true}
            alt="livro aberto"
            width={1252}
            height={804}
          />
        );
      case 'Áudio':
        return (
          <Image
            src="/images/type_Audio.png"
            //layout="responsive"
            priority={true}
            alt="livro aberto"
            width={1252}
            height={804}
          />
        );
      case 'Vídeo':
        return (
          <Image
            src="/images/type_Video.png"
            //layout="responsive"
            priority={true}
            alt="livro aberto"
            width={1252}
            height={804}
          />
        );
    }
  };

  const typelink = (type) => {
    switch (type) {
      case 'Texto':
        return 'Texto';
      case 'Imagem':
        return 'Imagem';
      case 'Áudio':
        return 'Audio';
      case 'Vídeo':
        return 'Video';
    }
  };

  return (
    <Link href={pathname + '/' + typelink(props.type)}>
      <div className="content-typology-card">
        <h2>{props.type}</h2>
        {typeDescription(props.type)}
        <p className="content-typology-examples-title">Exemplos</p>
        {typeExamples(props.type)}
        <div className="type-image-container">{typeImages(props.type)}</div>
      </div>
    </Link>
  );
}

{
  /* <Link href={pathname + "/" + typelink(props.type)}> */
}
