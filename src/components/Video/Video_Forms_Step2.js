import '@/styles/components/Forms_Video_Step2.scss';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faCaretDown, faFileArrowUp, faFilePen, faTrashCan, faPlay, faPause, faStop, faRotateLeft, faRotateRight } from '@fortawesome/free-solid-svg-icons';

import { faFileLines } from '@fortawesome/free-regular-svg-icons';

import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setCreatedContentLanguage, addVideoSubtitle } from '@/slicers/TempVideoContentSlice';

import { useDropzone } from 'react-dropzone';

import Video from 'next-video';

import Video_Subtitles_Section from '@/components/Video/Video_Subtitles_Section';
import Modal_Video_forms from '@/components/Video/Modal_Video_forms';
//import Audio_Visualiser from '@/components/Texto/Audio_Visualiser';
import StepValidationFeedback from '@/components/StepValidationFeedback';

export default function Video_Forms_Step2({ handlePreviousStep, handleSubmit, original_content_file, original_content_PreviewUrl, accessibleAudioFiles, setAccessibleAudioFiles }) {
  const created_content_language = useSelector((state) => state.TempVideoContentSlice.created_content_language);

  const videoSubtitles = useSelector((state) => state.TempVideoContentSlice.videoSubtitles);

  const dispatch = useDispatch();

  // const maxSize = 50 * 1024 * 1024; // 50 MB
  // const [error, setError] = useState('');

  const [selectedSubtitleId, setSelectedSubtitleId] = useState(''); // Guarda o Id da Secção que foi carregada para abrir o modal seja de edição ou para apagar

  const [subtitleTextOnChangeInputValue, setSubtitleTextOnChangeInputValue] = useState(''); // value do input do texto das legenda
  const [startTimeOnChangeInputValue, setStartTimeOnChangeInputValue] = useState(''); // value do input do tempo inicial das legenda
  const [endTimeOnChangeInputValue, setendTimeOnChangeInputValue] = useState(''); // value do input do tempo final das legenda

  const [isPlaying, setIsPlaying] = useState(false);

  const [handleAddSubtitleId, setHandleAddSubtitleId] = useState(2);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');

  useEffect(() => {
    if (videoSubtitles.length === 1) {
      // Não havia videoSubtitles antes, mostrar algum placeholder para a adição de subtitles
    }
  }, [videoSubtitles]);

  const [stepValidations, setStepValidations] = useState([]);
  const [allStepValidationsValid, setAllStepValidationsValid] = useState(false);
  useEffect(() => {
    setStepValidations([
      {
        title: 'Idioma do conteúdo criado',
        isValid: videoSubtitles.length > 0 && Boolean(created_content_language),
      },
      {
        title: 'Adicionar pelo menos uma legenda',
        isValid: videoSubtitles.length > 0, // usar > 0 em vez de so ver se tem length, para o isValid ser false em vez de 0 (que e falsy na mesma, mas nao e' boolean)
      },
    ]);
  }, [videoSubtitles, created_content_language /* accessibleAudioFiles */]);

  useEffect(() => {
    setAllStepValidationsValid(stepValidations.every((step) => step.isValid));
  }, [stepValidations]);

  // Save current audio time for each section, to allow switching between them and restore the previous time

  const videoRef = useRef(null); // Para os controlos do video

  const handleLoadedData = () => {
    // Pause the video once it has loaded data
    const video = videoRef.current;
    if (video) {
      video.pause();
    }
  };

  // const sectionTime = sectionsCurrentAudioTime[activeSectionId] || 0;

  /* function updateSectionTime(time, sectionId) {
    // Use the sectionId arg instead of this component activeSectionId, because
    // throttle still calls this callback after the section changed (so it should send the old section ID)
    // const previousTime = sectionsCurrentAudioTime[sectionId];
    // if (previousTime === time) {
    //   console.log(`updateSectionTime: section ${sectionId} - same time, not updating`);
    //   return;
    // }
    // console.log(`updateSectionTime: section ${sectionId} - different time (${previousTime} vs ${time}), updating`);
    // console.log(`updateSectionTime: section ${sectionId}, updating time: ${time}`);
    setSectionsCurrentAudioTime((state) => ({ ...state, [sectionId]: time }));
  } */

  /*  function deleteSectionAudioTimestamp(deletedSectionId) {
    setSectionsCurrentAudioTime((state) => {
      return Object.fromEntries(Object.entries(state).filter(([key]) => key !== deletedSectionId.toString()));
    });
  }
 */
  /* function handleSubtitleDeleted(deletedSectionId) {
    // deleteSectionAudioTimestamp(deletedSectionId);
  } */

  /* function handleRemoveSectionAudio() {
    setAccessibleAudioFiles((state) => state.filter((file) => file.id !== activeSectionId));
    // deleteSectionAudioTimestamp(activeSectionId);
  } */

  // Modal

  const openModal = (modal) => {
    setModalType(modal);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Adição de novas sections

  // Função para adicionar legendas (pelo teclado)
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleAddSubtitle();
    }
  };

  // Função para adicionar legendas (pelo botão)
  const handleAddSubtitle = () => {
    if (subtitleTextOnChangeInputValue) {
      // Garante que existe um nome para section (previne a criação de sections sem nome)
      dispatch(
        addVideoSubtitle({
          id: videoSubtitles.length ? handleAddSubtitleId : 1,
          startTime: startTimeOnChangeInputValue,
          endTime: endTimeOnChangeInputValue,
          text: subtitleTextOnChangeInputValue,
        }),
      );
      if (videoSubtitles.length) {
        setHandleAddSubtitleId((previousValue) => previousValue + 1);
      } else {
        setHandleAddSubtitleId(2);
      }

      setSubtitleTextOnChangeInputValue('');
    }
  };

  // Carregamento da vertente mais acessivel (Áudio)

  /*  const onDrop = (acceptedFiles, rejectedFiles) => {
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

    setError('');
  }; */

  /*  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'audio/mpeg': ['.mp3'],
      'audio/wav': ['.wav'],
    },
    maxSize: maxSize,
    multiple: false,
  }); */

  // Componente quando (não) há sections

  const videoDisplay = (
    <div className="video-display">
      <Video
        ref={videoRef}
        src={original_content_PreviewUrl} // Path to your video file in the public directory
        className="video"
        accentColor="#1167d3"
        autoPlay
        preload="metadata"
        onLoadedData={handleLoadedData}
        controls /* ={false}  */
      />

      {/* <div className="video-controls-bar">
        <div className="video-progress">
          <input
            type="range"
            min="0"
            max="1"
            step="0.001"
            value={played}
            onKeyDown={handleKeyDownPausePlay}
            onChange={handleSeekChange} // Update the video position when dragging
            style={{ width: '100%' }}
          />
          <p>
            {formatTime(currentTime)} / {formatTime(duration)}
          </p>
        </div>
        <div className="video-controls">
          <button onClick={onStop}>
            <FontAwesomeIcon icon={faStop} />
          </button>
          <button onClick={onPlayPause}>{isPlaying ? <FontAwesomeIcon icon={faPause} /> : <FontAwesomeIcon icon={faPlay} />}</button>
          <button onClick={() => quickJump(-3)}>
            <FontAwesomeIcon icon={faRotateLeft} />
          </button>
          <button onClick={() => quickJump(3)}>
            <FontAwesomeIcon icon={faRotateRight} />
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            onChange={(e) => updateVolume(e.target.value)}
            value={volume}
          />
        </div>
      </div> */}
    </div>
  );

  const allSubtitlesDisplay = <div className="all-subtitles-display"></div>;

  // Componente quando há sections

  const subtitlesCreationDisplay = (
    <div className="subtitles-creation-display">
      <div className="content-creation-left-side-bar">
        {/*  {videoSubtitles.map((item) => (
          <Video_Subtitles_Section
            key={item.id}
            item={item}
            selectedSubtitleId={selectedSubtitleId}
            setSelectedSubtitleId={setSelectedSubtitleId}
          />
        ))} */}

        <div className="language-container">
          <label htmlFor="created_content_language">Idioma</label>
          <div className="forms-select">
            <FontAwesomeIcon icon={faCaretDown} />
            <select
              id="created_content_language"
              name="created_content_language"
              value={created_content_language}
              onChange={(e) => dispatch(setCreatedContentLanguage(e.target.value))}
            >
              <option
                value=""
                disabled
              >
                Idioma do conteúdo criado...
              </option>
              <option value="Português">Português</option>
              <option value="English">English</option>
            </select>
          </div>
        </div>
      </div>
      <div className="content-creation-work-space">
        <Modal_Video_forms
          isOpen={isModalOpen}
          closeModal={closeModal}
          modal={modalType}
          /* setAccessibleAudioFiles={setAccessibleAudioFiles} */
          /* accessibleAudioFiles={accessibleAudioFiles} */
          selectedSubtitleId={selectedSubtitleId}
          /* handleSubtitleDeleted={handleSubtitleDeleted} */
        />
      </div>
    </div>
  );

  return (
    <div className="forms-step2-video">
      <div className="content-creation-container">
        {videoDisplay}
        {videoSubtitles.length > 0 ? subtitlesCreationDisplay : allSubtitlesDisplay}
      </div>

      {/* <div className="input-add-sections-container">
        <input
          type="text"
          placeholder="Adicionar secções..."
          value={sectionOnChangeInputValue} // Ao criar o componente certo de adição das legendas seria algo assim que precisava só que com os useState corretos das legendas e dos tempos
          aria-label="Campo de inserção de novas secções"
          aria-keyshortcuts="Enter"
          onChange={(e) => {
            setSubtitleTextOnChangeInputValue(e.target.value);
          }}
          onKeyDown={handleKeyDown}
          maxLength="70"
        />
        <button
          type="button"
          onClick={handleAddSubtitle}
          aria-label="Botão para a adição de secções"
        >
          <FontAwesomeIcon icon={faPlus} />
        </button>
      </div> */}

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
        {/* <div className="forms-step-input-feedback-container"> */}
        <div className="forms-step-feedback-bar with-padding">
          <StepValidationFeedback
            title="Requisitos obrigatórios para finalizar:"
            validation={stepValidations}
            gridColumns="text-step2"
          />
          <button
            className={allStepValidationsValid ? 'forms-button' : 'forms-button invalid'}
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
      {/* </div> */}
    </div>
  );
}
