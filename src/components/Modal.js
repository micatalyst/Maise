import { useRef, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  updateSectionTitle,
  removeSection,
  selectActiveSection,
} from "@/slicers/TempTextContentSlice";

import "@/styles/components/Modal.scss";

export default function Modal({ isOpen, closeModal, modal }) {
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

  // Atualiza o título da secção
  const handleUpdateSection = () => {
    // const updatedSection = { title: "Updated Title" };
    dispatch(
      updateSectionTitle({
        id: activeSection.id,
        title: sectionOnChangeInputValue,
      }),
    );
    handleClose();
  };

  // Apaga a secção
  const handleRemoveSection = () => {
    dispatch(removeSection(activeSection.id));
    handleClose();
  };

  const Modal_Update_Section = (
    <dialog ref={dialogRef} onClose={handleClose}>
      <h2>Atualizar o título da secção</h2>
      <label htmlFor="section-name">Nome da Seção:</label>
      <input
        type="text"
        id="section-name"
        value={sectionOnChangeInputValue}
        onChange={(e) => {
          setSectionOnChangeInputValue(e.target.value);
        }}
        name="section-name"
        aria-label="Nome da Seção"
      />
      <button onClick={handleUpdateSection}>Atualizar</button>
      <button onClick={handleClose}>Fechar</button>
    </dialog>
  );

  const Modal_Delete_Section = (
    <dialog ref={dialogRef} onClose={handleClose}>
      <h2>Apagar a secção {sectionOnChangeInputValue}?</h2>
      <button onClick={handleRemoveSection}>Apagar</button>
      <button onClick={handleClose}>Fechar</button>
    </dialog>
  );

  return modal === "updateSection"
    ? Modal_Update_Section
    : modal === "DeleteSection"
      ? Modal_Delete_Section
      : "";
}
