"use client";

import "@/styles/components/Content_Typology_General_Card.scss";
import Image from "next/image";
import Link from "next/link";

export default function Content_Typology_General_Card(props) {
  return (
    <div className="content-typology-general-card">
      <h2>Tornar Acessível</h2>
      <p className="content-typology-general-info">
        Enriquece os teus <span>conteúdos </span>criando alternativas para os
        tornar mais acessíveis.
      </p>
      <Link href="/Tornar_Acessivel" className="primary-button">
        Tornar Acessível
      </Link>
      <div className="type-image-container">
        <Image
          src="/images/all_Types.png"
          //layout="responsive"
          priority={true}
          alt="Representação de todas as possibilidades de tipos de conteúdos"
          width={1252}
          height={804}
        />
      </div>
    </div>
  );
}
