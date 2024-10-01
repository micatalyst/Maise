import '@/styles/components/Modal.scss';

import { useRef, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateVideoSubtitlesLanguage, selectActiveSubtitle, removeVideoSubtitle, updateVideoSubtitleCue } from '@/slicers/TempVideoContentSlice';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import CustomTimeInputModal from '@/components/Video/CustomTimeInputModal';

export default function Modal_Video_forms({ isOpen, closeModal, modal, isEditingCreatingSubtitleCues, videoCurrentTime, videoDuration, setStartTimeOnChangeInputValue }) {
  const dialogRef = useRef(null);

  const dispatch = useDispatch();

  const activeSubtitleObj = useSelector(selectActiveSubtitle);

  const activeSubtitleCueId = useSelector((state) => state.TempVideoContentSlice.activeSubtitleCueId);

  const [subtitleLanguageInputValue, setsubtitleLanguageInputValue] = useState('');
  const [subtitleTextInputValue, setSubtitleTextInputValue] = useState('');
  const [subtitleStartTimeInputValue, setSubtitleStartTimeInputValue] = useState('');
  const [subtitleEndTimeInputValue, setsubtitleEndTimeInputValue] = useState('');
  const [subtitleHaveTextValue, setSubtitleHaveTextValue] = useState('');

  const [subtitleHaveTextInicialVerification, setSubtitleHaveTextInicialVerification] = useState();

  // Abre o modal se o prop "isOpen" for verdadeiro
  useEffect(() => {
    if (isOpen && dialogRef.current && !isEditingCreatingSubtitleCues) {
      setsubtitleLanguageInputValue(activeSubtitleObj && activeSubtitleObj.language);
      dialogRef.current.showModal();
    }

    if (isOpen && dialogRef.current && isEditingCreatingSubtitleCues) {
      const activeSubtitleCueIndex = activeSubtitleObj.subtitlesCues.findIndex((videoSubtitleCues) => videoSubtitleCues.id === activeSubtitleCueId);
      setSubtitleTextInputValue(activeSubtitleObj.subtitlesCues[activeSubtitleCueIndex] && activeSubtitleObj.subtitlesCues[activeSubtitleCueIndex].text);
      setSubtitleStartTimeInputValue(activeSubtitleObj.subtitlesCues[activeSubtitleCueIndex] && activeSubtitleObj.subtitlesCues[activeSubtitleCueIndex].startTime);
      setsubtitleEndTimeInputValue(activeSubtitleObj.subtitlesCues[activeSubtitleCueIndex] && activeSubtitleObj.subtitlesCues[activeSubtitleCueIndex].endTime);
      setSubtitleHaveTextValue(activeSubtitleObj.subtitlesCues[activeSubtitleCueIndex] && activeSubtitleObj.subtitlesCues[activeSubtitleCueIndex].haveTextValue);
      setSubtitleHaveTextInicialVerification(true);
      dialogRef.current.showModal();
      //debugger;
    }
  }, [isOpen]);

  useEffect(() => {
    if (subtitleHaveTextInicialVerification && subtitleHaveTextValue !== undefined) {
      console.log('a verificação tá true');
      if (!subtitleHaveTextValue) {
        setSubtitleTextInputValue('');
      }
      setSubtitleHaveTextInicialVerification(false);
    }
    console.log('pelo menos entrou');
  }, [isOpen, subtitleHaveTextInicialVerification, subtitleHaveTextValue, subtitleTextInputValue]);

  // Fecha o modal quando clicado fora ou quando o botão fechar for acionado
  const handleClose = () => {
    dialogRef.current.close();
    closeModal();
  };

  // Atualiza o idioma das legendas
  const handleUpdateSubtitlesLanguage = () => {
    if (subtitleLanguageInputValue) {
      dispatch(
        updateVideoSubtitlesLanguage({
          language: subtitleLanguageInputValue,
        }),
      );
      handleClose();
    }
  };

  // Apaga as legendas
  const handleRemoveSubtitles = () => {
    dispatch(removeVideoSubtitle());
    handleClose();
  };

  // Atualiza os cues das Legendas

  const handleUpdateSubtitleCue = () => {
    dispatch(
      updateVideoSubtitleCue({
        startTime: subtitleStartTimeInputValue,
        endTime: subtitleEndTimeInputValue,
        text: subtitleTextInputValue ? subtitleTextInputValue : 'Preencha a legenda...',
        haveTextValue: subtitleTextInputValue ? true : false,
      }),
    );
    handleClose();
  };

  const Modal_Update_Subtitles_Language = (
    <dialog
      className="primary"
      ref={dialogRef}
      onClose={handleClose}
    >
      <h2>Atualize o idioma destas legendas</h2>
      <div className="forms-select">
        <select
          id="subtitle_created_language"
          name="subtitle_created_language"
          value={subtitleLanguageInputValue}
          onChange={(e) => setsubtitleLanguageInputValue(e.target.value)}
        >
          <option
            value=""
            disabled
          >
            Idioma da legenda...
          </option>
          <option value="Português">Português</option>
          <option value="English">English</option>
        </select>
      </div>
      <div className="btn-placement">
        <button
          className="primary-button pressed-look"
          type="button"
          onClick={handleUpdateSubtitlesLanguage}
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

  const Modal_Update_SubtitleCue = (
    <dialog
      className="primary"
      ref={dialogRef}
      onClose={handleClose}
    >
      <h2>Atualize o título da secção</h2>
      <input
        id="subtitle"
        type="text"
        className="subtitle"
        placeholder="Adicionar legenda..."
        maxLength="80"
        value={subtitleTextInputValue}
        onChange={(e) => setSubtitleTextInputValue(e.target.value)}
      />
      <CustomTimeInputModal
        label="Início"
        videoCurrentTime={videoCurrentTime}
        videoDuration={videoDuration}
        setStartTimeOnChangeInputValue={setSubtitleStartTimeInputValue}
        subtitleStartTimeInputValue={subtitleStartTimeInputValue}
      />
      <CustomTimeInputModal
        label="Fim"
        videoCurrentTime={videoCurrentTime}
        videoDuration={videoDuration}
        setEndTimeOnChangeInputValue={setsubtitleEndTimeInputValue}
        subtitleEndTimeInputValue={subtitleEndTimeInputValue}
      />
      <div className="btn-placement">
        <button
          className="primary-button pressed-look"
          type="button"
          onClick={handleUpdateSubtitleCue}
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

  const Modal_Delete_Subtitles = (
    <dialog
      className="negative"
      ref={dialogRef}
      onClose={handleClose}
    >
      <h2>Apagar legendas</h2>
      <p>Tem a certeza que pretende apagar estas legendas?</p>
      <div className="btn-placement">
        <button
          className="negative-button pressed-look"
          type="button"
          onClick={handleRemoveSubtitles}
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

  // const Modal_Delete_SubtitleCue = (
  //   <dialog
  //     className="negative"
  //     ref={dialogRef}
  //     onClose={handleClose}
  //   >
  //     <h2>Apagar secção</h2>
  //     <p>Tem a certeza que pretende apagar a secção selecionada?</p>
  //     <div className="section-name">
  //       <FontAwesomeIcon
  //         className="selected"
  //         icon={faAngleRight}
  //       />
  //       <p>{sectionOnChangeInputValue}</p>
  //     </div>
  //     <div className="btn-placement">
  //       <button
  //         className="negative-button pressed-look"
  //         type="button"
  //         onClick={handleRemoveSection}
  //       >
  //         Apagar
  //       </button>
  //       <button
  //         className="primary-button"
  //         type="button"
  //         onClick={handleClose}
  //       >
  //         Cancelar
  //       </button>
  //     </div>
  //   </dialog>
  // );

  switch (modal) {
    case 'updateSubtitlesLanguage':
      return Modal_Update_Subtitles_Language;
    case 'deleteSubtitles':
      return Modal_Delete_Subtitles;
    case 'updateSubtitleCue':
      return Modal_Update_SubtitleCue;
    /* case 'deleteSubtitleCue':
      return Modal_Delete_SubtitleCue; */
  }
}
