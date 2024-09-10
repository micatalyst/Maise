import "@/styles/components/Forms_Text_Step2.scss";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faCaretDown } from "@fortawesome/free-solid-svg-icons";

import { useState, useEffect } from "react";

import Text_Section from "@/components/Texto/Text_Section";

export default function Text_Forms_Step2({
  formData,
  setFormData,
  handlePreviousStep,
}) {
  const [sections, setSections] = useState([]);
  const [addSectionValue, setAddSectionValue] = useState("");

  const [activeSection, setActiveSection] = useState(""); // Secção que está ativa

  const handleInputChange = (event) => {
    setAddSectionValue(event.target.value);
  };

  const handleKeyDown = (event) => {
    // Função para adicionar secções (pelo teclado)
    if (event.key === "Enter") {
      event.preventDefault();
      setSections((prevArray) => [...prevArray, addSectionValue]);
      setAddSectionValue("");
    }
  };

  const handleAddSection = () => {
    // Função para adicionar secções (pelo botão)
    setSections((prevArray) => [...prevArray, addSectionValue]);
    setAddSectionValue("");
  };

  useEffect(() => {
    console.log(addSectionValue);
    console.log(sections);
  }, [addSectionValue, sections]);

  const noSectionsDisplay = (
    <div className="no-sections-container">
      <div>
        <p className="no-section-placeholder">
          Adiciona <span>Secções</span> para começar
        </p>
        <p className="no-section-placeholder">...</p>
      </div>
    </div>
  );

  const contentCriationDisplay = (
    <div className="content-creation-container">
      <div className="content-creation-side-bar">
        <div className="sections-container">
          {sections.map((item, index) => (
            <Text_Section
              id={index}
              key={index}
              title={item}
              activeSection={activeSection}
              setActiveSection={setActiveSection}
            />
          ))}
        </div>
        <div className="language-container">
          <label htmlFor="created_content_language">Idioma</label>
          <div className="forms-select">
            <FontAwesomeIcon icon={faCaretDown} />
            <select
              id="created_content_language"
              value={formData.created_content_language}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  created_content_language: e.target.value,
                });
              }}
              required
            >
              <option value="" disabled>
                Idioma do conteúdo criado...
              </option>
              <option value="Português">Português</option>
              <option value="English">English</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="forms-step2">
      <div className="input-add-sections-container">
        <input
          type="text"
          placeholder="Adicionar secções..."
          value={addSectionValue}
          aria-label="Campo de inserção de novas secções"
          aria-keyshortcuts="Enter"
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
        <button
          type="button"
          onClick={handleAddSection} // Troquei o onClic event pelo "onMouseDown" para prevenir que ao carregar no botão, este perde-se o seu focus provocando a funcionalidade do botão sem focus / de limpeza
          aria-label="Botão para a adição de secções"
        >
          <FontAwesomeIcon icon={faPlus} />
        </button>
      </div>
      {sections.length > 0 ? contentCriationDisplay : noSectionsDisplay}
      <div className="forms-step2-bottom-bar">
        <div className="forms-step2-back-button">
          <button
            className="forms-button"
            type="button"
            onClick={handlePreviousStep}
          >
            Voltar
          </button>
        </div>
        <div className="forms-step2-input-feedback-submit-container">
          <div> Requisitos obrigatórios para finalizar: </div>
          <div>
            <button className="forms-button" type="submit">
              {/* Fazer a logica para que esteja "disabled" no botão enquanto ainda faltar preencher alguma coisa. Isto ajudará*/}
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

{
  /*
   */
}
