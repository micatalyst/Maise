import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleHalfStroke,
  faUniversalAccess,
} from "@fortawesome/free-solid-svg-icons";

import "@/styles/components/Navbar.scss";

export default function Navbar() {
  return (
    <nav className="nav" aria-label="Navegação principal">
      <ul>
        <li>
          <Link href="/" className="active">
            Arquivo UA
          </Link>
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
        <li>
          <button type="button">
            <FontAwesomeIcon icon={faCircleHalfStroke} />
          </button>
        </li>
        <li>
          <button type="button">
            <FontAwesomeIcon icon={faUniversalAccess} />
          </button>
        </li>
      </ul>
    </nav>
  );
}
