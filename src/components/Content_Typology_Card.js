"use client";

import "@/styles/components/Content_Typology_Card.scss";

import React, { useState } from "react";

export default function Content_Typology_Card(props) {
  //const [typeDescription, setTypeDescription] = useState();

  const TextDescription = (
    <p>
      Complementa os teus <span>textos</span> (visuais) com alternativas
      <span> sonoras</span>.
    </p>
  );

  const ImageDescription = (
    <p>
      Complementa as tuas <span>imagens</span> (visuais) com alternativas
      <span> sonoras</span>.
    </p>
  );

  const AudioDescription = (
    <p>
      Complementa os teus <span>áudios</span> (sonoros) com alternativas
      <span> escritas</span>.
    </p>
  );

  const VideoDescription = (
    <p>
      Complementa os teus <span>vídeos</span> (audiovisuais) com alternativas
      <span> sonoras</span> e <span> escritas</span>.
    </p>
  );

  const typeDescription = (type) => {
    switch (type) {
      case "Texto":
        return TextDescription;
      case "Imagem":
        return ImageDescription;
      case "Áudio":
        return AudioDescription;
      case "Vídeo":
        return VideoDescription;
    }
  };

  return (
    <div className="content-typology-card">
      <h2>{props.type}</h2>
      {typeDescription(props.type)}
    </div>
  );
}
