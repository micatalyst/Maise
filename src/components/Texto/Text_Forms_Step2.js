import "@/styles/components/Forms_Text_Step2.scss";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faCaretDown,
  faFileArrowUp,
  faFilePen,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";

import { faFileLines } from "@fortawesome/free-regular-svg-icons";

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  setCreatedContentLanguage,
  setActiveSectionId,
  addSection,
  setReorderedSections,
  selectActiveSection,
} from "@/slicers/TempTextContentSlice";

import { Reorder, motion } from "framer-motion";
import { useDropzone } from "react-dropzone";

import Text_Section from "@/components/Texto/Text_Section";
import Modal_Text_forms from "@/components/Texto/Modal_Text_forms";
import Audio_Visualiser from "@/components/Texto/Audio_Visualiser";
import StepValidationFeedback from "./StepValidationFeedback";

export default function Text_Forms_Step2({
  handlePreviousStep,
  handleSubmit,
  original_content_file,
  original_content_PreviewUrl,
  accessibleAudioFiles,
  setAccessibleAudioFiles,
}) {
  const created_content_language = useSelector(
    (state) => state.TempTextContentSlice.created_content_language
  );

  const sections = useSelector((state) => state.TempTextContentSlice.sections);
  const activeSectionId = useSelector(
    (state) => state.TempTextContentSlice.activeSectionId
  );
  const activeSection = useSelector(selectActiveSection);

  const dispatch = useDispatch();

  const maxSize = 50 * 1024 * 1024; // 50 MB
  const [error, setError] = useState("");

  const [sectionOnChangeInputValue, setSectionOnChangeInputValue] =
    useState(""); // value do input de criação de sections
  //const [activeSection, setActiveSection] = useState(); // Id da section que está ativa

  const [isDragging, setIsDragging] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");

  useEffect(() => {
    if (sections.length === 1) {
      // Não havia sections antes, seleccionar a primeira (primeira vez ou depois de apagar todas)
      dispatch(setActiveSectionId(sections[0].id));
    }
  }, [sections]);

  const [stepValidations, setStepValidations] = useState([]);
  const [allStepValidationsValid, setAllStepValidationsValid] = useState(false);
  useEffect(() => {
    // Verificar se os nomes das secçoes sao unicos
    // 1) Criar um Set (chaves unicas) a partir do array de nomes
    // 2) Criar um array desse set
    // 3) Se os tamanhos (das sections e dos nomes unicos) forem iguais, entao os nomes sao unicos
    const allSectionsHaveUniqueNames = Boolean(
      sections.length > 0 &&
        Array.from(new Set(sections.map((s) => s.title))).length ===
          sections.length
    );

    setStepValidations([
      {
        title: "Adicionar pelo menos uma secção",
        isValid: sections.length > 0, // usar > 0 em vez de so ver se tem length, para o isValid ser false em vez de 0 (que e falsy na mesma, mas nao e' boolean)
      },
      {
        title: "Idioma do conteúdo criado",
        isValid: sections.length > 0 && Boolean(created_content_language),
      },
      {
        title: "Secções devem ter nomes únicos",
        isValid: allSectionsHaveUniqueNames,
      },
      {
        title: "Cada secção deve ter um áudio",
        isValid:
          sections.length > 0 &&
          accessibleAudioFiles.length === sections.length,
      },
    ]);
  }, [sections, created_content_language, accessibleAudioFiles]);

  useEffect(() => {
    setAllStepValidationsValid(stepValidations.every((step) => step.isValid));
  }, [stepValidations]);

  // handlePreview abre um separador com o documento original aberto

  const handlePreview = () => {
    if (original_content_PreviewUrl) {
      window.open(original_content_PreviewUrl, "_blank"); // Abre o ficheiro num novo separador
    } else {
      // trigger de feedback a dizer que o documento não foi carregado
    }
  };

  // Modal

  const openModal = (modal) => {
    setModalType(modal);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Section Input

  const handleInputChange = (event) => {
    setSectionOnChangeInputValue(event.target.value);
  };

  // Adição de novas sections

  // Função para adicionar sections (pelo teclado)
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleAddSection();
    }
  };

  // Função para adicionar sections (pelo botão)
  const handleAddSection = () => {
    if (sectionOnChangeInputValue) {
      // Garante que existe um nome para section (previne a criação de sections sem nome)
      dispatch(
        addSection({
          id: sections.length ? sections[sections.length - 1].id + 1 : 0,
          title: sectionOnChangeInputValue,
        })
      );

      setSectionOnChangeInputValue("");
    }
  };

  // Handle onClick para ativação da section (se esta não estiver a ser arrastada)

  const handleSectionActivation = (id) => {
    if (!isDragging) {
      dispatch(setActiveSectionId(id)); // Só executa o clique se não estiver a ser arrastado
    }
  };

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  // Reordenação das sections

  const handleReorder = (reorderedSections) => {
    dispatch(setReorderedSections(reorderedSections));
  };

  // Carregamento da vertente mais acessivel (Áudio)

  const onDrop = (acceptedFiles, rejectedFiles) => {
    // Verifica se o arquivo foi aceite
    if (rejectedFiles.length > 0) {
      const errorMessage = rejectedFiles[0].errors[0].message;
      setError(errorMessage);
      return;
    }

    // Se o arquivo foi aceite

    setAccessibleAudioFiles((prevFiles) => [
      ...prevFiles,
      {
        id: activeSectionId,
        audioFile: acceptedFiles[0],
        audioFilePreviewUrl: URL.createObjectURL(acceptedFiles[0]),
      },
    ]);
    setError("");
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "audio/mpeg": [".mp3"],
      "audio/wav": [".wav"],
    },
    maxSize: maxSize,
  });

  // Componente quando (não) há sections

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

  // Componente quando há sections

  const contentCriationDisplay = (
    <div className="content-creation-container">
      <div className="content-creation-left-side-bar">
        <motion.div className="sections-container" layoutScroll>
          <Reorder.Group
            axis="y"
            values={sections}
            onReorder={handleReorder}
            //className="sections-container"
          >
            {sections.map((item) => (
              <Text_Section
                key={item.id}
                item={item}
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
              value={created_content_language}
              onChange={(e) =>
                dispatch(setCreatedContentLanguage(e.target.value))
              }
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
      <div className="content-creation-work-space">
        <div className="content-creation-top-bar">
          {activeSection && (
            <>
              <h2>{activeSection.title}</h2>
              <button
                className="primary-button icon"
                type="button"
                onClick={() => {
                  openModal("updateSection");
                }}
              >
                <FontAwesomeIcon icon={faFilePen} />
                Editar titulo
              </button>
              <button
                className="negative-button icon"
                type="button"
                onClick={() => {
                  openModal("DeleteSection");
                }}
              >
                <FontAwesomeIcon icon={faTrashCan} />
                Apagar secção
              </button>
            </>
          )}
        </div>
        <div className="content-creation-upload">
          {accessibleAudioFiles.find((file) => file.id === activeSectionId) ? (
            <Audio_Visualiser
              accessibleAudioFiles={accessibleAudioFiles}
              activeSectionId={activeSectionId}
            />
          ) : (
            <div
              {...getRootProps({
                className: "dropzone",
                tabIndex: 0,
                "aria-labelledby": "dropzone-label",
              })}
            >
              <div className="Centralisation">
                <input
                  {...getInputProps({ id: "fileImport", name: "fileImport" })}
                />
                <div className="dropzone-info">
                  <FontAwesomeIcon icon={faFileArrowUp} />
                  <p>Arrasta e larga</p>
                  <span>ou</span>
                  <button className="primary-button" type="button">
                    Procura no PC
                  </button>
                </div>
                <div className="dropzone-file-type">
                  <span>Ficheiros (até: {maxSize / 1024 / 1024} MB)</span>
                  <p>MP3 / WAV</p>
                  {/* <p>
                {accessibleAudioFiles.find(
                  (file) => file.id === activeSectionId
                )
                  ? "Guardou o áudio"
                  : "Nenhum áudio salvo"}
              </p> */}
                </div>
              </div>
            </div>
          )}
        </div>
        {/* <div>{activeSection.description}</div> */}
        <Modal_Text_forms
          isOpen={isModalOpen}
          closeModal={closeModal}
          modal={modalType}
          setAccessibleAudioFiles={setAccessibleAudioFiles}
          accessibleAudioFiles={accessibleAudioFiles}
          activeSectionId={activeSectionId}
        />
      </div>
      <div className="content-creation-right-side-bar">
        <div className="file-icon">
          <FontAwesomeIcon icon={faFileLines} />
        </div>
        <button
          className="primary-button"
          type="button"
          onClick={handlePreview}
        >
          Ver documento original
        </button>
        <div className="file-side-info">
          <div>
            <span>Nome</span>
            <p>
              {original_content_file ? original_content_file.name : "noFile"}
            </p>
          </div>
          <div>
            <span>Tamanho</span>
            <p>
              {original_content_file
                ? (original_content_file.size / 1024 / 1024).toFixed(2)
                : "noFile"}
              MB
            </p>
          </div>
          <div>
            <span>Última modificação</span>
            <p>
              {original_content_file
                ? new Date(
                    original_content_file.lastModified
                  ).toLocaleDateString()
                : "noFile"}
            </p>
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
          value={sectionOnChangeInputValue}
          aria-label="Campo de inserção de novas secções"
          aria-keyshortcuts="Enter"
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          maxLength="70"
        />
        <button
          type="button"
          onClick={handleAddSection}
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
          <div className="forms-step1-bottom-bar">
            <StepValidationFeedback
              title={"Requisitos obrigatórios para finalizar:"}
              validation={stepValidations}
            />
          </div>
          <div>
            <button
              className={
                allStepValidationsValid
                  ? "forms-button"
                  : "forms-button invalid"
              }
              type="button"
              onClick={(e) => {
                allStepValidationsValid && handleSubmit(e);
              }}
              disabled={!allStepValidationsValid}
              aria-disabled={allStepValidationsValid ? false : true}
            >
              {/* Fazer a logica para que esteja "disabled" no botão enquanto ainda faltar preencher alguma coisa. Isto ajudará*/}
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
