import '@/styles/components/Forms_Video_Step2.scss';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faCaretDown, faFileArrowUp, faFilePen, faTrashCan, faPlay, faPause, faStop, faRotateLeft, faRotateRight } from '@fortawesome/free-solid-svg-icons';

import Horizontal_Tab_Video_Forms from '@/components/Horizontal_Tab_Video_Forms';

import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setSubtitleCreatedLanguage, addVideoSubtitle } from '@/slicers/TempVideoContentSlice';

import { useDropzone } from 'react-dropzone';

import Video from 'next-video/player';

import Video_Subtitles_Section from '@/components/Video/Video_Subtitles_Section';
import Modal_Video_forms from '@/components/Video/Modal_Video_forms';
//import Audio_Visualiser from '@/components/Texto/Audio_Visualiser';
import StepValidationFeedback from '@/components/StepValidationFeedback';

export default function Video_Forms_Step2({ handlePreviousStep, handleSubmit, original_content_file, original_content_PreviewUrl, accessibleAudioFiles, setAccessibleAudioFiles }) {
  const subtitle_created_language = useSelector((state) => state.TempVideoContentSlice.subtitle_created_language);

  const videoSubtitles = useSelector((state) => state.TempVideoContentSlice.videoSubtitles);

  const dispatch = useDispatch();

  // const maxSize = 50 * 1024 * 1024; // 50 MB
  // const [error, setError] = useState('');

  const [selectedSubtitleId, setSelectedSubtitleId] = useState(''); // Id das legendas que foram selecionadas para serem editadas (Legendas no geral e não cues)
  const [selectedSubtitleCueId, setSelectedSubtitleCueId] = useState('');

  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isEditingCreatingSubtitleCues, setIsEditingCreatingSubtitleCues] = useState(false);

  const [subtitleTextOnChangeInputValue, setSubtitleTextOnChangeInputValue] = useState(''); // value do input do texto das legenda
  const [startTimeOnChangeInputValue, setStartTimeOnChangeInputValue] = useState(''); // value do input do tempo inicial das legenda
  const [endTimeOnChangeInputValue, setendTimeOnChangeInputValue] = useState(''); // value do input do tempo final das legenda

  const [filterTab, setFilterTab] = useState('Legendas');

  const [handleAddSubtitleId, setHandleAddSubtitleId] = useState(2);
  const [handleAddSubtitleCueId, setHandleAddSubtitleCueId] = useState(2);

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
        title: 'Adicionar pelo menos uma legenda',
        isValid: videoSubtitles.length > 0, // usar > 0 em vez de so ver se tem length, para o isValid ser false em vez de 0 (que e falsy na mesma, mas nao e' boolean)
      },
    ]);
  }, [videoSubtitles /* accessibleAudioFiles */]);

  useEffect(() => {
    setAllStepValidationsValid(stepValidations.every((step) => step.isValid));
  }, [stepValidations]);

  // Save current audio time for each section, to allow switching between them and restore the previous time

  const videoRef = useRef(null); // Para os controlos do video

  const handleLoadedData = () => {
    setIsVideoLoaded(true);

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

  /* const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      // handleAddSubtitle();
    }
  }; */

  // Função para adicionar legendas (pelo botão)

  const handleAddSubtitle = () => {
    if (subtitle_created_language) {
      const dateFormatter = new Intl.DateTimeFormat('pt-PT', { day: '2-digit', month: '2-digit', year: 'numeric' });

      dispatch(
        addVideoSubtitle({
          id: videoSubtitles.length ? handleAddSubtitleId : 1,
          language: subtitle_created_language,
          date: dateFormatter.format(new Date()),
          subtitlesCues: [],
        }),
      );
      if (videoSubtitles.length) {
        setHandleAddSubtitleId((previousValue) => previousValue + 1);
      } else {
        setHandleAddSubtitleId(2);
      }

      dispatch(setSubtitleCreatedLanguage(''));
    }
  };

  const handleAddSubtitleCues = () => {
    if (subtitleTextOnChangeInputValue) {
      // Garante que existe um nome para section (previne a criação de sections sem nome)
      dispatch(
        addVideoSubtitle({
          id: videoSubtitles.length ? handleAddSubtitleCueId : 1,
          startTime: startTimeOnChangeInputValue,
          endTime: endTimeOnChangeInputValue,
          text: subtitleTextOnChangeInputValue,
        }),
      );
      if (videoSubtitles.length) {
        setHandleAddSubtitleCueId((previousValue) => previousValue + 1);
      } else {
        setHandleAddSubtitleCueId(2);
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

  const handleTab = (activeTab) => {
    setFilterTab(activeTab);
  };

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
        /* onTimeUpdate={colocar aqui a função das legendas que vão atualizar consoante o tempo do vídeo muda } */
        controls
      />
    </div>
  );

  const AllSubtitlesTable = (
    <div className="all-subtitles-table">
      <div className="all-subtitles-table-header">
        <span>Idioma</span>
        <span>Data</span>
      </div>
      <div className="all-subtitles-table-content">
        {videoSubtitles &&
          videoSubtitles.map((item) => (
            <Video_Subtitles_Section
              key={item.id}
              id={item.id}
              language={item.language}
              date={item.date}
              setSelectedSubtitleId={setSelectedSubtitleId}
              setIsEditingCreatingSubtitleCues={setIsEditingCreatingSubtitleCues}
            />
          ))}
      </div>
    </div>
  );

  const allSubtitlesDisplay = (
    <div className="all-subtitles-display">
      <div className="language-set-subtitles-creation">
        <div className="language-container">
          <label htmlFor="subtitle_created_language">Idioma</label>
          <div className="forms-select">
            <FontAwesomeIcon icon={faCaretDown} />
            <select
              id="subtitle_created_language"
              name="subtitle_created_language"
              value={subtitle_created_language}
              onChange={(e) => dispatch(setSubtitleCreatedLanguage(e.target.value))}
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
        </div>
        <button
          className="primary-button"
          type="button"
          onClick={handleAddSubtitle}
        >
          Criar legendas
        </button>
      </div>
      {AllSubtitlesTable}
    </div>
  );

  // Componente quando há sections

  const subtitleCuesCreationDisplay = (
    <div className="subtitle-cues-creation-display">
      <div className="subtitle-cues-input-creation">
        <input
          id="subtitle"
          type="text"
          placeholder="Adicionar legenda..."
          maxLength="80"
          value={subtitleTextOnChangeInputValue}
          onChange={(e) => setSubtitleTextOnChangeInputValue(e.target.value)}
        />
        <div></div>
      </div>
    </div>
  );

  const audiodescriptionDisplay = <div className="audiodescription-display">audio description</div>;

  return (
    <div className="forms-step2-video">
      <div className="content-creation-container">
        {videoDisplay}
        {isVideoLoaded && (
          <div className="subtitles-workspace">
            {<Horizontal_Tab_Video_Forms onActiveTab={handleTab} />}
            {filterTab === 'Legendas' ? (isEditingCreatingSubtitleCues ? subtitleCuesCreationDisplay : allSubtitlesDisplay) : audiodescriptionDisplay}
          </div>
        )}
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
          // onClick={handleAddSubtitle}
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
  );
}