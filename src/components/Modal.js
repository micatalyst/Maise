import { useRef } from "react";

export default function Modal({ isOpen, closeModal }) {
  const dialogRef = useRef(null);

  // Abre o modal se o prop "isOpen" for verdadeiro
  if (isOpen && dialogRef.current) {
    dialogRef.current.showModal();
  }

  // Fecha o modal quando clicado fora ou quando o botão fechar for acionado
  const handleClose = () => {
    dialogRef.current.close();
    closeModal();
  };

  return (
    <dialog ref={dialogRef} onClose={handleClose}>
      <h2>Editar Nome da Seção</h2>
      <label htmlFor="section-name">Nome da Seção:</label>
      <input
        type="text"
        id="section-name"
        name="section-name"
        aria-label="Nome da Seção"
        //required
      />
      <button onClick={handleClose}>Fechar</button>
    </dialog>
  );
}
