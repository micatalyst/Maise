import Link from "next/link";

import "@/styles/components/Navbar.scss";

export default function Navbar() {
  return (
    <nav className="nav" aria-label="Navegação principal">
      <ul>
        <li>
          <Link href="/">Arquivo UA</Link>
        </li>
        <li>
          <Link href="/Tornar_Acessivel">Tornar Acessível</Link>
        </li>
        <li>
          <Link href="/Area_Pessoal">Área Pessoal</Link>
        </li>
        <li>
          <Link href="/Ajuda">Ajuda</Link>
        </li>
        <li>
          <Link href="/Sobre">Sobre</Link>
        </li>
      </ul>
    </nav>
  );
}
