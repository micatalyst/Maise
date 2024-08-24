import "@/styles/components/Content_Typology_Container.scss";

import Content_Typology_Card from "@/components/Content_Typology_Card";

export default function Tornar_Acessivel() {
  return (
    <main className="main content-typology-pre-info">
      <p className="content-typology-pre-info-paragraph">
        <span>Seleciona</span> o tipo de conteúdo que pretendes tornar mais
        acessível e não a vertente pela qual se vai tornar mais acessível.
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
