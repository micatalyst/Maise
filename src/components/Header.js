import "@/styles/components/Header.scss";

import Navbar from "@/components/Navbar";

export default function Header() {
  return (
    <header className="header">
      <div className="logotipo-text"> MAISE </div>
      <Navbar />
      <button type="button">Sair</button>
    </header>
  );
}
