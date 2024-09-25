import { useRef, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeSection, selectActiveSection } from '@/slicers/TempImageContentSlice';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';

import '@/styles/components/Modal.scss';

export default function Modal_Image_forms({ isOpen, closeModal, modal, setAccessibleAudioFiles, accessibleAudioFiles, activeSectionId, handleSectionDeleted, handleRemoveSectionAudio, handlePreviousStep }) {
  const dialogRef = useRef(null);

  const dispatch = useDispatch();

  const [sectionIndex, setSectionIndex] = useState('');

  const activeSection = useSelector(selectActiveSection);
  const sections = useSelector((state) => state.TempImageContentSlice.sections);

  // Abre o modal se o prop "isOpen" for verdadeiro
  useEffect(() => {
    if (isOpen && dialogRef.current) {
      setSectionIndex(sections.findIndex((section) => section.id === activeSection.id));
      console.log(sections, activeSection.id);
      dialogRef.current.showModal();
    }
  }, [isOpen]);

  // Fecha o modal quando clicado fora ou quando o botão fechar for acionado
  const handleClose = () => {
    dialogRef.current.close();
    closeModal();
  };

  // Apaga a secção
  const handleRemoveSection = () => {
    dispatch(removeSection(activeSection.id));

    //Apaga o objeto do conteudo mais acessivel do array de todos os objetos onde este foi inserido
    setAccessibleAudioFiles(accessibleAudioFiles.filter((file) => file.id !== activeSectionId));

    handleSectionDeleted(activeSectionId);
    if (sections.length === 1) {
      handlePreviousStep();
    }
    handleClose();
  };

  const Modal_Delete_Section = (
    <dialog
      className="negative"
      ref={dialogRef}
      onClose={handleClose}
    >
      <h2>Apagar Imagem</h2>
      <p>Tem a certeza que pretende apagar a imagem selecionada?</p>
      <div className="section-name">
        <FontAwesomeIcon
          className="selected"
          icon={faAngleRight}
        />
        <p>Número: {sectionIndex + 1}</p>
      </div>
      <div className="btn-placement">
        <button
          className="negative-button pressed-look"
          type="button"
          onClick={handleRemoveSection}
        >
          Apagar
        </button>
        <button
          className="primary-button"
          type="button"
          onClick={handleClose}
        >
          Cancelar
        </button>
      </div>
    </dialog>
  );

  const Modal_Delete_Section_Audio = (
    <dialog
      className="negative"
      ref={dialogRef}
      onClose={handleClose}
    >
      <h2>Apagar o áudio</h2>
      <p>Tem a certeza que pretende apagar o áudio desta secção?</p>
      <div className="btn-placement">
        <button
          className="negative-button pressed-look"
          type="button"
          onClick={() => {
            handleRemoveSectionAudio();
            handleClose();
          }}
        >
          Apagar
        </button>
        <button
          className="primary-button"
          type="button"
          onClick={handleClose}
        >
          Cancelar
        </button>
      </div>
    </dialog>
  );

  switch (modal) {
    case 'deleteSection':
      return Modal_Delete_Section;
    case 'deleteSectionAudio':
      return Modal_Delete_Section_Audio;
  }
}
