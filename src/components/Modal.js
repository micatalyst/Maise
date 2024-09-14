import { useRef, useEffect } from "react";

export default function Modal({
  isOpen,
  closeModal,
  modal,
  activeSectionIndex,
  formData,
  setFormData,
}) {
  const dialogRef = useRef(null);

  // Abre o modal se o prop "isOpen" for verdadeiro
  useEffect(() => {
    if (isOpen && dialogRef.current) {
      dialogRef.current.showModal();
    }
  }, [isOpen]);

  // Fecha o modal quando clicado fora ou quando o botão fechar for acionado
  const handleClose = () => {
    dialogRef.current.close();
    closeModal();
  };

  const Modal_Update_Section = (
    <dialog ref={dialogRef} onClose={handleClose}>
      <h2>Update</h2>
      <label htmlFor="section-name">Nome da Seção:</label>
      <input
        type="text"
        id="section-name"
        value={formData.sections[activeSectionIndex].sectionTitle}
        onChange={(e) => {
          //setActiveSectionName(e.target.value);
          console.log(formData.sections[activeSectionIndex].sectionTitle);
        }}
        name="section-name"
        aria-label="Nome da Seção"
      />
      <button onClick={handleClose}>Fechar</button>
    </dialog>
  );

  const Modal_Delete_Section = (
    <dialog ref={dialogRef} onClose={handleClose}>
      <h2>Delete</h2>
      <label htmlFor="section-name">Nome da Seção:</label>
      <input
        type="text"
        id="section-name"
        name="section-name"
        aria-label="Nome da Seção"
      />
      <button onClick={handleClose}>Fechar</button>
    </dialog>
  );

  return modal === "updateSection"
    ? Modal_Update_Section
    : modal === "DeleteSection"
      ? Modal_Delete_Section
      : "";
}
