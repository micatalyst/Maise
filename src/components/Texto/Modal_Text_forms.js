import { useRef, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  updateSectionTitle,
  removeSection,
  selectActiveSection,
} from "@/slicers/TempTextContentSlice";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";

import "@/styles/components/Modal.scss";

export default function Modal_Text_forms({
  isOpen,
  closeModal,
  modal,
  setAccessibleAudioFiles,
  accessibleAudioFiles,
  activeSectionId,
}) {
  const dialogRef = useRef(null);

  const dispatch = useDispatch();

  const activeSection = useSelector(selectActiveSection);

  const [sectionOnChangeInputValue, setSectionOnChangeInputValue] =
    useState("");

  // Abre o modal se o prop "isOpen" for verdadeiro
  useEffect(() => {
    if (isOpen && dialogRef.current) {
      setSectionOnChangeInputValue(activeSection && activeSection.title);
      dialogRef.current.showModal();
    }
  }, [isOpen]);

  // Fecha o modal quando clicado fora ou quando o botão fechar for acionado
  const handleClose = () => {
    dialogRef.current.close();
    closeModal();
  };

  const handleKeyDownOnSectionTitleInput = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleUpdateSection();
    }
  };

  // Atualiza o título da secção
  const handleUpdateSection = () => {
    if (sectionOnChangeInputValue) {
      dispatch(
        updateSectionTitle({
          id: activeSection.id,
          title: sectionOnChangeInputValue,
        })
      );
      handleClose();
    }
  };

  // Apaga a secção
  const handleRemoveSection = () => {
    dispatch(removeSection(activeSection.id));

    //Apaga o objeto do conteudo mais acessivel do array de todos os objetos onde este foi inserido
    setAccessibleAudioFiles(
      accessibleAudioFiles.filter((file) => file.id !== activeSectionId)
    );
    handleClose();
  };

  const Modal_Update_Section = (
    <dialog className="primary" ref={dialogRef} onClose={handleClose}>
      <h2>Atualize o título da secção</h2>
      <input
        type="text"
        id="section-name"
        value={sectionOnChangeInputValue}
        maxLength="70"
        onChange={(e) => {
          setSectionOnChangeInputValue(e.target.value);
        }}
        onKeyDown={handleKeyDownOnSectionTitleInput}
        name="section-name"
        aria-label="Nome da Seção"
      />
      <div className="btn-placement">
        <button
          className="primary-button pressed-look"
          type="button"
          onClick={handleUpdateSection}
        >
          Atualizar
        </button>
        <button className="primary-button" type="button" onClick={handleClose}>
          Cancelar
        </button>
      </div>
    </dialog>
  );

  const Modal_Delete_Section = (
    <dialog className="negative" ref={dialogRef} onClose={handleClose}>
      <h2>Apagar a secção</h2>
      <p>Tem a certeza que pretende apagar a secção selecionada?</p>
      <div className="section-name">
        <FontAwesomeIcon className="selected" icon={faAngleRight} />
        <p>{sectionOnChangeInputValue}</p>
      </div>
      <div className="btn-placement">
        <button
          className="negative-button pressed-look"
          type="button"
          onClick={handleRemoveSection}
        >
          Apagar
        </button>
        <button className="primary-button" type="button" onClick={handleClose}>
          Cancelar
        </button>
      </div>
    </dialog>
  );

  return modal === "updateSection"
    ? Modal_Update_Section
    : modal === "DeleteSection"
      ? Modal_Delete_Section
      : "";
}
