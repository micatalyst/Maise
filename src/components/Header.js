import "@/styles/components/Header.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";

import Navbar from "@/components/Navbar";

export default function Header() {
  return (
    <header className="header">
      <div className="logotipo-text"> MAISE </div>
      <Navbar />
      <button type="button">
        <FontAwesomeIcon icon={faRightFromBracket} /> Sair
      </button>
    </header>
  );
}
