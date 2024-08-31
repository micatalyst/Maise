import "@/styles/components/Horizontal_Tab.scss";

import { useState } from "react";

export default function Horizontal_Tab({ onActiveTab }) {
  const [activeTab, setActiveTab] = useState("Documentos pessoais");

  return (
    <div className="tab-container">
      <button
        type="button"
        className={activeTab === "Documentos pessoais" ? "active" : ""}
        aria-pressed={activeTab === "Documentos pessoais"}
        onClick={() => {
          setActiveTab("Documentos pessoais");
          onActiveTab("Documentos pessoais");
        }}
      >
        Documentos pessoais
      </button>
      <button
        type="button"
        className={activeTab === "Guardados" ? "active" : ""}
        aria-pressed={activeTab === "Guardados"}
        onClick={() => {
          setActiveTab("Guardados");
          onActiveTab("Guardados");
        }}
      >
        Guardados
      </button>
    </div>
  );
}
