import "@/styles/components/Forms_Text_Step2.scss";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faCaretDown } from "@fortawesome/free-solid-svg-icons";

import { useState, useEffect } from "react";
import { Reorder, motion } from "framer-motion";

import Text_Section from "@/components/Texto/Text_Section";
import Modal from "@/components/Modal";

export default function Text_Forms_Step2({
  formData,
  setFormData,
  handlePreviousStep,
}) {
  const [addSectionValue, setAddSectionValue] = useState(""); // valor do input de criação de sections
  const [activeSection, setActiveSection] = useState(); // Section que está ativa
  const [sectionId, setSectionId] = useState(0); // Id da section
  const [firstSectionActivation, setFirstSectionActivation] = useState(true);

  const [isDragging, setIsDragging] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Garante que a primeira section criada fica logo pré-selecionada
    if (firstSectionActivation) {
      setActiveSection(sectionId);
      setFirstSectionActivation(false);
    }

    console.log(formData.sections);

    // Colocar isto numa especie de handler de apagar uma section e não aqui no useEffect
    // garante que quando as sections são todas apagadas e depois novamente criadas a primeira vai novamente ficar pré-selecionada

    /* if (!firstSectionActivation && formData.sections.length < 1) {
      setFirstSectionActivation(true);
      setSectionId(0)
    } */

    // Garante que se a section selecionada for apagada outra fica logo selecionada
    /* if () {} */
  }, [firstSectionActivation, sectionId, formData.sections]);

  // Modal

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Section Input

  const handleInputChange = (event) => {
    setAddSectionValue(event.target.value);
  };

  // Adição de novas sections

  const handleKeyDown = (event) => {
    // Função para adicionar sections (pelo teclado)
    if (event.key === "Enter") {
      event.preventDefault();
      if (addSectionValue) {
        // Garante que existe um nome para section (previne a criação de sections sem nome)
        setFormData((prevFormData) => ({
          ...prevFormData,
          sections: [
            ...prevFormData.sections,
            {
              id: sectionId,
              sectionTitle: addSectionValue,
            },
          ],
        }));
        setAddSectionValue("");
        setSectionId((prevId) => prevId + 1);
      }
    }
  };

  const handleAddSection = () => {
    // Função para adicionar sections (pelo botão)
    if (addSectionValue) {
      // Garante que existe um nome para section (previne a criação de sections sem nome)
      setFormData((prevFormData) => ({
        ...prevFormData,
        sections: [
          ...prevFormData.sections,
          {
            id: sectionId,
            sectionTitle: addSectionValue,
          },
        ],
      }));
      setAddSectionValue("");
      setSectionId((prevId) => prevId + 1);
    }
  };

  // Handle onClick / ativação da section

  const handleSectionActivation = (id) => {
    if (!isDragging) {
      setActiveSection(id); // Só executa o clique se não estiver a ser arrastado
    }
  };

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  // reordenação das sections atuais

  const handleReorder = (newSections) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      sections: newSections, // Atualiza o array de sections com a nova ordem
    }));
  };

  // -----------

  /* const handleSectionActivation = (event) => {
    if (isDragging) {
      event.preventDefault(); // Opcional: Impede o clique se arrastando
      return;
    } else {
    }
  }; */

  /* const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  }; */

  // -----------

  // Componente quando não há sections

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
        <motion.div className="sections-container" layoutScroll>
          <Reorder.Group
            axis="y"
            values={formData.sections}
            onReorder={handleReorder}
            //className="sections-container"
          >
            {formData.sections.map((item) => (
              <Text_Section
                key={item.id}
                item={item}
                id={item.id}
                title={item.sectionTitle}
                activeSection={activeSection}
                handleSectionActivation={handleSectionActivation}
                handleDragStart={handleDragStart}
                handleDragEnd={handleDragEnd}
              />
            ))}
          </Reorder.Group>
        </motion.div>
        <div className="language-container">
          <label htmlFor="created_content_language">Idioma</label>
          <div className="forms-select">
            <FontAwesomeIcon icon={faCaretDown} />
            <select
              id="created_content_language"
              name="created_content_language"
              value={formData.created_content_language}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  created_content_language: e.target.value,
                });
              }}
              //required
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
      <div>
        <button onClick={openModal}>Abrir Modal</button>
        <Modal isOpen={isModalOpen} closeModal={closeModal} />
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
          maxLength="70"
          //readOnly (Usar isto para garantir que o conteudo não seja editavel mas apenas meramente visualizavel)
        />
        <button
          type="button"
          onClick={handleAddSection} // Troquei o onClic event pelo "onMouseDown" para prevenir que ao carregar no botão, este perde-se o seu focus provocando a funcionalidade do botão sem focus / de limpeza
          aria-label="Botão para a adição de secções"
        >
          <FontAwesomeIcon icon={faPlus} />
        </button>
      </div>
      {formData.sections.length > 0
        ? contentCriationDisplay
        : noSectionsDisplay}
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
