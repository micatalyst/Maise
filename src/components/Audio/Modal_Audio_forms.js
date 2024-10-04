import '@/styles/components/Modal.scss';

import { useRef, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateSectionTitle, removeSection } from '@/slicers/TempAudioContentSlice';

import CustomTimeInputModal from '@/components/Video/CustomTimeInputModal';

export default function Modal_Video_forms({ isOpen, closeModal, modal, audioCurrentTime, audioDuration }) {
  const dialogRef = useRef(null);

  const dispatch = useDispatch();

  const sections = useSelector((state) => state.TempAudioContentSlice.sections);

  const activeSectionId = useSelector((state) => state.TempAudioContentSlice.activeSectionId);

  const [titleInputValue, setTitleInputValue] = useState('');
  const [startTimeInputValue, setStartTimeInputValue] = useState('');
  const [endTimeInputValue, setEndTimeInputValue] = useState('');
  const [descriptionInputValue, setDescriptionInputValue] = useState('');

  // Abre o modal se o prop "isOpen" for verdadeiro
  useEffect(() => {
    if (isOpen && dialogRef.current) {
      const activeSectionIndex = sections.findIndex((section) => section.id === activeSectionId);
      setTitleInputValue(sections && sections[activeSectionIndex].title);
      setStartTimeInputValue(sections && sections[activeSectionIndex].startTime);
      setEndTimeInputValue(sections && sections[activeSectionIndex].endTime);
      setDescriptionInputValue(sections && sections[activeSectionIndex].description);

      dialogRef.current.showModal();
    }
  }, [isOpen]);

  // Fecha o modal quando clicado fora ou quando o botão fechar for acionado
  const handleClose = () => {
    dialogRef.current.close();
    closeModal();
  };

  // Atualiza a section

  const handleUpdateSection = () => {
    dispatch(
      updateSectionTitle({
        title: titleInputValue,
        description: descriptionInputValue,
        startTime: startTimeInputValue,
        endTime: endTimeInputValue,
      }),
    );
    handleClose();
  };

  // Apaga a section

  const handleRemoveSection = () => {
    dispatch(removeSection());
    handleClose();
  };

  const Modal_Update_Section = (
    <dialog
      className="primary"
      ref={dialogRef}
      onClose={handleClose}
    >
      <h2>Atualizar Secção</h2>
      <input
        id="title"
        type="text"
        placeholder="Titulo da secção..."
        maxLength="80"
        value={titleInputValue}
        onChange={(e) => setTitleInputValue(e.target.value)}
      />
      <div className="input-time-group">
        <CustomTimeInputModal
          label="Início"
          videoCurrentTime={audioCurrentTime}
          videoDuration={audioDuration}
          setStartTimeOnChangeInputValue={setStartTimeInputValue}
          subtitleStartTimeInputValue={startTimeInputValue}
        />
        <CustomTimeInputModal
          label="Fim"
          videoCurrentTime={audioCurrentTime}
          videoDuration={audioDuration}
          setEndTimeOnChangeInputValue={setEndTimeInputValue}
          subtitleEndTimeInputValue={endTimeInputValue}
        />
      </div>
      <textarea
        id="description"
        name="description"
        placeholder="Descrição do conteúdo..."
        value={descriptionInputValue}
        onChange={(e) => setDescriptionInputValue(e.target.value)}
      />
      <div className="btn-placement">
        <button
          className="primary-button pressed-look"
          type="button"
          onClick={handleUpdateSection}
        >
          Atualizar
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

  const Modal_Delete_Section = (
    <dialog
      className="negative"
      ref={dialogRef}
      onClose={handleClose}
    >
      <h2>Apagar Secção</h2>
      <p>Tem a certeza de que pretende apagar esta secção?</p>
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

  switch (modal) {
    case 'updateSection':
      return Modal_Update_Section;
    case 'deleteSection':
      return Modal_Delete_Section;
  }
}
